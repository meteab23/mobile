"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Mover {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export function Scanner() {
  const [gainers, setGainers] = useState<Mover[]>([]);
  const [losers, setLosers] = useState<Mover[]>([]);
  const [tab, setTab] = useState<"gainers" | "losers">("gainers");

  useEffect(() => {
    Promise.all([
      fetch("/api/scanner?type=gainers").then((r) => r.json()),
      fetch("/api/scanner?type=losers").then((r) => r.json()),
    ]).then(([g, l]) => {
      setGainers(g.results ?? []);
      setLosers(l.results ?? []);
    });
  }, []);

  const items = tab === "gainers" ? gainers : losers;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950">
      <div className="flex border-b border-zinc-800">
        {(["gainers", "losers"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-3 py-2 text-xs font-semibold uppercase ${
              tab === t
                ? t === "gainers"
                  ? "border-b-2 border-emerald-500 text-emerald-400"
                  : "border-b-2 border-red-500 text-red-400"
                : "text-zinc-500"
            }`}
          >
            Top {t}
          </button>
        ))}
      </div>
      <div className="max-h-64 overflow-y-auto">
        {items.map((m) => (
          <Link
            key={m.ticker}
            href={`/ticker/${m.ticker}`}
            className="flex items-center justify-between border-b border-zinc-800/50 px-3 py-2 text-sm hover:bg-zinc-900"
          >
            <span className="font-mono font-medium text-zinc-200">{m.ticker}</span>
            <span className="font-mono text-zinc-400">${m.price.toFixed(2)}</span>
            <span
              className={`font-mono ${
                m.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {m.changePercent >= 0 ? "+" : ""}
              {m.changePercent.toFixed(2)}%
            </span>
          </Link>
        ))}
        {items.length === 0 && (
          <div className="p-4 text-center text-sm text-zinc-500">No data</div>
        )}
      </div>
    </div>
  );
}
