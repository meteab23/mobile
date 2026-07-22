"use client";

interface Props {
  trend: { trend: string; label: string };
  rsi: number;
  support: number | null;
  resistance: number | null;
  position: string;
  candlePattern?: { pattern: string; signal: string; description: string };
}

export function TechnicalsPanel({ trend, rsi, support, resistance, position, candlePattern }: Props) {
  const trendColor =
    trend.trend === "up" ? "text-emerald-400" : trend.trend === "down" ? "text-red-400" : "text-zinc-400";

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Trend</h3>
        <p className={`mt-2 text-sm font-medium ${trendColor}`}>{trend.label}</p>
        <p className="mt-2 text-xs text-zinc-500">RSI: <span className="font-mono text-zinc-300">{rsi.toFixed(1)}</span></p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Support & Resistance</h3>
        <div className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-emerald-400/80">Support</span>
            <span className="font-mono">${support?.toFixed(2) ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-400/80">Resistance</span>
            <span className="font-mono">${resistance?.toFixed(2) ?? "—"}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>Position</span>
            <span className="capitalize">{position.replace(/_/g, " ")}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:col-span-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Daily Candle Pattern</h3>
        {candlePattern && candlePattern.pattern !== "none" ? (
          <p className="mt-2 text-sm capitalize text-zinc-300">
            <span
              className={
                candlePattern.signal === "bullish"
                  ? "text-emerald-400"
                  : candlePattern.signal === "bearish"
                    ? "text-red-400"
                    : "text-zinc-400"
              }
            >
              {candlePattern.pattern.replace(/_/g, " ")}
            </span>
            {" — "}
            {candlePattern.description}
          </p>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">No strong daily candle pattern on the latest bar.</p>
        )}
      </div>
    </div>
  );
}
