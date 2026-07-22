import { NextRequest, NextResponse } from "next/server";
import { getPolygonClient, hasPolygonKey } from "@/lib/polygon";
import { analyzeDayStrategy } from "@daytrading/strategy";
import { withPolygonFallback } from "@/lib/polygon-cache";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const ticker = symbol.toUpperCase();

  if (!hasPolygonKey()) {
    return NextResponse.json(getDemoAnalysis(ticker));
  }

  try {
    const client = getPolygonClient();

    const prevClose = await withPolygonFallback(
      () => client.getPreviousClose(ticker),
      100,
      `prev-close-${ticker}`
    );

    const details = await withPolygonFallback(
      () => client.getTickerDetails(ticker),
      { ticker, name: ticker },
      `details-${ticker}`
    );

    const financials = await withPolygonFallback(
      () => client.getFinancials(ticker, 4),
      [],
      `financials-${ticker}`
    );

    let bars: Awaited<ReturnType<typeof client.getTodayAggregates>> = [];
    try {
      bars = await client.getTodayAggregates(ticker, 1, "minute");
    } catch {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 60);
      bars = await client.getAggregates(
        ticker,
        1,
        "day",
        from.toISOString().slice(0, 10),
        to.toISOString().slice(0, 10),
        60
      );
    }

    let avgVolume = 1_000_000;
    try {
      avgVolume = await withPolygonFallback(
        () => client.getAverageVolume(ticker),
        1_000_000,
        `avg-vol-${ticker}`
      );
    } catch {
      /* default */
    }

    const rev0 = financials[0]?.revenue;
    const rev1 = financials[1]?.revenue;
    const revenueGrowth =
      rev0 && rev1 ? ((rev0 - rev1) / rev1) * 100 : undefined;

    const candles = bars.map((b) => ({
      time: b.t,
      open: b.o,
      high: b.h,
      low: b.l,
      close: b.c,
      volume: b.v,
    }));

    const analysis = analyzeDayStrategy({
      ticker,
      candles,
      previousClose: prevClose,
      averageVolume: avgVolume,
      fundamentals: {
        marketCap: details.marketCap,
        revenueGrowth,
        netIncome: financials[0]?.netIncome,
        sector: details.sicDescription,
      },
    });

    return NextResponse.json({
      ...analysis,
      name: details.name ?? ticker,
      strategiesUsed: [
        "ORB + VWAP Breakout",
        "Support / Resistance",
        "Candlestick Patterns",
        "EMA 9/21 + RSI",
        "Volume Confirmation",
        "Fundamentals",
      ],
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Strategy analysis failed" },
      { status: 500 }
    );
  }
}

function getDemoAnalysis(ticker: string) {
  const price = 150;
  return {
    ticker,
    name: `${ticker} Inc.`,
    action: "WAIT",
    direction: "sideways",
    confidence: 50,
    compositeScore: 50,
    price,
    strategiesUsed: ["ORB + VWAP", "S/R", "Candlesticks", "EMA/RSI", "Volume", "Fundamentals"],
    supportResistance: {
      nearestSupport: price * 0.98,
      nearestResistance: price * 1.02,
      pricePosition: "mid_range",
    },
    summary: "Configure POLYGON_API_KEY for live multi-strategy analysis",
  };
}
