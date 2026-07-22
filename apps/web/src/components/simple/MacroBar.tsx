"use client";

import { useEffect, useState } from "react";

interface MacroData {
  sessionLabel?: string;
  mood?: string;
  moodLabel?: string;
  indices?: Array<{ symbol: string; name: string; price: number; changePercent: number }>;
}

export function MacroBar() {
  const [macro, setMacro] = useState<MacroData | null>(null);

  useEffect(() => {
    fetch("/api/macro")
      .then((r) => r.json())
      .then(setMacro);
    const i = setInterval(() => fetch("/api/macro").then((r) => r.json()).then(setMacro), 60000);
    return () => clearInterval(i);
  }, []);

  const moodColor =
    macro?.mood === "bullish"
      ? "text-emerald-400"
      : macro?.mood === "bearish"
        ? "text-red-400"
        : "text-zinc-400";

  return (
    <div className="border-b border-zinc-800 bg-zinc-900/80 px-4 py-2">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-zinc-200">US Market</span>
          <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            {macro?.sessionLabel ?? "..."}
          </span>
          <span className={`text-xs ${moodColor}`}>{macro?.moodLabel ?? ""}</span>
        </div>
        <div className="flex gap-4 text-xs">
          {macro?.indices?.map((idx) => (
            <span key={idx.symbol} className="text-zinc-500">
              <span className="font-mono text-zinc-300">{idx.symbol}</span>{" "}
              ${idx.price.toFixed(0)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
