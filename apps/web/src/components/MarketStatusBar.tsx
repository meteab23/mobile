"use client";

import { useEffect, useState } from "react";

interface MarketStatus {
  session?: string;
  sessionLabel?: string;
  label?: string;
  countdown?: { label: string; target: string } | null;
  dataMode?: string;
  message?: string;
}

export function MarketStatusBar() {
  const [status, setStatus] = useState<MarketStatus | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch("/api/market/status");
      setStatus(await res.json());
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30_000);
    return () => clearInterval(interval);
  }, []);

  const sessionColors: Record<string, string> = {
    pre_market: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    regular: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    after_hours: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    closed: "bg-zinc-500/20 text-zinc-400 border-zinc-500/40",
  };

  const session = status?.session ?? "closed";
  const color = sessionColors[session] ?? sessionColors.closed;

  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-sm">
      <div className="flex items-center gap-3">
        <span className={`rounded border px-2 py-0.5 text-xs font-semibold uppercase ${color}`}>
          {status?.sessionLabel ?? status?.label ?? "Loading..."}
        </span>
        {status?.countdown && (
          <span className="text-zinc-400">
            {status.countdown.label}{" "}
            <span className="font-mono text-zinc-200">{status.countdown.target}</span>
          </span>
        )}
        {status?.message && (
          <span className="text-amber-400/80 text-xs">{status.message}</span>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <span>Data: {status?.dataMode ?? "..."}</span>
        {status?.dataMode === "delayed" && (
          <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-400">15m delay</span>
        )}
      </div>
    </div>
  );
}
