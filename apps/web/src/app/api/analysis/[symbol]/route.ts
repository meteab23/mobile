import { NextRequest, NextResponse } from "next/server";
import { getPolygonClient, hasPolygonKey } from "@/lib/polygon";
import { analyzeMove } from "@daytrading/ai";
import { calculateGapPercent, calculateRelativeVolume, calculateRSI, calculateVWAP, barsToCandles, OrbVwapStrategy } from "@daytrading/strategy";
import { db, initDb } from "@/lib/db";
import { analysisCache } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

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
    const demo = await analyzeMove({
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
    }, provider);
    return NextResponse.json(demo);
  }

  try {
    const client = getPolygonClient();
    const [snapshot, details, news, financials, bars, prevClose, avgVolume, marketStatus] =
      await Promise.all([
        client.getSnapshot(ticker),
        client.getTickerDetails(ticker),
        client.getNews(ticker, 8),
        client.getFinancials(ticker, 4),
        client.getTodayAggregates(ticker, 1, "minute"),
        client.getPreviousClose(ticker),
        client.getAverageVolume(ticker),
        client.getMarketStatus(),
      ]);

    const candles = barsToCandles(bars);
    const vwap = calculateVWAP(candles);
    const rsi = calculateRSI(candles);
    const gapPercent = calculateGapPercent(snapshot.price, prevClose);
    const relativeVolume = calculateRelativeVolume(snapshot.dayVolume, avgVolume);

    const strategy = new OrbVwapStrategy();
    strategy.evaluate(ticker, candles, prevClose, avgVolume);
    const state = strategy.getState(ticker);

    const analysis = await analyzeMove(
      {
        ticker,
        price: snapshot.price,
        changePercent: snapshot.changePercent,
        gapPercent,
        relativeVolume,
        vwap,
        rsi,
        session: marketStatus.session,
        openingRange: state?.openingRange ?? null,
        news: news.map((n) => ({
          title: n.title,
          url: n.articleUrl,
          publishedUtc: n.publishedUtc,
          sentiment: n.insights?.[0]?.sentiment,
          sentimentReasoning: n.insights?.[0]?.sentimentReasoning,
        })),
        financials,
        tickerDetails: {
          name: details.name,
          marketCap: details.marketCap,
          description: details.description,
          sicDescription: details.sicDescription,
        },
      },
      provider
    );

    db.insert(analysisCache).values({
      ticker,
      payload: JSON.stringify(analysis),
    }).run();

    return NextResponse.json(analysis);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
