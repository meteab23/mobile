"use client";

import { useEffect, useState } from "react";

interface Snapshot {
  ticker: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  gapPercent: number;
  relativeVolume: number;
  dayHigh: number;
  dayLow: number;
  dayVolume: number;
  avgVolume?: number;
  vwap: number;
  rsi: number;
  preMarketHigh?: number | null;
  preMarketLow?: number | null;
  marketCap?: number;
  float?: number;
}

function formatNumber(n: number, decimals = 2): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatLarge(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${formatNumber(n)}`;
}

export function KeyStats({ ticker }: { ticker: string }) {
  const [stats, setStats] = useState<Snapshot | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/ticker/${ticker}/snapshot`);
      setStats(await res.json());
    };
    load();
    const interval = setInterval(load, 15_000);
    return () => clearInterval(interval);
  }, [ticker]);

  if (!stats) {
    return <div className="p-4 text-sm text-zinc-500">Loading stats...</div>;
  }

  const isPositive = stats.changePercent >= 0;

  return (
    <div>
      {stats.planNote && (
        <div className="mx-4 mt-3 rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          {stats.planNote}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4 lg:grid-cols-6">
      <Stat label="Price" value={`$${formatNumber(stats.price)}`} highlight />
      <Stat
        label="Change"
        value={`${isPositive ? "+" : ""}${formatNumber(stats.changePercent)}%`}
        color={isPositive ? "text-emerald-400" : "text-red-400"}
      />
      <Stat
        label="Gap"
        value={`${stats.gapPercent >= 0 ? "+" : ""}${formatNumber(stats.gapPercent)}%`}
        color={stats.gapPercent >= 0 ? "text-emerald-400" : "text-red-400"}
      />
      <Stat label="Rel Volume" value={`${formatNumber(stats.relativeVolume, 1)}x`} />
      <Stat label="Day High" value={`$${formatNumber(stats.dayHigh)}`} />
      <Stat label="Day Low" value={`$${formatNumber(stats.dayLow)}`} />
      <Stat label="Volume" value={formatLarge(stats.dayVolume).replace("$", "")} />
      <Stat label="VWAP" value={`$${formatNumber(stats.vwap)}`} />
      <Stat label="RSI" value={formatNumber(stats.rsi, 1)} />
      {stats.preMarketHigh != null && (
        <Stat label="Pre-Mkt High" value={`$${formatNumber(stats.preMarketHigh)}`} />
      )}
      {stats.preMarketLow != null && (
        <Stat label="Pre-Mkt Low" value={`$${formatNumber(stats.preMarketLow)}`} />
      )}
      {stats.marketCap != null && (
        <Stat label="Market Cap" value={formatLarge(stats.marketCap)} />
      )}
      {stats.float != null && (
        <Stat label="Float" value={`${(stats.float / 1e9).toFixed(2)}B`} />
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  color = "text-zinc-100",
  highlight = false,
}: {
  label: string;
  value: string;
  color?: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className={`font-mono text-sm ${highlight ? "text-lg font-bold" : ""} ${color}`}>
        {value}
      </div>
    </div>
  );
}
