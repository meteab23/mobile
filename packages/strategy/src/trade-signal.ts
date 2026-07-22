import type { DayStrategyAnalysis } from "./day-strategy.js";
import type { BuyAction } from "./recommendation.js";
import type { ScalpSetup, ScalpTarget } from "./scalping.js";

export type TradeSignalType = "ENTER_LONG" | "ENTER_SHORT" | "WAIT";

export interface TradeSignal {
  signal: TradeSignalType;
  action: BuyAction;
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

/** Merge day-strategy confluence with scalp TP/SL for clear entry/exit levels. */
export function buildScalpTradeSignal(
  analysis: DayStrategyAnalysis,
  scalpLong: ScalpSetup,
  scalpShort: ScalpSetup,
  scalpTarget: ScalpTarget
): TradeSignal {
  const { action, compositeScore, supportResistance: sr } = analysis;
  const support = sr.nearestSupport;
  const resistance = sr.nearestResistance;

  let signal: TradeSignalType = "WAIT";
  let side: TradeSignal["side"] = "flat";
  let setup = scalpLong;
  let entryGuide = "";
  let exitGuide = "";

  if (action === "BUY" && analysis.direction === "up") {
    signal = "ENTER_LONG";
    side = "long";
    setup = scalpLong;
    entryGuide = `Enter long near $${setup.entry.toFixed(2)} — buy pullback to support $${support?.toFixed(2) ?? "N/A"} or break above $${resistance?.toFixed(2) ?? "N/A"}.`;
    exitGuide = `Take profit at $${setup.takeProfit.toFixed(2)} (+${scalpTarget}%). Stop out at $${setup.stopLoss.toFixed(2)} if wrong.`;
  } else if (action === "AVOID" && analysis.direction === "down") {
    signal = "ENTER_SHORT";
    side = "short";
    setup = scalpShort;
    entryGuide = `Enter short near $${setup.entry.toFixed(2)} — sell rejection at resistance $${resistance?.toFixed(2) ?? "N/A"}.`;
    exitGuide = `Cover at $${setup.takeProfit.toFixed(2)} (+${scalpTarget}%). Stop out at $${setup.stopLoss.toFixed(2)} if wrong.`;
  } else if (compositeScore >= 55 && analysis.direction !== "down") {
    side = "long";
    setup = scalpLong;
    entryGuide = `Wait for break above $${(resistance ?? setup.entry * 1.005).toFixed(2)} to confirm long, or enter on dip to $${support?.toFixed(2) ?? setup.entry.toFixed(2)}.`;
    exitGuide = `Target $${setup.takeProfit.toFixed(2)}, stop $${setup.stopLoss.toFixed(2)}.`;
  } else if (compositeScore <= 45 && analysis.direction !== "up") {
    side = "short";
    setup = scalpShort;
    entryGuide = `Wait for break below $${(support ?? setup.entry * 0.995).toFixed(2)} to confirm short.`;
    exitGuide = `Target $${setup.takeProfit.toFixed(2)}, stop $${setup.stopLoss.toFixed(2)}.`;
  } else {
    setup = compositeScore >= 50 ? scalpLong : scalpShort;
    side = compositeScore >= 50 ? "long" : "short";
    entryGuide = "Mixed signals — wait for S/R break or candle confirmation before entering.";
    exitGuide = `If entered: TP $${setup.takeProfit.toFixed(2)}, SL $${setup.stopLoss.toFixed(2)}.`;
  }

  return {
    signal,
    action,
    side,
    entry: setup.entry,
    stopLoss: setup.stopLoss,
    takeProfit: setup.takeProfit,
    takeProfit2: analysis.evenRisk.takeProfit2,
    targetPercent: scalpTarget,
    confidence: compositeScore,
    compositeScore,
    summary: analysis.summary,
    entryGuide,
    exitGuide,
    checklist: analysis.checklist,
  };
}
