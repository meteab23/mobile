import { NextRequest, NextResponse } from "next/server";
import { getPolygonClient, hasPolygonKey } from "@/lib/polygon";
import { parsePolygonError, withPolygonFallback } from "@/lib/polygon-cache";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const ticker = symbol.toUpperCase();
  const multiplier = Number(req.nextUrl.searchParams.get("multiplier") ?? 1);

  if (!hasPolygonKey()) {
    return NextResponse.json({ bars: generateDemoBars(ticker, multiplier) });
  }

  try {
    const client = getPolygonClient();
    let bars: Array<{ t: number; o: number; h: number; l: number; c: number; v: number }> = [];
    let planNote: string | undefined;

    try {
      bars = await client.getTodayAggregates(ticker, multiplier, "minute");
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
        planNote = "Your Polygon plan does not include minute bars — showing daily candles.";
      } catch {
        const prevClose = await withPolygonFallback(
          () => client.getPreviousClose(ticker),
          100,
          `prev-close-${ticker}`
        );
        bars = synthesizeFromPrice(ticker, prevClose, multiplier);
        planNote = "Using previous close data — Polygon rate limit or plan restriction.";
      }
    }

    return NextResponse.json({
      bars,
      dataMode: client.getDataMode(),
      planNote,
    });
  } catch (err) {
    return NextResponse.json({
      bars: generateDemoBars(ticker, multiplier),
      planNote: parsePolygonError(err),
    });
  }
}

function synthesizeFromPrice(ticker: string, price: number, multiplier: number) {
  const base = price || 100 + (ticker.charCodeAt(0) % 30);
  const now = Date.now();
  const bars = [];
  for (let i = 30; i >= 0; i--) {
    const t = now - i * multiplier * 60_000 * 60 * 24;
    const o = base + Math.sin(i / 5) * (base * 0.01);
    bars.push({
      t,
      o,
      h: o + base * 0.005,
      l: o - base * 0.005,
      c: o + (Math.sin(i) * base * 0.002),
      v: 1_000_000,
    });
  }
  return bars;
}

function generateDemoBars(ticker: string, multiplier: number) {
  const base = 100 + (ticker.charCodeAt(0) % 30);
  const now = Date.now();
  const bars = [];
  for (let i = 60; i >= 0; i--) {
    const t = now - i * multiplier * 60_000;
    const o = base + Math.sin(i / 5) * 2;
    bars.push({
      t,
      o,
      h: o + 0.5,
      l: o - 0.5,
      c: o + (Math.random() - 0.5) * 0.3,
      v: 50_000 + Math.random() * 100_000,
    });
  }
  return bars;
}
