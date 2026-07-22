import {
  calculateEMA,
  calculateGapPercent,
  calculateRelativeVolume,
  calculateRSI,
  calculateVWAP,
} from "./indicators.js";
import { detectCandlePatterns, type CandlePatternResult } from "./candlestick-patterns.js";
import { OrbVwapStrategy } from "./orb-vwap.js";
import {
  analyzeSupportResistance,
  srTradeBias,
  type SupportResistanceAnalysis,
} from "./support-resistance.js";
import type { BuyAction } from "./recommendation.js";
import type { Candle } from "./types.js";

export interface FundamentalsInput {
  marketCap?: number;
  revenueGrowth?: number;
  netIncome?: number;
  sector?: string;
}

export interface StrategyScore {
  name: string;
  score: number;
  maxScore: number;
  bias: "bullish" | "bearish" | "neutral";
  detail: string;
}

export interface EvenRiskLevels {
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  riskAmount: number;
  reward1: number;
  reward2: number;
  riskReward1: number;
  riskReward2: number;
}

export interface DayStrategyAnalysis {
  ticker: string;
  action: BuyAction;
  direction: "up" | "down" | "sideways";
  confidence: number;
  compositeScore: number;
  price: number;
  changePercent: number;
  vwap: number;
  rsi: number;
  relativeVolume: number;
  gapPercent: number;
  supportResistance: SupportResistanceAnalysis;
  candlePatterns: CandlePatternResult[];
  strategyScores: StrategyScore[];
  evenRisk: EvenRiskLevels;
  summary: string;
  checklist: string[];
}

export function scoreFundamentals(f: FundamentalsInput): StrategyScore {
  let score = 50;
  let bias: "bullish" | "bearish" | "neutral" = "neutral";
  const details: string[] = [];

  if (f.marketCap && f.marketCap > 10e9) {
    score += 10;
    details.push("Large-cap stability");
  }
  if (f.revenueGrowth !== undefined) {
    if (f.revenueGrowth > 5) {
      score += 15;
      bias = "bullish";
      details.push(`Revenue growing (${f.revenueGrowth.toFixed(1)}%)`);
    } else if (f.revenueGrowth < -5) {
      score -= 15;
      bias = "bearish";
      details.push(`Revenue declining (${f.revenueGrowth.toFixed(1)}%)`);
    }
  }
  if (f.netIncome !== undefined && f.netIncome > 0) {
    score += 10;
    details.push("Profitable");
  }

  return {
    name: "Fundamentals",
    score: Math.max(0, Math.min(100, score)),
    maxScore: 100,
    bias,
    detail: details.join("; ") || "Limited fundamental data",
  };
}

export function calculateEvenRisk(
  price: number,
  direction: "long" | "short",
  support: number | null,
  resistance: number | null
): EvenRiskLevels {
  const entry = price;
  let stopLoss: number;
  let takeProfit1: number;
  let takeProfit2: number;

  if (direction === "long") {
    stopLoss = support ?? price * 0.985;
    if (stopLoss >= entry) stopLoss = entry * 0.99;
    const risk = entry - stopLoss;
    takeProfit1 = entry + risk;
    takeProfit2 = entry + risk * 2;
  } else {
    stopLoss = resistance ?? price * 1.015;
    if (stopLoss <= entry) stopLoss = entry * 1.01;
    const risk = stopLoss - entry;
    takeProfit1 = entry - risk;
    takeProfit2 = entry - risk * 2;
  }

  const riskAmount = Math.abs(entry - stopLoss);
  const reward1 = Math.abs(takeProfit1 - entry);
  const reward2 = Math.abs(takeProfit2 - entry);

  return {
    entry,
    stopLoss,
    takeProfit1,
    takeProfit2,
    riskAmount,
    reward1,
    reward2,
    riskReward1: riskAmount > 0 ? reward1 / riskAmount : 1,
    riskReward2: riskAmount > 0 ? reward2 / riskAmount : 2,
  };
}

