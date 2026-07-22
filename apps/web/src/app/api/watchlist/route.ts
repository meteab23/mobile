import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";
import { watchlist } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

initDb();

const DEFAULT_TICKERS = ["AAPL", "TSLA", "NVDA", "MSFT", "AMD"];

export async function GET() {
  let items = db.select().from(watchlist).orderBy(asc(watchlist.addedAt)).all();
  if (items.length === 0) {
    for (const ticker of DEFAULT_TICKERS) {
      db.insert(watchlist).values({ ticker }).onConflictDoNothing().run();
    }
    items = db.select().from(watchlist).orderBy(asc(watchlist.addedAt)).all();
  }
  return NextResponse.json({ watchlist: items.map((w) => w.ticker) });
}

export async function POST(req: NextRequest) {
  const { ticker } = (await req.json()) as { ticker: string };
  if (!ticker) {
    return NextResponse.json({ error: "ticker required" }, { status: 400 });
  }
  const symbol = ticker.toUpperCase();
  db.insert(watchlist).values({ ticker: symbol }).onConflictDoNothing().run();
  return NextResponse.json({ ticker: symbol });
}

export async function DELETE(req: NextRequest) {
  const { ticker } = (await req.json()) as { ticker: string };
  if (!ticker) {
    return NextResponse.json({ error: "ticker required" }, { status: 400 });
  }
  db.delete(watchlist).where(eq(watchlist.ticker, ticker.toUpperCase())).run();
  return NextResponse.json({ ok: true });
}
