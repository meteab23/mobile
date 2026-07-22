"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { DailyChart } from "@/components/simple/DailyChart";
import { ScalpPanel } from "@/components/simple/ScalpPanel";
import { TechnicalsPanel } from "@/components/simple/TechnicalsPanel";
import { TradeSignalPanel } from "@/components/simple/TradeSignalPanel";
import { SimpleAIAnalysis } from "@/components/simple/SimpleAIAnalysis";
import { NewsList } from "@/components/simple/NewsList";
import type { ScalpTarget, ScalpSetup } from "@daytrading/strategy";

interface TradeSignal {
  signal: "ENTER_LONG" | "ENTER_SHORT" | "WAIT";
  action: string;
  side: "long" | "short" | "flat";
  entry: number;
  stopLoss: number;
  takeProfit: number;
  takeProfit2: number;
  targetPercent: number;
  confidence: number;
  compositeScore: number;
  summary: string;
  entryGuide: string;
  exitGuide: string;
  checklist: string[];
}

export default function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol: rawSymbol } = use(params);
  const symbol = rawSymbol?.toUpperCase() ?? "AAPL";
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [scalpTarget, setScalpTarget] = useState<ScalpTarget>(3);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/stock/${symbol}?scalp=${scalpTarget}`);
    setData(await res.json());
    setLoading(false);
  }, [symbol, scalpTarget]);

  useEffect(() => {
    load();
  }, [load]);

  const addWishlist = async () => {
    await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker: symbol }),
    });
  };

  if (loading || !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-zinc-500">
        Loading {symbol}...
      </div>
    );
  }

  const d = data as {
    ticker: string;
    name: string;
    price: number;
    changePercent: number;
    trend: { trend: string; label: string };
    rsi: number;
    supportResistance: { support: number; resistance: number; position: string };
    candlePattern: { pattern: string; signal: string; description: string };
    dailyBars: Array<{ t: number; o: number; h: number; l: number; c: number }>;
    news: Array<{ title: string; url: string; time: string; sentiment?: string }>;
    scalp: { long: ScalpSetup; short: ScalpSetup };
    tradeSignal: TradeSignal;
  };

  const isUp = d.changePercent >= 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">
        ← Back to stocks
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl font-bold text-zinc-100">{d.ticker}</h1>
          <p className="text-zinc-500">{d.name}</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-3xl font-bold">${d.price.toFixed(2)}</div>
          <div className={`font-mono text-sm ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            {isUp ? "+" : ""}
            {d.changePercent.toFixed(2)}%
          </div>
        </div>
        <button
          onClick={addWishlist}
          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:border-emerald-500 hover:text-emerald-400"
        >
          + Wishlist
        </button>
      </header>

      {d.tradeSignal && (
        <section className="mt-6">
          <TradeSignalPanel signal={d.tradeSignal} />
        </section>
      )}

      <section className="mt-6">
        <SimpleAIAnalysis ticker={symbol} />
      </section>

      <section className="mt-6">
        <ScalpPanel
          long={d.scalp.long}
          short={d.scalp.short}
          onTargetChange={setScalpTarget}
        />
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Daily Chart
        </h2>
        <DailyChart bars={d.dailyBars} />
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Technical Analysis
        </h2>
        <TechnicalsPanel
          trend={d.trend}
          rsi={d.rsi}
          support={d.supportResistance.support}
          resistance={d.supportResistance.resistance}
          position={d.supportResistance.position}
          candlePattern={d.candlePattern}
        />
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          News
        </h2>
        <NewsList news={d.news} />
      </section>
    </div>
  );
}
