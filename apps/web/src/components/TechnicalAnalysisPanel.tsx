"use client";

import { useCallback, useEffect, useState } from "react";

interface StrategyScore {
  name: string;
  score: number;
  bias: string;
  detail: string;
}

interface DayStrategyData {
  ticker: string;
  name?: string;
  action: string;
  direction: string;
  confidence: number;
  compositeScore: number;
  price: number;
  summary: string;
  strategiesUsed?: string[];
  supportResistance: {
    nearestSupport: number | null;
    nearestResistance: number | null;
    pricePosition: string;
    pivotPoint?: number;
    s1?: number;
    r1?: number;
  };
  candlePatterns: Array<{
    pattern: string;
    signal: string;
    confidence: number;
    description: string;
  }>;
  strategyScores: StrategyScore[];
  evenRisk: {
    entry: number;
    stopLoss: number;
    takeProfit1: number;
    takeProfit2: number;
    riskReward1: number;
    riskReward2: number;
  };
  checklist: string[];
}

export function TechnicalAnalysisPanel({ ticker }: { ticker: string }) {
  const [data, setData] = useState<DayStrategyData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/strategy/${ticker}`);
      setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="border-t border-zinc-800 p-4 text-sm text-zinc-500">
        Running multi-strategy technical analysis...
      </div>
    );
  }

  if (!data || !data.evenRisk) {
    return null;
  }

  const actionColors: Record<string, string> = {
    BUY: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    WAIT: "text-amber-400 border-amber-500/40 bg-amber-500/10",
    AVOID: "text-red-400 border-red-500/40 bg-red-500/10",
  };

  const dirIcon = data.direction === "up" ? "↑" : data.direction === "down" ? "↓" : "→";

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-300">
            Master Day Strategy — Technical Confluence
          </h3>
          <p className="text-xs text-zinc-600">
            ORB+VWAP · S/R · Candlesticks · EMA/RSI · Volume · Fundamentals
          </p>
        </div>
        <button
          onClick={load}
          className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
        >
          Refresh
        </button>
      </div>

      <div className={`mb-4 rounded-lg border p-4 ${actionColors[data.action] ?? actionColors.WAIT}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">{data.action}</span>
          <span className="text-lg">{dirIcon}</span>
          <span className="font-mono text-sm opacity-80">
            Score {data.compositeScore}/100 · {data.confidence}% confidence
          </span>
        </div>
        <p className="mt-2 text-sm opacity-90">{data.summary}</p>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="mb-2 text-xs uppercase text-zinc-500">Support & Resistance</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-emerald-400/80">Support</span>
              <span className="font-mono">${data.supportResistance.nearestSupport?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-400/80">Resistance</span>
              <span className="font-mono">${data.supportResistance.nearestResistance?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Position</span>
              <span className="capitalize">{data.supportResistance.pricePosition.replace("_", " ")}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="mb-2 text-xs uppercase text-zinc-500">Even Risk Trade Plan (1:1 / 1:2)</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-zinc-500">Entry</span>
              <div className="font-mono">${data.evenRisk.entry.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-zinc-500">Stop Loss</span>
              <div className="font-mono text-red-400">${data.evenRisk.stopLoss.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-zinc-500">TP1 (1:1)</span>
              <div className="font-mono text-emerald-400">${data.evenRisk.takeProfit1.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-zinc-500">TP2 (1:2)</span>
              <div className="font-mono text-emerald-400">${data.evenRisk.takeProfit2.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {data.candlePatterns[0]?.pattern !== "none" && (
        <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="mb-1 text-xs uppercase text-zinc-500">Candlestick Reading</div>
          {data.candlePatterns.slice(0, 2).map((p, i) => (
            <div key={i} className="mt-1 text-sm">
              <span
                className={`font-medium capitalize ${
                  p.signal === "bullish"
                    ? "text-emerald-400"
                    : p.signal === "bearish"
                      ? "text-red-400"
                      : "text-zinc-400"
                }`}
              >
                {p.pattern.replace(/_/g, " ")}
              </span>
              <span className="text-zinc-500"> — {p.description}</span>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
        <div className="mb-2 text-xs uppercase text-zinc-500">Strategy Breakdown</div>
        <div className="space-y-2">
          {data.strategyScores.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">{s.name}</span>
                <span
                  className={
                    s.bias === "bullish"
                      ? "text-emerald-400"
                      : s.bias === "bearish"
                        ? "text-red-400"
                        : "text-zinc-500"
                  }
                >
                  {s.score}/100
                </span>
              </div>
              <div className="mt-0.5 h-1 rounded-full bg-zinc-800">
                <div
                  className={`h-full rounded-full ${
                    s.bias === "bullish"
                      ? "bg-emerald-500"
                      : s.bias === "bearish"
                        ? "bg-red-500"
                        : "bg-zinc-500"
                  }`}
                  style={{ width: `${s.score}%` }}
                />
              </div>
              <div className="mt-0.5 text-xs text-zinc-600">{s.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
