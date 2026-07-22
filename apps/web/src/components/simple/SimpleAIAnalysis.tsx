"use client";

import { useCallback, useEffect, useState } from "react";

interface MoveAnalysis {
  moveSummary: {
    direction: string;
    magnitude: string;
    summary: string;
    forecast?: string;
  };
  technicalRead: {
    vwapPosition: string;
    orbStatus: string;
    rsi: number;
    strategyAlignment: string;
    supportResistance?: string;
    candlePattern?: string;
    directionForecast?: string;
    compositeScore?: number;
  };
  tradePlan?: {
    action: string;
    entry: number;
    stopLoss: number;
    takeProfit1: number;
    takeProfit2: number;
    riskReward: string;
  };
  primaryDrivers: Array<{ driver: string; detail: string; source?: string }>;
  risksAndCaveats: string[];
}

export function SimpleAIAnalysis({ ticker }: { ticker: string }) {
  const [analysis, setAnalysis] = useState<MoveAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analysis/${ticker}`);
      if (res.ok) {
        setAnalysis(await res.json());
        setUpdatedAt(new Date());
      }
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 90_000);
    return () => clearInterval(interval);
  }, [load]);

  const directionColor =
    analysis?.moveSummary.direction === "bullish"
      ? "text-emerald-400"
      : analysis?.moveSummary.direction === "bearish"
        ? "text-red-400"
        : "text-zinc-400";

  return (
    <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-violet-300">AI Real-Time Analysis</h3>
          <p className="text-xs text-zinc-500">
            {updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : "Analyzing..."} · refreshes every 90s
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Refresh AI"}
        </button>
      </div>

      {!analysis ? (
        <p className="mt-4 text-sm text-zinc-500">Loading AI analysis for {ticker}...</p>
      ) : (
        <>
          <div className="mt-4 rounded-lg bg-zinc-900/60 p-3">
            <div className={`text-lg font-bold capitalize ${directionColor}`}>
              {analysis.moveSummary.direction} · {analysis.moveSummary.magnitude}
            </div>
            <p className="mt-2 text-sm text-zinc-300">{analysis.moveSummary.summary}</p>
            {analysis.moveSummary.forecast && (
              <p className="mt-1 text-sm text-violet-300/80">{analysis.moveSummary.forecast}</p>
            )}
          </div>

          {analysis.tradePlan && (
            <div className="mt-4 rounded-lg border border-violet-500/20 bg-zinc-900/40 p-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                AI Trade Plan — Entry & Exit
              </div>
              <div className="mt-1 text-sm font-semibold text-zinc-200">{analysis.tradePlan.action}</div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <AiLevel label="Enter at" value={analysis.tradePlan.entry} />
                <AiLevel label="Stop / Exit" value={analysis.tradePlan.stopLoss} red />
                <AiLevel label="Take Profit 1" value={analysis.tradePlan.takeProfit1} green />
                <AiLevel label="Take Profit 2" value={analysis.tradePlan.takeProfit2} green />
              </div>
              <p className="mt-2 text-xs text-zinc-500">Risk/Reward: {analysis.tradePlan.riskReward}</p>
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-zinc-900/40 p-3">
              <div className="text-xs font-semibold uppercase text-zinc-500">AI Technical Read</div>
              <ul className="mt-2 space-y-1 text-xs text-zinc-400">
                <li>{analysis.technicalRead.vwapPosition}</li>
                <li>{analysis.technicalRead.orbStatus}</li>
                {analysis.technicalRead.supportResistance && (
                  <li>{analysis.technicalRead.supportResistance}</li>
                )}
                {analysis.technicalRead.candlePattern && (
                  <li className="capitalize">
                    Pattern: {analysis.technicalRead.candlePattern.replace(/_/g, " ")}
                  </li>
                )}
                <li>RSI {analysis.technicalRead.rsi.toFixed(1)}</li>
                {analysis.technicalRead.compositeScore != null && (
                  <li>Score {analysis.technicalRead.compositeScore}/100</li>
                )}
              </ul>
            </div>

            {analysis.primaryDrivers.length > 0 && (
              <div className="rounded-lg bg-zinc-900/40 p-3">
                <div className="text-xs font-semibold uppercase text-zinc-500">Key Drivers</div>
                <ul className="mt-2 space-y-1 text-xs text-zinc-400">
                  {analysis.primaryDrivers.slice(0, 3).map((d, i) => (
                    <li key={i}>
                      <span className="text-zinc-300">{d.driver}:</span> {d.detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p className="mt-3 text-xs text-zinc-600">
            {analysis.risksAndCaveats[0] ?? "Educational analysis only — not financial advice."}
          </p>
        </>
      )}
    </div>
  );
}

function AiLevel({
  label,
  value,
  red,
  green,
}: {
  label: string;
  value: number;
  red?: boolean;
  green?: boolean;
}) {
  return (
    <div className="rounded-lg bg-zinc-900/80 px-2 py-2">
      <div className="text-xs text-zinc-500">{label}</div>
      <div
        className={`font-mono text-base font-bold ${
          red ? "text-red-400" : green ? "text-emerald-400" : "text-zinc-100"
        }`}
      >
        ${value.toFixed(2)}
      </div>
    </div>
  );
}
