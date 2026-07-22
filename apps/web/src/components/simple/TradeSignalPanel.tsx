"use client";

interface TradeSignal {
  signal: "ENTER_LONG" | "ENTER_SHORT" | "WAIT";
  action: string;
  side: "long" | "short" | "flat";
  entry: number;
  stopLoss: number;
  takeProfit: number;
  takeProfit2: number;
  targetPercent: number;
  confidence: number;
  compositeScore: number;
  summary: string;
  entryGuide: string;
  exitGuide: string;
  checklist: string[];
}

export function TradeSignalPanel({ signal }: { signal: TradeSignal }) {
  const signalColors = {
    ENTER_LONG: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    ENTER_SHORT: "border-red-500/40 bg-red-500/10 text-red-400",
    WAIT: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  };

  const signalLabels = {
    ENTER_LONG: "ENTER LONG",
    ENTER_SHORT: "ENTER SHORT",
    WAIT: "WAIT — NO TRADE YET",
  };

  return (
    <div className={`rounded-xl border p-4 ${signalColors[signal.signal]}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold tracking-wide">Technical Trade Signal</h3>
        <span className="rounded-lg bg-zinc-900/60 px-3 py-1 font-mono text-xs font-bold">
          {signalLabels[signal.signal]}
        </span>
      </div>

      <p className="mt-2 text-sm text-zinc-300">{signal.summary}</p>
      <p className="mt-1 text-xs text-zinc-500">
        Score {signal.compositeScore}/100 · {signal.side !== "flat" ? signal.side.toUpperCase() : "FLAT"} bias
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Level label="Entry" value={signal.entry} highlight />
        <Level label="Stop Loss (Exit)" value={signal.stopLoss} red />
        <Level label={`Take Profit (+${signal.targetPercent}%)`} value={signal.takeProfit} green />
        <Level label="TP2 (1:2)" value={signal.takeProfit2} green />
      </div>

      <div className="mt-4 space-y-2 rounded-lg bg-zinc-900/50 p-3 text-sm">
        <div>
          <span className="text-xs font-semibold uppercase text-emerald-500">Where to enter</span>
          <p className="mt-1 text-zinc-300">{signal.entryGuide}</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase text-red-400">Where to exit</span>
          <p className="mt-1 text-zinc-300">{signal.exitGuide}</p>
        </div>
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer text-xs text-zinc-500 hover:text-zinc-300">
          View full technical checklist ({signal.checklist.length} items)
        </summary>
        <ul className="mt-2 space-y-1 text-xs text-zinc-500">
          {signal.checklist.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function Level({
  label,
  value,
  red,
  green,
  highlight,
}: {
  label: string;
  value: number;
  red?: boolean;
  green?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-zinc-900/80 px-3 py-2">
      <div className="text-xs text-zinc-500">{label}</div>
      <div
        className={`font-mono text-lg font-bold ${
          red ? "text-red-400" : green ? "text-emerald-400" : highlight ? "text-zinc-100" : "text-zinc-300"
        }`}
      >
        ${value.toFixed(2)}
      </div>
    </div>
  );
}
