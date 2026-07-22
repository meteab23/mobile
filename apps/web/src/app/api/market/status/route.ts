import { NextResponse } from "next/server";
import { PolygonClient } from "@daytrading/polygon";
import { getPolygonClient, hasPolygonKey } from "@/lib/polygon";

export async function GET() {
  if (!hasPolygonKey()) {
    return NextResponse.json({
      session: "closed",
      label: "Demo Mode",
      serverTime: new Date().toISOString(),
      dataMode: "demo",
      countdown: null,
      message: "Set POLYGON_API_KEY for live market data",
    });
  }

  try {
    const client = getPolygonClient();
    const status = await client.getMarketStatus();
    const countdown = getCountdown(status.session);

    return NextResponse.json({
      ...status,
      sessionLabel: PolygonClient.getSessionLabel(status.session),
      dataMode: client.getDataMode(),
      countdown,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch market status" },
      { status: 500 }
    );
  }
}

function getCountdown(session: string): { label: string; target: string } | null {
  const now = new Date();
  const etNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const hours = etNow.getHours();
  const minutes = etNow.getMinutes();

  if (session === "pre_market") {
    return { label: "Market opens in", target: formatCountdown(hours, minutes, 9, 30) };
  }
  if (session === "regular") {
    return { label: "Market closes in", target: formatCountdown(hours, minutes, 16, 0) };
  }
  if (session === "after_hours") {
    return { label: "After-hours ends in", target: formatCountdown(hours, minutes, 20, 0) };
  }
  return { label: "Next pre-market", target: "4:00 AM ET" };
}

function formatCountdown(
  curH: number,
  curM: number,
  targetH: number,
  targetM: number
): string {
  const cur = curH * 60 + curM;
  const target = targetH * 60 + targetM;
  let diff = target - cur;
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${h}h ${m}m`;
}
