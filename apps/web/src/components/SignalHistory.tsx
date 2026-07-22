"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface SignalRecord {
  id: number;
  ticker: string;
  signalType: string;
  price: number;
  entry: number | null;
  stopLoss: number | null;
  takeProfit1: number | null;
  confidence: number | null;
  reason: string | null;
  createdAt: string;
}

export function SignalHistory() {
  const [signals, setSignals] = useState<SignalRecord[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/signals/history?limit=20");
    const data = await res.json();
    setSignals(data.signals ?? []);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  const exportCsv = () => {
    const headers = ["ticker", "signalType", "price", "entry", "stopLoss", "takeProfit1", "confidence", "reason", "createdAt"];
    const rows = signals.map((s) =>
      headers.map((h) => JSON.stringify(s[h as keyof SignalRecord] ?? "")).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "signal-history.csv";
    a.click();
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Signal History
        </span>
        {signals.length > 0 && (
          <button
            onClick={exportCsv}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Export CSV
          </button>
        )}
      </div>
      <div className="max-h-64 overflow-y-auto">
        {signals.length === 0 ? (
          <div className="p-4 text-center text-sm text-zinc-500">
            No signals logged yet — connect WS server for live signals
          </div>
        ) : (
          signals.map((s) => (
            <Link
              key={s.id}
              href={`/ticker/${s.ticker}`}
              className="block border-b border-zinc-800/50 px-3 py-2 text-sm hover:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-medium text-zinc-200">{s.ticker}</span>
                <span className="text-xs text-zinc-500">
                  {new Date(s.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs">
                <span className="text-emerald-400">{s.signalType}</span>
                <span className="font-mono text-zinc-400">${s.price.toFixed(2)}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
