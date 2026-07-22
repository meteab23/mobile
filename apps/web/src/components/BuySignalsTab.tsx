"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type BuyAction = "BUY" | "WAIT" | "AVOID";

interface BuyRecommendation {
  ticker: string;
  name: string;
  action: BuyAction;
  confidence: number;
  price: number;
  changePercent: number;
  entry?: number;
  stopLoss?: number;
  takeProfit1?: number;
  takeProfit2?: number;
  riskReward?: number;
  vwap: number;
  rsi: number;
  relativeVolume: number;
  gapPercent: number;
  reason: string;
  strategySignal: string;
  checklist: string[];
}

interface BuySignalsResponse {
  recommendations: BuyRecommendation[];
  updatedAt: string;
  sessionLabel?: string;
  strategy: string;
  summary?: { buy: number; wait: number; avoid: number; topPick: string | null };
  cached?: boolean;
  error?: string;
}

const ACTION_STYLES: Record<BuyAction, string> = {
  BUY: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  WAIT: "border-amber-500/50 bg-amber-500/10 text-amber-300",
  AVOID: "border-red-500/50 bg-red-500/10 text-red-300",
};

const ACTION_BADGE: Record<BuyAction, string> = {
  BUY: "bg-emerald-600 text-white",
  WAIT: "bg-amber-600 text-white",
  AVOID: "bg-red-600/80 text-white",
};

export function BuySignalsTab() {
  const [data, setData] = useState<BuySignalsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (refresh = false) => {
    setLoading(true);
    try {
      const url = refresh ? "/api/buy-signals?refresh=true" : "/api/buy-signals";
      const res = await fetch(url);
      setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-4 py-4 md:px-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Buy Signal Scanner</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Top 10 US stocks · {data?.strategy ?? "ORB + VWAP"} strategy
            {data?.sessionLabel && (
              <span className="ml-2 text-zinc-600">· {data.sessionLabel}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {data?.updatedAt && (
            <span className="text-xs text-zinc-600">
              Updated {new Date(data.updatedAt).toLocaleTimeString()}
              {data.cached && " (cached)"}
            </span>
          )}
          <button
            onClick={() => load(true)}
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Refresh Strategy"}
          </button>
        </div>
      </div>

      {data?.summary && (
        <div className="grid grid-cols-3 gap-3 border-b border-zinc-800 px-4 py-3 md:px-6">
          <SummaryCard label="Buy Now" count={data.summary.buy} color="text-emerald-400" />
          <SummaryCard label="Wait" count={data.summary.wait} color="text-amber-400" />
          <SummaryCard label="Avoid" count={data.summary.avoid} color="text-red-400" />
        </div>
      )}

      {data?.summary?.topPick && (
        <div className="mx-4 mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 md:mx-6">
          <span className="text-xs uppercase tracking-wider text-emerald-500">Top pick</span>
          <div className="mt-1 flex items-center gap-2">
            <Link
              href={`/ticker/${data.summary.topPick}`}
              className="font-mono text-lg font-bold text-emerald-400 hover:underline"
            >
              {data.summary.topPick}
            </Link>
            <span className="text-sm text-zinc-500">
              — highest-confidence BUY signal right now
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {loading && !data ? (
          <div className="py-12 text-center text-zinc-500">
            Running ORB + VWAP analysis on top 10 stocks...
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {data?.recommendations.map((rec) => (
              <RecommendationCard key={rec.ticker} rec={rec} />
            ))}
          </div>
        )}

        {data?.error && (
          <div className="mt-4 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
            {data.error}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-zinc-600">
          Signals based on Opening Range Breakout + VWAP rules. Not financial advice.
          Click Refresh to re-run live strategy analysis.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-center">
      <div className={`text-2xl font-bold ${color}`}>{count}</div>
      <div className="text-xs text-zinc-500">{label}</div>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: BuyRecommendation }) {
  return (
    <div className={`rounded-lg border p-4 ${ACTION_STYLES[rec.action]}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link
            href={`/ticker/${rec.ticker}`}
            className="font-mono text-lg font-bold hover:underline"
          >
            {rec.ticker}
          </Link>
          <div className="text-xs opacity-70">{rec.name}</div>
        </div>
        <span
          className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${ACTION_BADGE[rec.action]}`}
        >
          {rec.action}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <span className="font-mono text-xl font-semibold">
          ${rec.price > 0 ? rec.price.toFixed(2) : "—"}
        </span>
        <span
          className={`font-mono text-sm ${
            rec.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {rec.changePercent >= 0 ? "+" : ""}
          {rec.changePercent.toFixed(2)}%
        </span>
        <span className="text-xs opacity-60">Signal: {rec.strategySignal}</span>
      </div>

      <p className="mt-2 text-sm opacity-90">{rec.reason}</p>

      {(rec.entry != null || rec.stopLoss != null) && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          {rec.entry != null && (
            <Level label="Entry" value={rec.entry} />
          )}
          {rec.stopLoss != null && (
            <Level label="SL" value={rec.stopLoss} className="text-red-400" />
          )}
          {rec.takeProfit1 != null && (
            <Level label="TP1" value={rec.takeProfit1} className="text-emerald-400" />
          )}
          {rec.takeProfit2 != null && (
            <Level label="TP2" value={rec.takeProfit2} className="text-emerald-400" />
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {rec.checklist.map((item, i) => (
          <span
            key={i}
            className="rounded bg-black/20 px-2 py-0.5 text-xs opacity-80"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-black/30">
          <div
            className="h-full rounded-full bg-current opacity-60"
            style={{ width: `${rec.confidence}%` }}
          />
        </div>
        <span className="text-xs opacity-70">{rec.confidence}% conf</span>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 text-xs opacity-70">
        <span>VWAP ${rec.vwap.toFixed(2)}</span>
        <span>RSI {rec.rsi.toFixed(1)}</span>
        <span>Vol {rec.relativeVolume.toFixed(1)}x</span>
      </div>
    </div>
  );
}

function Level({
  label,
  value,
  className = "",
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div>
      <div className="opacity-60">{label}</div>
      <div className={`font-mono font-medium ${className}`}>${value.toFixed(2)}</div>
    </div>
  );
}
