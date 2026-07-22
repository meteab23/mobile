import { NextRequest, NextResponse } from "next/server";
import { getPolygonClient, hasPolygonKey } from "@/lib/polygon";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.length < 1) {
    return NextResponse.json({ results: [] });
  }

  if (!hasPolygonKey()) {
    const demo = ["AAPL", "TSLA", "NVDA", "MSFT", "AMD", "META", "GOOGL", "AMZN"]
      .filter((t) => t.includes(q.toUpperCase()))
      .map((t) => ({ ticker: t, name: `${t} Corporation`, market: "stocks", type: "CS" }));
    return NextResponse.json({ results: demo });
  }

  try {
    const client = getPolygonClient();
    const results = await client.searchTickers(q, 10);
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Search failed" },
      { status: 500 }
    );
  }
}
