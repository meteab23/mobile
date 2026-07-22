import { NextRequest, NextResponse } from "next/server";
import { getPolygonClient, hasPolygonKey } from "@/lib/polygon";
import { calculateGapPercent, calculateRelativeVolume, calculateRSI, calculateVWAP, barsToCandles } from "@daytrading/strategy";

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
    const [snapshot, details, avgVolume, bars, prevClose] = await Promise.all([
      client.getSnapshot(ticker),
      client.getTickerDetails(ticker).catch(() => null),
      client.getAverageVolume(ticker),
      client.getTodayAggregates(ticker, 1, "minute"),
      client.getPreviousClose(ticker),
    ]);

    const candles = barsToCandles(bars);
    const vwap = calculateVWAP(candles);
    const rsi = calculateRSI(candles);
    const gapPercent = calculateGapPercent(snapshot.price, prevClose || snapshot.prevClose);
    const relativeVolume = calculateRelativeVolume(snapshot.dayVolume, avgVolume);

    const preMarketBars = bars.filter((b) => {
      const d = new Date(b.t);
      const et = d.toLocaleString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "numeric", hour12: false });
      const [h, m] = et.split(":").map(Number);
      const mins = h * 60 + m;
      return mins >= 240 && mins < 570;
    });

    const preMarketHigh = preMarketBars.length ? Math.max(...preMarketBars.map((b) => b.h)) : null;
    const preMarketLow = preMarketBars.length ? Math.min(...preMarketBars.map((b) => b.l)) : null;

    return NextResponse.json({
      ticker,
      price: snapshot.price,
      change: snapshot.change,
      changePercent: snapshot.changePercent,
      dayOpen: snapshot.dayOpen,
      dayHigh: snapshot.dayHigh,
      dayLow: snapshot.dayLow,
      dayVolume: snapshot.dayVolume,
      prevClose: prevClose || snapshot.prevClose,
      gapPercent,
      relativeVolume,
      avgVolume,
      vwap,
      rsi,
      preMarketHigh,
      preMarketLow,
      marketCap: details?.marketCap,
      float: details?.weightedSharesOutstanding ?? details?.shareClassSharesOutstanding,
      name: details?.name ?? ticker,
      description: details?.description,
      sicDescription: details?.sicDescription,
      dataMode: client.getDataMode(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch snapshot" },
      { status: 500 }
    );
  }
}

function getDemoSnapshot(ticker: string) {
  const base = 100 + ticker.charCodeAt(0) % 50;
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
