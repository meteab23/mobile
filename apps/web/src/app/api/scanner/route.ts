import { NextRequest, NextResponse } from "next/server";
import { getPolygonClient, hasPolygonKey } from "@/lib/polygon";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") ?? "gainers";
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 20);

  if (!hasPolygonKey()) {
    const demo = ["NVDA", "TSLA", "AMD", "META", "AAPL"].map((ticker, i) => ({
      ticker,
      price: 100 + i * 15,
      change: 2 + i,
      changePercent: 1.5 + i * 0.5,
      volume: 5_000_000 + i * 1_000_000,
    }));
    return NextResponse.json({ type, results: demo });
  }

  try {
    const client = getPolygonClient();
    const results =
      type === "losers"
        ? await client.getLosers(limit)
        : await client.getGainers(limit);

    const minPrice = 5;
    const minVolume = 100_000;
    const filtered = results.filter(
      (r) => r.price >= minPrice && r.volume >= minVolume
    );

    return NextResponse.json({ type, results: filtered });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Scanner failed" },
      { status: 500 }
    );
  }
}
