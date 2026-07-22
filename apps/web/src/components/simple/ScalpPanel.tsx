"use client";

import { useState } from "react";
import { SCALP_TARGETS, type ScalpTarget } from "@daytrading/strategy";

interface ScalpLevels {
  entry: number;
  stopLoss: number;
  takeProfit: number;
  targetPercent: number;
  stopPercent: number;
  riskReward: number;
  potentialProfit: number;
  potentialLoss: number;
}

interface Props {
  long: ScalpLevels;
  short: ScalpLevels;
  onTargetChange: (target: ScalpTarget) => void;
}

export function ScalpPanel({ long, short, onTargetChange }: Props) {
  const [target, setTarget] = useState<ScalpTarget>(long.targetPercent as ScalpTarget);
  const [side, setSide] = useState<"long" | "short">("long");
  const setup = side === "long" ? long : short;

  const pick = (t: ScalpTarget) => {
    setTarget(t);
    onTargetChange(t);
  };

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
      <h3 className="text-sm font-semibold text-emerald-400">Quick Scalp — Intraday 2–5% Target</h3>
      <p className="mt-1 text-xs text-zinc-500">Small in-day trades. Stop = half of target (2:1 reward:risk).</p>

      <div className="mt-3 flex gap-2">
        {SCALP_TARGETS.map((t) => (
          <button
            key={t}
            onClick={() => pick(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-mono font-semibold ${
              target === t ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {t}% TP
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        {(["long", "short"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize ${
              side === s
                ? s === "long"
                  ? "bg-emerald-600/30 text-emerald-300 ring-1 ring-emerald-500"
                  : "bg-red-600/30 text-red-300 ring-1 ring-red-500"
                : "bg-zinc-800 text-zinc-500"
            }`}
          >
            {s === "long" ? "Buy Scalp" : "Short Scalp"}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Cell label="Entry" value={`$${setup.entry.toFixed(2)}`} />
        <Cell label={`SL (−${setup.stopPercent}%)`} value={`$${setup.stopLoss.toFixed(2)}`} red />
        <Cell label={`TP (+${setup.targetPercent}%)`} value={`$${setup.takeProfit.toFixed(2)}`} green />
        <Cell label="R:R" value={`1:${setup.riskReward.toFixed(1)}`} />
      </div>

      <div className="mt-3 flex justify-between text-xs text-zinc-500">
        <span>Profit if hit: <span className="font-mono text-emerald-400">+${setup.potentialProfit.toFixed(2)}</span></span>
        <span>Risk if stopped: <span className="font-mono text-red-400">−${setup.potentialLoss.toFixed(2)}</span></span>
      </div>
    </div>
  );
}

function Cell({ label, value, red, green }: { label: string; value: string; red?: boolean; green?: boolean }) {
  return (
    <div className="rounded-lg bg-zinc-900/80 px-3 py-2">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className={`font-mono text-lg font-bold ${red ? "text-red-400" : green ? "text-emerald-400" : "text-zinc-100"}`}>
        {value}
      </div>
    </div>
  );
}
