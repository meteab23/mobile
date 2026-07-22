"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { StockSearch } from "@/components/simple/StockSearch";
import { Wishlist } from "@/components/simple/Wishlist";

interface Stock {
  ticker: string;
  name: string;
}

export default function HomePage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistKey, setWishlistKey] = useState(0);

  const load = useCallback(async () => {
    const [pop, wl] = await Promise.all([
      fetch("/api/stocks/popular").then((r) => r.json()),
      fetch("/api/watchlist").then((r) => r.json()),
    ]);
    setStocks(pop.stocks ?? []);
    setWishlist(wl.watchlist ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addStock = async (ticker: string) => {
    await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker }),
    });
    setWishlistKey((k) => k + 1);
    load();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">US Stocks</h1>
        <p className="text-sm text-zinc-500">Pick stocks, analyze, scalp 2–5% moves</p>
      </header>

      <div className="mb-6">
        <StockSearch onAdd={addStock} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Popular US Stocks
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {stocks.map((s) => (
              <Link
                key={s.ticker}
                href={`/stock/${s.ticker}`}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 transition-colors hover:border-emerald-500/40 hover:bg-zinc-900"
              >
                <div className="font-mono font-bold text-zinc-100 group-hover:text-emerald-400">
                  {s.ticker}
                </div>
                <div className="truncate text-xs text-zinc-600">{s.name}</div>
                {wishlist.includes(s.ticker) && (
                  <div className="mt-1 text-xs text-emerald-500">★ Wishlist</div>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            My Wishlist
          </h2>
          <Wishlist refreshKey={wishlistKey} />
        </div>
      </div>
    </div>
  );
}
