import { NextRequest, NextResponse } from "next/server";
import { getPolygonClient, hasPolygonKey } from "@/lib/polygon";
import {
  evaluateBuyRecommendation,
  rankRecommendations,
  TOP_10_US_STOCKS,
  type BuyRecommendation,
} from "@daytrading/strategy";
import { getCached, setCache, withPolygonFallback } from "@/lib/polygon-cache";
import { PolygonClient } from "@daytrading/polygon";

const CACHE_KEY = "buy-signals-top10";
const CACHE_TTL = 45_000;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function analyzeTicker(
  client: ReturnType<typeof getPolygonClient>,
  ticker: string
): Promise<BuyRecommendation> {
  const prevClose = await withPolygonFallback(
    () => client.getPreviousClose(ticker),
    0,
    `prev-close-${ticker}`
  );

  const details = await withPolygonFallback(
    () => client.getTickerDetails(ticker),
    { ticker, name: ticker },
    `details-${ticker}`
  );

  let bars: Awaited<ReturnType<typeof client.getTodayAggregates>> = [];
  try {
    bars = await client.getTodayAggregates(ticker, 1, "minute");
  } catch {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    try {
      bars = await client.getAggregates(
        ticker,
        1,
        "day",
        from.toISOString().slice(0, 10),
        to.toISOString().slice(0, 10),
        30
      );
    } catch {
      if (prevClose > 0) {
        bars = [
          {
            t: Date.now(),
            o: prevClose,
            h: prevClose * 1.01,
            l: prevClose * 0.99,
            c: prevClose,
            v: 1_000_000,
          },
        ];
      }
    }
  }

  let avgVolume = 1_000_000;
  try {
    avgVolume = await withPolygonFallback(
      () => client.getAverageVolume(ticker),
      bars.reduce((s, b) => s + b.v, 0) / (bars.length || 1),
      `avg-vol-${ticker}`
    );
  } catch {
    /* use default */
  }

  const candles = bars.map((b) => ({
    time: b.t,
    open: b.o,
    high: b.h,
    low: b.l,
    close: b.c,
    volume: b.v,
  }));

  const financials = await withPolygonFallback(
    () => client.getFinancials(ticker, 4),
    [],
    `financials-${ticker}`
  );

  const rev0 = financials[0]?.revenue;
  const rev1 = financials[1]?.revenue;
  const revenueGrowth =
    rev0 && rev1 ? ((rev0 - rev1) / rev1) * 100 : undefined;

  return evaluateBuyRecommendation({
    ticker,
    name: details.name ?? ticker,
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
}

function getDemoRecommendations(): BuyRecommendation[] {
  const demos: BuyRecommendation[] = [
    {
      ticker: "NVDA",
      name: "NVIDIA Corporation",
      action: "BUY",
      confidence: 72,
      price: 142.5,
      changePercent: 2.1,
      entry: 142.5,
      stopLoss: 140.2,
      takeProfit1: 145.95,
      takeProfit2: 148.25,
      riskReward: 1.5,
      vwap: 141.8,
      rsi: 58,
      relativeVolume: 1.8,
      gapPercent: 1.5,
      reason: "ORB breakout above VWAP with strong relative volume",
      strategySignal: "ENTER_LONG",
      checklist: ["Price above VWAP", "RSI favorable (58.0)", "Strong volume (1.8x)"],
    },
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      action: "WAIT",
      confidence: 48,
      price: 327.74,
      changePercent: 0.4,
      vwap: 326.5,
      rsi: 55,
      relativeVolume: 1.1,
      gapPercent: 0.3,
      reason: "No confirmed entry — wait for ORB breakout with VWAP confirmation",
      strategySignal: "WATCH",
      checklist: ["Price above VWAP", "RSI favorable (55.0)", "Average volume (1.1x)"],
    },
    {
      ticker: "TSLA",
      name: "Tesla Inc.",
      action: "AVOID",
      confidence: 35,
      price: 248.0,
      changePercent: -1.2,
      vwap: 251.0,
      rsi: 38,
      relativeVolume: 0.9,
      gapPercent: -0.8,
      reason: "Below VWAP with weak volume — avoid until trend confirms",
      strategySignal: "WATCH",
      checklist: ["Price below VWAP", "RSI weak (38.0)", "Low volume (0.9x)"],
    },
  ];

  for (const t of TOP_10_US_STOCKS) {
    if (!demos.find((d) => d.ticker === t)) {
      demos.push({
        ticker: t,
        name: `${t} Inc.`,
        action: "WAIT",
        confidence: 40,
        price: 100 + t.charCodeAt(0),
        changePercent: 0.5,
        vwap: 100,
        rsi: 52,
        relativeVolume: 1.0,
        gapPercent: 0.2,
        reason: "Configure POLYGON_API_KEY for live analysis",
        strategySignal: "NONE",
        checklist: ["Demo mode"],
      });
    }
  }

  return rankRecommendations(demos).slice(0, 10);
}

export async function GET(req: NextRequest) {
  const refresh = req.nextUrl.searchParams.get("refresh") === "true";
  const marketStatus = hasPolygonKey()
    ? await withPolygonFallback(
        () => getPolygonClient().getMarketStatus(),
        {
          market: "unknown",
          serverTime: new Date().toISOString(),
          exchanges: { nasdaq: "closed", nyse: "closed", otc: "closed" },
          currencies: { crypto: "closed", fx: "closed" },
          earlyHours: false,
          afterHours: false,
          session: "closed" as const,
        },
        "market-status"
      )
    : null;

  if (!refresh) {
    const cached = getCached<{
      recommendations: BuyRecommendation[];
      updatedAt: string;
    }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json({
        ...cached,
        session: marketStatus?.session,
        sessionLabel: marketStatus
          ? PolygonClient.getSessionLabel(marketStatus.session)
          : "Demo",
        cached: true,
      });
    }
  }

  if (!hasPolygonKey()) {
    const recommendations = getDemoRecommendations();
    const payload = {
      recommendations,
      updatedAt: new Date().toISOString(),
      session: "closed",
      sessionLabel: "Demo Mode",
      strategy: "Master Day Strategy (ORB + S/R + Candles + EMA + Fundamentals)",
      cached: false,
    };
    return NextResponse.json(payload);
  }

  try {
    const client = getPolygonClient();
    const recommendations: BuyRecommendation[] = [];

    for (const ticker of TOP_10_US_STOCKS) {
      try {
        const rec = await analyzeTicker(client, ticker);
        recommendations.push(rec);
      } catch (err) {
        recommendations.push({
          ticker,
          name: ticker,
          action: "WAIT",
          confidence: 0,
          price: 0,
          changePercent: 0,
          vwap: 0,
          rsi: 50,
          relativeVolume: 1,
          gapPercent: 0,
          reason: err instanceof Error ? err.message : "Analysis failed",
          strategySignal: "ERROR",
          checklist: [],
        });
      }
      await sleep(350);
    }

    const ranked = rankRecommendations(recommendations);
    const updatedAt = new Date().toISOString();

    setCache(CACHE_KEY, { recommendations: ranked, updatedAt }, CACHE_TTL);

    const buyCount = ranked.filter((r) => r.action === "BUY").length;
    const waitCount = ranked.filter((r) => r.action === "WAIT").length;
    const avoidCount = ranked.filter((r) => r.action === "AVOID").length;

    return NextResponse.json({
      recommendations: ranked,
      updatedAt,
      session: marketStatus?.session,
      sessionLabel: marketStatus
        ? PolygonClient.getSessionLabel(marketStatus.session)
        : undefined,
      strategy: "Master Day Strategy (ORB + S/R + Candles + EMA + Fundamentals)",
      summary: {
        buy: buyCount,
        wait: waitCount,
        avoid: avoidCount,
        topPick: ranked.find((r) => r.action === "BUY")?.ticker ?? null,
      },
      cached: false,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Buy signals analysis failed",
        recommendations: getDemoRecommendations(),
        updatedAt: new Date().toISOString(),
        strategy: "Master Day Strategy (ORB + S/R + Candles + EMA + Fundamentals)",
        cached: false,
      },
      { status: 200 }
    );
  }
}