export function analyzeDayStrategy(input: {
  ticker: string;
  candles: Candle[];
  previousClose: number;
  averageVolume: number;
  fundamentals?: FundamentalsInput;
}): DayStrategyAnalysis {
  const { ticker, candles, previousClose, averageVolume, fundamentals } = input;
  const latest = candles[candles.length - 1];
  const price = latest?.close ?? previousClose;
  const vwap = candles.length ? calculateVWAP(candles) : price;
  const rsi = candles.length ? calculateRSI(candles) : 50;
  const closes = candles.map((c) => c.close);
  const ema9 = calculateEMA(closes, 9);
  const ema21 = calculateEMA(closes, 21);
  const dayVolume = candles.reduce((s, c) => s + c.volume, 0);
  const relativeVolume = calculateRelativeVolume(dayVolume, averageVolume || dayVolume);
  const gapPercent = calculateGapPercent(price, previousClose);
  const changePercent = previousClose ? ((price - previousClose) / previousClose) * 100 : 0;

  const sr = analyzeSupportResistance(candles, price);
  const srBias = srTradeBias(sr, price);
  const patterns = detectCandlePatterns(candles);
  const topPattern = patterns[0];

  const orbStrategy = new OrbVwapStrategy();
  const orbSignal = candles.length
    ? orbStrategy.evaluate(ticker, candles, previousClose, averageVolume)
    : null;

  const strategyScores: StrategyScore[] = [];

  let orbScore = 40;
  let orbBias: "bullish" | "bearish" | "neutral" = "neutral";
  if (orbSignal?.type === "ENTER_LONG") {
    orbScore = 85;
    orbBias = "bullish";
  } else if (orbSignal?.type === "ENTER_SHORT") {
    orbScore = 20;
    orbBias = "bearish";
  } else if (price > vwap) {
    orbScore = 60;
    orbBias = "bullish";
  } else {
    orbScore = 35;
    orbBias = "bearish";
  }
  strategyScores.push({
    name: "ORB + VWAP",
    score: orbScore,
    maxScore: 100,
    bias: orbBias,
    detail: orbSignal?.reason ?? (price > vwap ? "Above VWAP" : "Below VWAP"),
  });

  let srScore = 50;
  if (srBias.bias === "bullish") srScore = 75;
  else if (srBias.bias === "bearish") srScore = 25;
  strategyScores.push({
    name: "Support / Resistance",
    score: srScore,
    maxScore: 100,
    bias: srBias.bias,
    detail: srBias.reason,
  });

  let candleScore = 50;
  if (topPattern.signal === "bullish") candleScore = topPattern.confidence;
  else if (topPattern.signal === "bearish") candleScore = 100 - topPattern.confidence;
  strategyScores.push({
    name: "Candlestick Pattern",
    score: candleScore,
    maxScore: 100,
    bias: topPattern.signal,
    detail: topPattern.description,
  });

  let trendScore = 50;
  let trendBias: "bullish" | "bearish" | "neutral" = "neutral";
  if (ema9 > ema21 && price > ema9) {
    trendScore = 72;
    trendBias = "bullish";
  } else if (ema9 < ema21 && price < ema9) {
    trendScore = 28;
    trendBias = "bearish";
  }
  if (rsi >= 40 && rsi <= 65) trendScore += 8;
  else if (rsi > 75) trendScore -= 12;
  else if (rsi < 30) trendScore += 5;
  strategyScores.push({
    name: "EMA 9/21 + RSI",
    score: Math.max(0, Math.min(100, trendScore)),
    maxScore: 100,
    bias: trendBias,
    detail: `EMA9 ${ema9.toFixed(2)} / EMA21 ${ema21.toFixed(2)}, RSI ${rsi.toFixed(1)}`,
  });

  if (relativeVolume >= 1.5) {
    strategyScores.push({
      name: "Volume",
      score: 80,
      maxScore: 100,
      bias: "bullish",
      detail: `Relative volume ${relativeVolume.toFixed(1)}x — institutional interest`,
    });
  } else {
    strategyScores.push({
      name: "Volume",
      score: 40,
      maxScore: 100,
      bias: "neutral",
      detail: `Relative volume ${relativeVolume.toFixed(1)}x — below average`,
    });
  }

  if (fundamentals) {
    strategyScores.push(scoreFundamentals(fundamentals));
  }

  const weights = [0.25, 0.2, 0.2, 0.15, 0.1, 0.1];
  const compositeScore = Math.round(
    strategyScores.reduce((sum, s, i) => sum + s.score * (weights[i] ?? 0.1), 0)
  );

  const bullishCount = strategyScores.filter((s) => s.bias === "bullish").length;
  const bearishCount = strategyScores.filter((s) => s.bias === "bearish").length;

  let action: BuyAction = "WAIT";
  let direction: "up" | "down" | "sideways" = "sideways";

  if (compositeScore >= 68 && bullishCount >= 3) {
    action = "BUY";
    direction = "up";
  } else if (compositeScore <= 38 || bearishCount >= 3) {
    action = "AVOID";
    direction = "down";
  } else {
    action = "WAIT";
    direction = bullishCount > bearishCount ? "up" : bearishCount > bullishCount ? "down" : "sideways";
  }

  const tradeDirection = action === "AVOID" && bearishCount >= 3 ? "short" : "long";
  const evenRisk = calculateEvenRisk(
    price,
    tradeDirection,
    sr.nearestSupport,
    sr.nearestResistance
  );

  const checklist = [
    ...strategyScores.map((s) => `${s.name}: ${s.detail}`),
    `Support $${sr.nearestSupport?.toFixed(2)} / Resistance $${sr.nearestResistance?.toFixed(2)}`,
    topPattern.pattern !== "none" ? `Pattern: ${topPattern.pattern}` : "No strong candle pattern",
    `Even risk 1:1 TP $${evenRisk.takeProfit1.toFixed(2)}, 1:2 TP $${evenRisk.takeProfit2.toFixed(2)}`,
  ];

  const summary =
    action === "BUY"
      ? `Bullish confluence (${compositeScore}/100) — ${bullishCount} strategies align. Target up toward R $${sr.nearestResistance?.toFixed(2)}.`
      : action === "AVOID"
        ? `Bearish confluence (${compositeScore}/100) — risk toward S $${sr.nearestSupport?.toFixed(2)}.`
        : `Mixed signals (${compositeScore}/100) — wait for clearer S/R break or candle confirmation.`;

  return {
    ticker: ticker.toUpperCase(),
    action,
    direction,
    confidence: compositeScore,
    compositeScore,
    price,
    changePercent,
    vwap,
    rsi,
    relativeVolume,
    gapPercent,
    supportResistance: sr,
    candlePatterns: patterns,
    strategyScores,
    evenRisk,
    summary,
    checklist,
  };
}
