"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function Wishlist({ refreshKey = 0 }: { refreshKey?: number }) {
  const [items, setItems] = useState<string[]>([]);

  const load = () =>
    fetch("/api/watchlist")
      .then((r) => r.json())
      .then((d) => setItems(d.watchlist ?? []));

  useEffect(() => {
    load();
  }, [refreshKey]);

  const remove = async (ticker: string) => {
    await fetch("/api/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker }),
    });
    load();
  };

  if (items.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-zinc-600">
        Your wishlist is empty. Search and add stocks above.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((ticker) => (
        <div
          key={ticker}
          className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-zinc-800/50"
        >
          <Link href={`/stock/${ticker}`} className="font-mono font-medium text-zinc-200 hover:text-emerald-400">
            {ticker}
          </Link>
          <button
            onClick={() => remove(ticker)}
            className="text-zinc-600 hover:text-red-400"
            aria-label={`Remove ${ticker}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
