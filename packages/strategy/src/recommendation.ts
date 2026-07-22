import { analyzeDayStrategy, type DayStrategyAnalysis } from "./day-strategy.js";
import type { Candle } from "./types.js";

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
  direction?: "up" | "down" | "sideways";
  compositeScore?: number;
  nearestSupport?: number;
  nearestResistance?: number;
  candlePattern?: string;
  strategyScores?: Array<{ name: string; score: number; bias: string; detail: string }>;
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

export function dayAnalysisToRecommendation(
  analysis: DayStrategyAnalysis,
  name: string
): BuyRecommendation {
  return {
    ticker: analysis.ticker,
    name,
    action: analysis.action,
    confidence: analysis.confidence,
    price: analysis.price,
    changePercent: analysis.changePercent,
    entry: analysis.evenRisk.entry,
    stopLoss: analysis.evenRisk.stopLoss,
    takeProfit1: analysis.evenRisk.takeProfit1,
    takeProfit2: analysis.evenRisk.takeProfit2,
    riskReward: analysis.evenRisk.riskReward1,
    vwap: analysis.vwap,
    rsi: analysis.rsi,
    relativeVolume: analysis.relativeVolume,
    gapPercent: analysis.gapPercent,
    reason: analysis.summary,
    strategySignal: analysis.action,
    checklist: analysis.checklist,
    direction: analysis.direction,
    compositeScore: analysis.compositeScore,
    nearestSupport: analysis.supportResistance.nearestSupport ?? undefined,
    nearestResistance: analysis.supportResistance.nearestResistance ?? undefined,
    candlePattern: analysis.candlePatterns[0]?.pattern,
    strategyScores: analysis.strategyScores.map((s) => ({
      name: s.name,
      score: s.score,
      bias: s.bias,
      detail: s.detail,
    })),
  };
}

export function evaluateBuyRecommendation(input: {
  ticker: string;
  name: string;
  candles: Candle[];
  previousClose: number;
  averageVolume: number;
  fundamentals?: {
    marketCap?: number;
    revenueGrowth?: number;
    netIncome?: number;
    sector?: string;
  };
}): BuyRecommendation {
  const analysis = analyzeDayStrategy({
    ticker: input.ticker,
    candles: input.candles,
    previousClose: input.previousClose,
    averageVolume: input.averageVolume,
    fundamentals: input.fundamentals,
  });
  return dayAnalysisToRecommendation(analysis, input.name);
}

export function rankRecommendations(recs: BuyRecommendation[]): BuyRecommendation[] {
  const order: Record<BuyAction, number> = { BUY: 0, WAIT: 1, AVOID: 2 };
  return [...recs].sort((a, b) => {
    if (order[a.action] !== order[b.action]) return order[a.action] - order[b.action];
    return (b.compositeScore ?? b.confidence) - (a.compositeScore ?? a.confidence);
  });
}

export type { DayStrategyAnalysis };
