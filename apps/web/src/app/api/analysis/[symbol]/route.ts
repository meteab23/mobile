import { NextRequest, NextResponse } from "next/server";
import { getPolygonClient, hasPolygonKey } from "@/lib/polygon";
import { analyzeMove } from "@daytrading/ai";
import {
  calculateGapPercent,
  calculateRelativeVolume,
  calculateRSI,
  calculateVWAP,
  barsToCandles,
  analyzeDayStrategy,
} from "@daytrading/strategy";
import { db, initDb } from "@/lib/db";
import { analysisCache } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { parsePolygonError, withPolygonFallback } from "@/lib/polygon-cache";
import type { TickerDetails } from "@daytrading/polygon";

initDb();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const ticker = symbol.toUpperCase();
  const provider = (process.env.AI_PROVIDER as "openai" | "anthropic") ?? "openai";

  const cached = db
    .select()
    .from(analysisCache)
    .where(eq(analysisCache.ticker, ticker))
    .orderBy(desc(analysisCache.createdAt))
    .limit(1)
    .all();

  if (cached[0]) {
    const age = Date.now() - new Date(cached[0].createdAt).getTime();
    if (age < 15 * 60 * 1000) {
      return NextResponse.json(JSON.parse(cached[0].payload));
    }
  }

  if (!hasPolygonKey()) {
    const demo = await analyzeMove(
      {
        ticker,
        price: 150,
        changePercent: 1.5,
        gapPercent: 0.8,
        relativeVolume: 1.8,
        vwap: 149.5,
        rsi: 58,
        session: "regular",
        openingRange: { high: 151, low: 148, complete: true },
        news: [],
        financials: [],
        tickerDetails: { name: `${ticker} Inc.` },
      },
      provider
    );
    return NextResponse.json(demo);
  }

  try {
    const client = getPolygonClient();

    const prevClose = await withPolygonFallback(
      () => client.getPreviousClose(ticker),
      0,
      `prev-close-${ticker}`
    );

    const details = await withPolygonFallback<TickerDetails | null>(
      () => client.getTickerDetails(ticker),
      null,
      `details-${ticker}`
    );

    const news = await withPolygonFallback(
      () => client.getNews(ticker, 8),
      [],
      `news-${ticker}`
    );

    const financials = await withPolygonFallback(
      () => client.getFinancials(ticker, 4),
      [],
      `financials-${ticker}`
    );

    const marketStatus = await withPolygonFallback(
      () => client.getMarketStatus(),
      {
        market: "unknown",
        serverTime: new Date().toISOString(),
        exchanges: { nasdaq: "closed", nyse: "closed", otc: "closed" },
        currencies: { crypto: "closed", fx: "closed" },
        earlyHours: false,
        afterHours: false,
        session: "regular" as const,
      },
      "market-status"
    );

    let snapshot = null;
    try {
      snapshot = await client.getSnapshot(ticker);
    } catch {
      /* not on plan */
    }

    let bars: Awaited<ReturnType<typeof client.getTodayAggregates>> = [];
    try {
      bars = await client.getTodayAggregates(ticker, 1, "minute");
    } catch {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 60);
      try {
        bars = await client.getAggregates(
          ticker,
          1,
          "day",
          from.toISOString().slice(0, 10),
          to.toISOString().slice(0, 10),
          60
        );
      } catch {
        /* empty */
      }
    }

    const price = snapshot?.price ?? prevClose;
    const changePercent =
      snapshot?.changePercent ??
      (prevClose ? ((price - prevClose) / prevClose) * 100 : 0);
    const gapPercent = calculateGapPercent(price, prevClose);
    const candles = barsToCandles(bars);
    const vwap = candles.length ? calculateVWAP(candles) : price;
    const rsi = candles.length ? calculateRSI(candles) : 50;
    const relativeVolume = calculateRelativeVolume(
      snapshot?.dayVolume ?? bars.at(-1)?.v ?? 0,
      1_000_000
    );

    const rev0 = financials[0]?.revenue;
    const rev1 = financials[1]?.revenue;
    const revenueGrowth =
      rev0 && rev1 ? ((rev0 - rev1) / rev1) * 100 : undefined;

    const dayStrategy = analyzeDayStrategy({
      ticker,
      candles,
      previousClose: prevClose,
      averageVolume: 1_000_000,
      fundamentals: {
        marketCap: details?.marketCap,
        revenueGrowth,
        netIncome: financials[0]?.netIncome,
        sector: details?.sicDescription,
      },
    });

    const analysis = await analyzeMove(
      {
        ticker,
        price,
        changePercent,
        gapPercent,
        relativeVolume,
        vwap,
        rsi,
        session: marketStatus.session,
        openingRange: dayStrategy.supportResistance
          ? {
              high: dayStrategy.supportResistance.nearestResistance ?? price,
              low: dayStrategy.supportResistance.nearestSupport ?? price,
              complete: true,
            }
          : null,
        news: news.map((n) => ({
          title: n.title,
          url: n.articleUrl,
          publishedUtc: n.publishedUtc,
          sentiment: n.insights?.[0]?.sentiment,
          sentimentReasoning: n.insights?.[0]?.sentimentReasoning,
        })),
        financials,
        tickerDetails: {
          name: details?.name ?? ticker,
          marketCap: details?.marketCap,
          description: details?.description,
          sicDescription: details?.sicDescription,
        },
        dayStrategy: {
          action: dayStrategy.action,
          direction: dayStrategy.direction,
          compositeScore: dayStrategy.compositeScore,
          summary: dayStrategy.summary,
          nearestSupport: dayStrategy.supportResistance.nearestSupport ?? undefined,
          nearestResistance: dayStrategy.supportResistance.nearestResistance ?? undefined,
          candlePattern: dayStrategy.candlePatterns[0]?.pattern,
          strategyScores: dayStrategy.strategyScores.map((s) => ({
            name: s.name,
            score: s.score,
            bias: s.bias,
            detail: s.detail,
          })),
          evenRisk: dayStrategy.evenRisk,
        },
      },
      provider
    );

    db.insert(analysisCache)
      .values({ ticker, payload: JSON.stringify(analysis) })
      .run();

    return NextResponse.json(analysis);
  } catch (err) {
    const fallback = await analyzeMove(
      {
        ticker,
        price: 0,
        changePercent: 0,
        gapPercent: 0,
        relativeVolume: 1,
        vwap: 0,
        rsi: 50,
        session: "regular",
        news: [],
        financials: [],
        tickerDetails: { name: ticker },
      },
      provider
    );
    return NextResponse.json({
      ...fallback,
      moveSummary: {
        ...fallback.moveSummary,
        summary: `${parsePolygonError(err)} — showing best-effort analysis.`,
      },
    });
  }
}
