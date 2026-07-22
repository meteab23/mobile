import { NextRequest, NextResponse } from "next/server";
import { getPolygonClient, hasPolygonKey } from "@/lib/polygon";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const ticker = symbol.toUpperCase();
  const multiplier = Number(req.nextUrl.searchParams.get("multiplier") ?? 1);
  const timespan = (req.nextUrl.searchParams.get("timespan") ?? "minute") as "minute" | "hour";

  if (!hasPolygonKey()) {
    return NextResponse.json({ bars: generateDemoBars(ticker, multiplier) });
  }

  try {
    const client = getPolygonClient();
    const bars = await client.getTodayAggregates(ticker, multiplier, timespan);
    return NextResponse.json({ bars, dataMode: client.getDataMode() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch bars" },
      { status: 500 }
    );
  }
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
