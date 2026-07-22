"use client";

import { useEffect, useState, useCallback } from "react";

interface MoveAnalysis {
  moveSummary: {
    direction: string;
    magnitude: string;
    summary: string;
    forecast?: string;
  };
  primaryDrivers: Array<{ driver: string; detail: string; source?: string }>;
  fundamentalsSnapshot: {
    revenueTrend?: string;
    margins?: string;
    valuation?: string;
    notes?: string;
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
  risksAndCaveats: string[];
  sources: Array<{ title: string; url: string }>;
}

export function AIAnalysis({ ticker }: { ticker: string }) {
  const [analysis, setAnalysis] = useState<MoveAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analysis/${ticker}`);
      setAnalysis(await res.json());
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    load();
  }, [load]);

  const directionColors: Record<string, string> = {
    bullish: "text-emerald-400",
    bearish: "text-red-400",
    neutral: "text-zinc-400",
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-300">
          AI Analysis — Why {ticker} moved
        </h3>
        <button
          onClick={load}
          disabled={loading}
          className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Refresh"}
        </button>
      </div>

      {!analysis ? (
        <div className="text-sm text-zinc-500">Loading analysis...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
            <div className="text-xs uppercase text-zinc-500">Move Summary</div>
            <div
              className={`mt-1 text-lg font-semibold capitalize ${
                directionColors[analysis.moveSummary.direction] ?? "text-zinc-300"
              }`}
            >
              {analysis.moveSummary.direction} ({analysis.moveSummary.magnitude})
            </div>
            <p className="mt-2 text-sm text-zinc-400">{analysis.moveSummary.summary}</p>
            {analysis.moveSummary.forecast && (
              <p className="mt-1 text-sm text-emerald-400/80">{analysis.moveSummary.forecast}</p>
            )}
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
            <div className="text-xs uppercase text-zinc-500">Technical Read</div>
            <ul className="mt-2 space-y-1 text-sm text-zinc-400">
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
              <li>RSI: {analysis.technicalRead.rsi.toFixed(1)}</li>
              {analysis.technicalRead.compositeScore != null && (
                <li>Composite score: {analysis.technicalRead.compositeScore}/100</li>
              )}
              <li>{analysis.technicalRead.strategyAlignment}</li>
              {analysis.technicalRead.directionForecast && (
                <li>Forecast: {analysis.technicalRead.directionForecast}</li>
              )}
            </ul>
          </div>

          {analysis.tradePlan && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 md:col-span-2">
              <div className="text-xs uppercase text-emerald-500">AI Trade Plan (Even Risk)</div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
                <div>
                  <span className="text-zinc-500">Action</span>
                  <div className="font-semibold text-emerald-400">{analysis.tradePlan.action}</div>
                </div>
                <div>
                  <span className="text-zinc-500">Entry</span>
                  <div className="font-mono">${analysis.tradePlan.entry.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-zinc-500">SL</span>
                  <div className="font-mono text-red-400">${analysis.tradePlan.stopLoss.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-zinc-500">TP1</span>
                  <div className="font-mono text-emerald-400">${analysis.tradePlan.takeProfit1.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-zinc-500">R:R</span>
                  <div className="font-mono">{analysis.tradePlan.riskReward}</div>
                </div>
              </div>
            </div>
          )}

          {analysis.primaryDrivers.length > 0 && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 md:col-span-2">
              <div className="text-xs uppercase text-zinc-500">Primary Drivers</div>
              <ul className="mt-2 space-y-2">
                {analysis.primaryDrivers.map((d, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium text-zinc-300">{d.driver}:</span>{" "}
                    <span className="text-zinc-400">{d.detail}</span>
                    {d.source && (
                      <a
                        href={d.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-xs text-emerald-500 hover:underline"
                      >
                        source
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
            <div className="text-xs uppercase text-zinc-500">Fundamentals</div>
            <ul className="mt-2 space-y-1 text-sm text-zinc-400">
              {analysis.fundamentalsSnapshot.revenueTrend && (
                <li>{analysis.fundamentalsSnapshot.revenueTrend}</li>
              )}
              {analysis.fundamentalsSnapshot.margins && (
                <li>{analysis.fundamentalsSnapshot.margins}</li>
              )}
              {analysis.fundamentalsSnapshot.valuation && (
                <li>{analysis.fundamentalsSnapshot.valuation}</li>
              )}
              {analysis.fundamentalsSnapshot.notes && (
                <li className="text-xs opacity-70">{analysis.fundamentalsSnapshot.notes}</li>
              )}
            </ul>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
            <div className="text-xs uppercase text-zinc-500">Risks & Caveats</div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-400">
              {analysis.risksAndCaveats.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
