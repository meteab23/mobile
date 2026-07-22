"use client";

import { useState } from "react";

interface Props {
  onAdd: (ticker: string) => void;
}

export function StockSearch({ onAdd }: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Array<{ ticker: string; name: string }>>([]);

  const search = async (query: string) => {
    setQ(query);
    if (query.length < 1) {
      setResults([]);
      return;
    }
    const res = await fetch(`/api/tickers/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.results ?? []);
  };

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => search(e.target.value.toUpperCase())}
        placeholder="Search US stocks to add..."
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
      />
      {results.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
          {results.map((r) => (
            <button
              key={r.ticker}
              onClick={() => {
                onAdd(r.ticker);
                setQ("");
                setResults([]);
              }}
              className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-zinc-800"
            >
              <span className="font-mono font-medium text-emerald-400">{r.ticker}</span>
              <span className="truncate pl-2 text-zinc-500">{r.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
