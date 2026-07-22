import {
  calculateGapPercent,
  calculateRelativeVolume,
  calculateRSI,
  calculateVWAP,
} from "./indicators.js";
import { OrbVwapStrategy, barsToCandles } from "./orb-vwap.js";
import type { Candle, StrategySignal } from "./types.js";

export type BuyAction = "BUY" | "WAIT" | "AVOID";

export interface BuyRecommendation {
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

export const TOP_10_US_STOCKS = [
  "AAPL",
  "MSFT",
  "NVDA",
  "AMZN",
  "GOOGL",
  "META",
  "TSLA",
  "AVGO",
  "JPM",
  "V",
] as const;

export function signalToAction(signal: StrategySignal | null): BuyAction {
  if (!signal) return "WAIT";
  switch (signal.type) {
    case "ENTER_LONG":
    case "TP1_HIT":
    case "TP2_HIT":
      return "BUY";
    case "ENTER_SHORT":
    case "SL_HIT":
      return "AVOID";
    case "EXIT":
      return "WAIT";
    default:
      return "WAIT";
  }
}

export function evaluateBuyRecommendation(input: {
  ticker: string;
  name: string;
  candles: Candle[];
  previousClose: number;
  averageVolume: number;
}): BuyRecommendation {
  const { ticker, name, candles, previousClose, averageVolume } = input;
  const strategy = new OrbVwapStrategy();
  const signal = strategy.evaluate(ticker, candles, previousClose, averageVolume);
  const state = strategy.getState(ticker);

  const latest = candles[candles.length - 1];
  const price = latest?.close ?? previousClose;
  const vwap = candles.length ? calculateVWAP(candles) : price;
  const rsi = candles.length ? calculateRSI(candles) : 50;
  const dayVolume = candles.reduce((s, c) => s + c.volume, 0);
  const relativeVolume = calculateRelativeVolume(dayVolume, averageVolume || dayVolume);
  const gapPercent = calculateGapPercent(price, previousClose);
  const changePercent = previousClose
    ? ((price - previousClose) / previousClose) * 100
    : 0;

  let action = signalToAction(signal);
  const checklist: string[] = [];
  let confidence = signal?.confidence ?? 30;
  let reason = signal?.reason ?? "No active setup — monitoring conditions";

  if (price > vwap) {
    checklist.push("Price above VWAP");
    confidence += 10;
  } else {
    checklist.push("Price below VWAP");
  }

  if (rsi >= 40 && rsi <= 70) {
    checklist.push(`RSI favorable (${rsi.toFixed(1)})`);
    confidence += 10;
  } else if (rsi > 70) {
    checklist.push(`RSI overbought (${rsi.toFixed(1)})`);
    confidence -= 10;
  } else {
    checklist.push(`RSI weak (${rsi.toFixed(1)})`);
  }

  if (relativeVolume >= 1.5) {
    checklist.push(`Strong volume (${relativeVolume.toFixed(1)}x)`);
    confidence += 15;
  } else if (relativeVolume >= 1.0) {
    checklist.push(`Average volume (${relativeVolume.toFixed(1)}x)`);
  } else {
    checklist.push(`Low volume (${relativeVolume.toFixed(1)}x)`);
    confidence -= 5;
  }

  if (Math.abs(gapPercent) >= 2) {
    checklist.push(`Notable gap (${gapPercent >= 0 ? "+" : ""}${gapPercent.toFixed(1)}%)`);
  }

  if (state?.openingRange?.complete) {
    checklist.push(
      `OR range $${state.openingRange.low.toFixed(2)} – $${state.openingRange.high.toFixed(2)}`
    );
    if (price > state.openingRange.high) {
      checklist.push("Above opening range high");
      if (action === "WAIT") confidence += 15;
    } else if (price < state.openingRange.low) {
      checklist.push("Below opening range low");
      if (action === "WAIT") action = "AVOID";
    }
  }

  if (!signal && action === "WAIT") {
    if (
      price > vwap &&
      rsi >= 40 &&
      rsi <= 70 &&
      relativeVolume >= 1.2 &&
      changePercent > 0
    ) {
      reason =
        "Bullish bias forming — above VWAP with volume, but no confirmed ORB breakout yet";
      confidence = Math.min(confidence, 55);
    } else if (price < vwap && rsi > 65) {
      action = "AVOID";
      reason = "Weak setup — below VWAP and extended RSI, wait for better entry";
      confidence = Math.max(confidence, 40);
    } else {
      reason = "No confirmed entry — wait for ORB breakout with VWAP confirmation";
    }
  }

  confidence = Math.max(0, Math.min(100, confidence));

  return {
    ticker: ticker.toUpperCase(),
    name,
    action,
    confidence,
    price,
    changePercent,
    entry: signal?.entry,
    stopLoss: signal?.stopLoss,
    takeProfit1: signal?.takeProfit1,
    takeProfit2: signal?.takeProfit2,
    riskReward: signal?.riskReward,
    vwap,
    rsi,
    relativeVolume,
    gapPercent,
    reason,
    strategySignal: signal?.type ?? "NONE",
    checklist,
  };
}

export function barsFromAggregates(
  bars: Array<{ t: number; o: number; h: number; l: number; c: number; v: number }>
): Candle[] {
  return barsToCandles(bars);
}

export function rankRecommendations(recs: BuyRecommendation[]): BuyRecommendation[] {
  const order: Record<BuyAction, number> = { BUY: 0, WAIT: 1, AVOID: 2 };
  return [...recs].sort((a, b) => {
    if (order[a.action] !== order[b.action]) return order[a.action] - order[b.action];
    return b.confidence - a.confidence;
  });
}
