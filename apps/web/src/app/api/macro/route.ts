import { NextResponse } from "next/server";
import { getPolygonClient, hasPolygonKey } from "@/lib/polygon";
import { withPolygonFallback } from "@/lib/polygon-cache";
import { PolygonClient } from "@daytrading/polygon";

export async function GET() {
  if (!hasPolygonKey()) {
    return NextResponse.json({
      session: "closed",
      sessionLabel: "Demo",
      indices: [
        { symbol: "SPY", name: "S&P 500", price: 580, changePercent: 0.4 },
        { symbol: "QQQ", name: "Nasdaq 100", price: 495, changePercent: 0.6 },
        { symbol: "DIA", name: "Dow 30", price: 420, changePercent: 0.2 },
      ],
      mood: "neutral",
      moodLabel: "Markets mixed — demo data",
    });
  }

  const client = getPolygonClient();
  const status = await withPolygonFallback(
    () => client.getMarketStatus(),
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
  );

  const etfs = ["SPY", "QQQ", "DIA"];
  const indices = [];

  for (const symbol of etfs) {
    const prev = await withPolygonFallback(
      () => client.getPreviousClose(symbol),
      0,
      `prev-${symbol}`
    );
    indices.push({
      symbol,
      name: symbol === "SPY" ? "S&P 500" : symbol === "QQQ" ? "Nasdaq 100" : "Dow 30",
      price: prev,
      changePercent: 0,
    });
    await new Promise((r) => setTimeout(r, 200));
  }

  const avgChange =
    indices.reduce((s, i) => s + i.changePercent, 0) / (indices.length || 1);
  const mood =
    avgChange > 0.3 ? "bullish" : avgChange < -0.3 ? "bearish" : "neutral";
  const moodLabel =
    mood === "bullish"
      ? "Risk-on — broad market positive"
      : mood === "bearish"
        ? "Risk-off — broad market negative"
        : "Mixed — selective trading";

  return NextResponse.json({
    session: status.session,
    sessionLabel: PolygonClient.getSessionLabel(status.session),
    indices,
    mood,
    moodLabel,
  });
}
