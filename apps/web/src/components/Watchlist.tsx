"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface WatchlistProps {
  activeTicker?: string;
  onSelect?: (ticker: string) => void;
}

export function Watchlist({ activeTicker, onSelect }: WatchlistProps) {
  const [tickers, setTickers] = useState<string[]>([]);
  const [newTicker, setNewTicker] = useState("");

  const load = async () => {
    const res = await fetch("/api/watchlist");
    const data = await res.json();
    setTickers(data.watchlist ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const addTicker = async () => {
    if (!newTicker.trim()) return;
    await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker: newTicker.trim().toUpperCase() }),
    });
    setNewTicker("");
    load();
  };

  const removeTicker = async (ticker: string) => {
    await fetch("/api/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker }),
    });
    load();
  };

  return (
    <div className="flex h-full flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Watchlist
      </div>
      <div className="flex gap-1 border-b border-zinc-800 p-2">
        <input
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && addTicker()}
          placeholder="Add ticker"
          className="flex-1 rounded bg-zinc-900 px-2 py-1 text-sm text-zinc-100 outline-none ring-zinc-700 focus:ring-1"
        />
        <button
          onClick={addTicker}
          className="rounded bg-emerald-600 px-2 py-1 text-sm font-medium text-white hover:bg-emerald-500"
        >
          +
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tickers.map((ticker) => (
          <div
            key={ticker}
            className={`group flex items-center justify-between px-3 py-2 text-sm hover:bg-zinc-900 ${
              activeTicker === ticker ? "bg-zinc-900 border-l-2 border-emerald-500" : ""
            }`}
          >
            <Link
              href={`/ticker/${ticker}`}
              onClick={() => onSelect?.(ticker)}
              className="flex-1 font-mono font-medium text-zinc-200 hover:text-emerald-400"
            >
              {ticker}
            </Link>
            <button
              onClick={() => removeTicker(ticker)}
              className="hidden text-zinc-600 hover:text-red-400 group-hover:block"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
