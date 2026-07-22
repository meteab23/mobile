import { NextRequest, NextResponse } from "next/server";
import { getPolygonClient, hasPolygonKey } from "@/lib/polygon";
import {
  calculateGapPercent,
  calculateRelativeVolume,
  calculateRSI,
  calculateVWAP,
  barsToCandles,
} from "@daytrading/strategy";
import { parsePolygonError, withPolygonFallback } from "@/lib/polygon-cache";
import type { TickerDetails } from "@daytrading/polygon";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const ticker = symbol.toUpperCase();

  if (!hasPolygonKey()) {
    return NextResponse.json(getDemoSnapshot(ticker));
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

    let snapshot = null;
    try {
      snapshot = await client.getSnapshot(ticker);
    } catch {
      /* snapshot not included in plan */
    }

    let bars: Awaited<ReturnType<typeof client.getTodayAggregates>> = [];
    try {
      bars = await client.getTodayAggregates(ticker, 1, "minute");
    } catch {
      try {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - 30);
        bars = await client.getAggregates(
          ticker,
          1,
          "day",
          from.toISOString().slice(0, 10),
          to.toISOString().slice(0, 10),
          30
        );
      } catch {
        /* use prev close only */
      }
    }

    let avgVolume = 0;
    try {
      avgVolume = await withPolygonFallback(
        () => client.getAverageVolume(ticker),
        bars.length ? bars.reduce((s, b) => s + b.v, 0) / bars.length : 0,
        `avg-vol-${ticker}`
      );
    } catch {
      avgVolume = bars.length
        ? bars.reduce((s, b) => s + b.v, 0) / bars.length
        : 0;
    }

    const price = snapshot?.price ?? prevClose;
    const prev = snapshot?.prevClose ?? prevClose;
    const change = snapshot?.change ?? price - prev;
    const changePercent =
      snapshot?.changePercent ?? (prev ? ((price - prev) / prev) * 100 : 0);

    const candles = barsToCandles(bars);
    const vwap = candles.length ? calculateVWAP(candles) : price;
    const rsi = candles.length ? calculateRSI(candles) : 50;
    const dayVolume = snapshot?.dayVolume ?? bars.at(-1)?.v ?? 0;
    const gapPercent = calculateGapPercent(price, prev);
    const relativeVolume = calculateRelativeVolume(dayVolume, avgVolume || dayVolume);

    const preMarketBars = bars.filter((b) => {
      const et = new Date(b.t).toLocaleString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      });
      const [h, m] = et.split(":").map(Number);
      const mins = h * 60 + m;
      return mins >= 240 && mins < 570;
    });

    const planNote =
      !snapshot && bars.length === 0
        ? "Limited plan — showing previous close. Upgrade Polygon for live data."
        : !snapshot
          ? "Minute data unavailable on your plan — using daily bars."
          : undefined;

    return NextResponse.json({
      ticker,
      price,
      change,
      changePercent,
      dayOpen: snapshot?.dayOpen ?? bars.at(-1)?.o ?? price,
      dayHigh: snapshot?.dayHigh ?? bars.at(-1)?.h ?? price,
      dayLow: snapshot?.dayLow ?? bars.at(-1)?.l ?? price,
      dayVolume,
      prevClose: prev,
      gapPercent,
      relativeVolume,
      avgVolume,
      vwap,
      rsi,
      preMarketHigh: preMarketBars.length
        ? Math.max(...preMarketBars.map((b) => b.h))
        : null,
      preMarketLow: preMarketBars.length
        ? Math.min(...preMarketBars.map((b) => b.l))
        : null,
      marketCap: details?.marketCap,
      float:
        details?.weightedSharesOutstanding ??
        details?.shareClassSharesOutstanding,
      name: details?.name ?? ticker,
      description: details?.description,
      sicDescription: details?.sicDescription,
      dataMode: client.getDataMode(),
      planNote,
    });
  } catch (err) {
    return NextResponse.json(
      { error: parsePolygonError(err) || "Failed to fetch snapshot" },
      { status: 500 }
    );
  }
}

function getDemoSnapshot(ticker: string) {
  const base = 100 + (ticker.charCodeAt(0) % 50);
  return {
    ticker,
    price: base,
    change: 1.25,
    changePercent: 1.27,
    dayOpen: base - 0.5,
    dayHigh: base + 2,
    dayLow: base - 1.5,
    dayVolume: 12_500_000,
    prevClose: base - 1.25,
    gapPercent: 0.8,
    relativeVolume: 1.8,
    avgVolume: 7_000_000,
    vwap: base - 0.2,
    rsi: 58,
    preMarketHigh: base + 0.5,
    preMarketLow: base - 0.8,
    marketCap: 2_500_000_000_000,
    float: 15_000_000_000,
    name: `${ticker} Inc.`,
    dataMode: "demo",
  };
}
