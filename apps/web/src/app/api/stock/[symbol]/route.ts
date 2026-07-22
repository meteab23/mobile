import { NextRequest, NextResponse } from "next/server";
import { getPolygonClient, hasPolygonKey } from "@/lib/polygon";
import { withPolygonFallback } from "@/lib/polygon-cache";
import {
  analyzeDayStrategy,
  analyzeSupportResistance,
  buildScalpTradeSignal,
  calculateEMA,
  calculateRSI,
  calculateScalpLevels,
  detectCandlePatterns,
  detectTrend,
  type ScalpTarget,
} from "@daytrading/strategy";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const ticker = symbol.toUpperCase();
  const scalpTarget = Number(req.nextUrl.searchParams.get("scalp") ?? 3) as ScalpTarget;

  if (!hasPolygonKey()) {
    return NextResponse.json(getDemoStock(ticker, scalpTarget));
  }

  try {
    const client = getPolygonClient();

    const [prevClose, details, news, financials] = await Promise.all([
      withPolygonFallback(() => client.getPreviousClose(ticker), 100, `prev-${ticker}`),
      withPolygonFallback(() => client.getTickerDetails(ticker), { ticker, name: ticker }, `det-${ticker}`),
      withPolygonFallback(() => client.getNews(ticker, 6), [], `news-${ticker}`),
      withPolygonFallback(() => client.getFinancials(ticker, 2), [], `fin-${ticker}`),
    ]);

    let dailyBars: Awaited<ReturnType<typeof client.getAggregates>> = [];
    try {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 90);
      dailyBars = await client.getAggregates(
        ticker,
        1,
        "day",
        from.toISOString().slice(0, 10),
        to.toISOString().slice(0, 10),
        90
      );
    } catch {
      dailyBars = [{ t: Date.now(), o: prevClose, h: prevClose * 1.02, l: prevClose * 0.98, c: prevClose, v: 1e6 }];
    }

    const candles = dailyBars.map((b) => ({
      time: b.t,
      open: b.o,
      high: b.h,
      low: b.l,
      close: b.c,
      volume: b.v,
    }));

    const price = candles.at(-1)?.close ?? prevClose;
    const closes = candles.map((c) => c.close);
    const ema9 = calculateEMA(closes, 9);
    const ema21 = calculateEMA(closes, 21);
    const rsi = calculateRSI(candles);
    const sr = analyzeSupportResistance(candles, price);
    const trend = detectTrend(ema9, ema21, price);
    const patterns = detectCandlePatterns(candles);
    const scalpLong = calculateScalpLevels(price, scalpTarget, "long");
    const scalpShort = calculateScalpLevels(price, scalpTarget, "short");

    const avgVolume =
      dailyBars.length > 0
        ? dailyBars.reduce((s, b) => s + b.v, 0) / dailyBars.length
        : 1_000_000;
    const rev0 = financials[0]?.revenue;
    const rev1 = financials[1]?.revenue;

    const dayStrategy = analyzeDayStrategy({
      ticker,
      candles,
      previousClose: prevClose,
      averageVolume: avgVolume,
      fundamentals: {
        marketCap: details.marketCap,
        revenueGrowth: rev0 && rev1 ? ((rev0 - rev1) / rev1) * 100 : undefined,
        netIncome: financials[0]?.netIncome,
        sector: details.sicDescription,
      },
    });

    const tradeSignal = buildScalpTradeSignal(
      dayStrategy,
      scalpLong,
      scalpShort,
      scalpTarget
    );

    return NextResponse.json({
      ticker,
      name: details.name ?? ticker,
      price,
      changePercent: prevClose ? ((price - prevClose) / prevClose) * 100 : 0,
      marketCap: details.marketCap,
      sector: details.sicDescription,
      trend,
      rsi,
      ema9,
      ema21,
      supportResistance: {
        support: sr.nearestSupport,
        resistance: sr.nearestResistance,
        position: sr.pricePosition,
        pivot: sr.pivotPoint,
      },
      candlePattern: patterns[0],
      dailyBars: dailyBars.map((b) => ({ t: b.t, o: b.o, h: b.h, l: b.l, c: b.c, v: b.v })),
      news: news.map((n) => ({
        title: n.title,
        url: n.articleUrl,
        time: n.publishedUtc,
        sentiment: n.insights?.[0]?.sentiment,
      })),
      fundamentals: {
        revenue: financials[0]?.revenue,
        netIncome: financials[0]?.netIncome,
      },
      scalp: { long: scalpLong, short: scalpShort, targetPercent: scalpTarget },
      tradeSignal,
      technicalAnalysis: {
        compositeScore: dayStrategy.compositeScore,
        action: dayStrategy.action,
        direction: dayStrategy.direction,
        vwap: dayStrategy.vwap,
        relativeVolume: dayStrategy.relativeVolume,
        strategyScores: dayStrategy.strategyScores.map((s) => ({
          name: s.name,
          score: s.score,
          bias: s.bias,
          detail: s.detail,
        })),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load stock" },
      { status: 500 }
    );
  }
}

function getDemoStock(ticker: string, scalpTarget: ScalpTarget) {
  const price = 100 + ticker.charCodeAt(0);
  const candles = [
    { time: Date.now(), open: price * 0.99, high: price * 1.01, low: price * 0.98, close: price, volume: 1e6 },
  ];
  const dayStrategy = analyzeDayStrategy({
    ticker,
    candles,
    previousClose: price * 0.99,
    averageVolume: 1e6,
  });
  const scalpLong = calculateScalpLevels(price, scalpTarget, "long");
  const scalpShort = calculateScalpLevels(price, scalpTarget, "short");
  const tradeSignal = buildScalpTradeSignal(dayStrategy, scalpLong, scalpShort, scalpTarget);

  return {
    ticker,
    name: `${ticker} Inc.`,
    price,
    changePercent: 1.2,
    trend: { trend: "up", label: "Uptrend (demo)" },
    rsi: 55,
    supportResistance: { support: price * 0.97, resistance: price * 1.03, position: "mid_range" },
    candlePattern: { pattern: "none", signal: "neutral", description: "Demo mode" },
    dailyBars: [],
    news: [],
    scalp: {
      long: scalpLong,
      short: scalpShort,
      targetPercent: scalpTarget,
    },
    tradeSignal,
    technicalAnalysis: {
      compositeScore: dayStrategy.compositeScore,
      action: dayStrategy.action,
      direction: dayStrategy.direction,
      vwap: dayStrategy.vwap,
      relativeVolume: dayStrategy.relativeVolume,
      strategyScores: dayStrategy.strategyScores.map((s) => ({
        name: s.name,
        score: s.score,
        bias: s.bias,
        detail: s.detail,
      })),
    },
  };
}
