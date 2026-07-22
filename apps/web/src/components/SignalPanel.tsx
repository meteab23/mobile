"use client";

import { useEffect, useState, useCallback } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

interface StrategySignal {
  type: string;
  ticker: string;
  timestamp: number;
  price: number;
  entry?: number;
  stopLoss?: number;
  takeProfit1?: number;
  takeProfit2?: number;
  riskReward?: number;
  confidence: number;
  reason: string;
  session: string;
  reducedReliability?: boolean;
}

const SIGNAL_COLORS: Record<string, string> = {
  ENTER_LONG: "border-emerald-500 bg-emerald-500/10 text-emerald-300",
  ENTER_SHORT: "border-red-500 bg-red-500/10 text-red-300",
  WATCH: "border-amber-500 bg-amber-500/10 text-amber-300",
  HOLD: "border-blue-500 bg-blue-500/10 text-blue-300",
  EXIT: "border-zinc-500 bg-zinc-500/10 text-zinc-300",
  TP1_HIT: "border-emerald-400 bg-emerald-400/10 text-emerald-200",
  TP2_HIT: "border-emerald-300 bg-emerald-300/10 text-emerald-100",
  SL_HIT: "border-red-400 bg-red-400/10 text-red-200",
};

export function SignalPanel({ ticker }: { ticker: string }) {
  const [signal, setSignal] = useState<StrategySignal | null>(null);
  const [history, setHistory] = useState<StrategySignal[]>([]);

  const handleMessage = useCallback(
    (msg: { type: string; data: unknown }) => {
      if (msg.type !== "signal") return;
      const s = msg.data as StrategySignal;
      if (s.ticker !== ticker.toUpperCase()) return;
      setSignal(s);
      setHistory((prev) => [s, ...prev].slice(0, 20));

      if (["ENTER_LONG", "ENTER_SHORT", "TP1_HIT", "TP2_HIT", "SL_HIT", "EXIT"].includes(s.type)) {
        fetch("/api/signals/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticker: s.ticker,
            signalType: s.type,
            price: s.price,
            entry: s.entry,
            stopLoss: s.stopLoss,
            takeProfit1: s.takeProfit1,
            takeProfit2: s.takeProfit2,
            confidence: s.confidence,
            reason: s.reason,
          }),
        }).catch(() => {});

        if (s.type.startsWith("ENTER_") && typeof Notification !== "undefined") {
          if (Notification.permission === "granted") {
            new Notification(`${s.type} — ${s.ticker}`, { body: s.reason });
          }
        }
      }
    },
    [ticker]
  );

  const { connected, subscribe } = useWebSocket(handleMessage);

  useEffect(() => {
    subscribe([ticker]);
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [ticker, subscribe]);

  const color = signal ? SIGNAL_COLORS[signal.type] ?? SIGNAL_COLORS.WATCH : "";

  return (
    <div className="flex h-full flex-col border-l border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          ORB + VWAP Signals
        </span>
        <span
          className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-red-500"}`}
          title={connected ? "Live" : "Disconnected"}
        />
      </div>

      {signal ? (
        <div className={`m-3 rounded-lg border p-3 ${color}`}>
          <div className="text-lg font-bold">{signal.type.replace(/_/g, " ")}</div>
          <div className="mt-1 font-mono text-2xl">${signal.price.toFixed(2)}</div>
          <div className="mt-2 text-xs opacity-80">{signal.reason}</div>
          {signal.reducedReliability && (
            <div className="mt-2 rounded bg-amber-500/10 px-2 py-1 text-xs text-amber-400">
              Extended hours — reduced reliability
            </div>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {signal.entry != null && (
              <div>
                <span className="text-zinc-500">Entry</span>
                <div className="font-mono">${signal.entry.toFixed(2)}</div>
              </div>
            )}
            {signal.stopLoss != null && (
              <div>
                <span className="text-zinc-500">Stop Loss</span>
                <div className="font-mono text-red-400">${signal.stopLoss.toFixed(2)}</div>
              </div>
            )}
            {signal.takeProfit1 != null && (
              <div>
                <span className="text-zinc-500">TP1 (1.5R)</span>
                <div className="font-mono text-emerald-400">${signal.takeProfit1.toFixed(2)}</div>
              </div>
            )}
            {signal.takeProfit2 != null && (
              <div>
                <span className="text-zinc-500">TP2 (2.5R)</span>
                <div className="font-mono text-emerald-400">${signal.takeProfit2.toFixed(2)}</div>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${signal.confidence}%` }}
              />
            </div>
            <span className="text-xs text-zinc-500">{signal.confidence}% conf</span>
          </div>
        </div>
      ) : (
        <div className="m-3 rounded-lg border border-zinc-800 p-4 text-sm text-zinc-500">
          {connected
            ? "Monitoring for ORB + VWAP setup..."
            : "Connect WS server for live signals (npm run dev in ws-server)"}
        </div>
      )}

      {history.length > 1 && (
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="mb-1 text-xs text-zinc-600">Recent</div>
          {history.slice(1, 8).map((s, i) => (
            <div key={i} className="border-b border-zinc-800/50 py-1.5 text-xs text-zinc-500">
              <span className="font-mono text-zinc-400">{s.type}</span> @ ${s.price.toFixed(2)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
