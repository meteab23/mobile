import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";
import { signalHistory } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

initDb();

export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 50);
  const signals = db
    .select()
    .from(signalHistory)
    .orderBy(desc(signalHistory.createdAt))
    .limit(limit)
    .all();

  return NextResponse.json({ signals });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    ticker: string;
    signalType: string;
    price: number;
    entry?: number;
    stopLoss?: number;
    takeProfit1?: number;
    takeProfit2?: number;
    confidence?: number;
    reason?: string;
  };

  db.insert(signalHistory).values({
    ticker: body.ticker.toUpperCase(),
    signalType: body.signalType,
    price: body.price,
    entry: body.entry,
    stopLoss: body.stopLoss,
    takeProfit1: body.takeProfit1,
    takeProfit2: body.takeProfit2,
    confidence: body.confidence,
    reason: body.reason,
  }).run();

  return NextResponse.json({ ok: true });
}
