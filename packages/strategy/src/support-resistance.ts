import type { Candle } from "./types.js";

export interface SupportResistanceLevel {
  price: number;
  strength: number;
  type: "support" | "resistance";
  touches: number;
}

export interface SupportResistanceAnalysis {
  supports: SupportResistanceLevel[];
  resistances: SupportResistanceLevel[];
  nearestSupport: number | null;
  nearestResistance: number | null;
  pricePosition: "at_support" | "at_resistance" | "mid_range" | "breakout" | "breakdown";
  pivotPoint: number;
  r1: number;
  r2: number;
  s1: number;
  s2: number;
}

function isSwingHigh(candles: Candle[], i: number, lookback = 2): boolean {
  if (i < lookback || i >= candles.length - lookback) return false;
  const h = candles[i].high;
  for (let j = 1; j <= lookback; j++) {
    if (candles[i - j].high >= h || candles[i + j].high >= h) return false;
  }
  return true;
}

function isSwingLow(candles: Candle[], i: number, lookback = 2): boolean {
  if (i < lookback || i >= candles.length - lookback) return false;
  const l = candles[i].low;
  for (let j = 1; j <= lookback; j++) {
    if (candles[i - j].low <= l || candles[i + j].low <= l) return false;
  }
  return true;
}

function clusterLevels(
  prices: number[],
  tolerancePct = 0.005
): Array<{ price: number; touches: number }> {
  if (prices.length === 0) return [];
  const sorted = [...prices].sort((a, b) => a - b);
  const clusters: Array<{ price: number; touches: number; sum: number }> = [];

  for (const p of sorted) {
    const existing = clusters.find(
      (c) => Math.abs(c.price - p) / c.price < tolerancePct
    );
    if (existing) {
      existing.sum += p;
      existing.touches += 1;
      existing.price = existing.sum / existing.touches;
    } else {
      clusters.push({ price: p, touches: 1, sum: p });
    }
  }

  return clusters
    .map((c) => ({ price: c.price, touches: c.touches }))
    .sort((a, b) => b.touches - a.touches);
}

export function calculatePivotPoints(candle: Candle): {
  pivot: number;
  r1: number;
  r2: number;
  s1: number;
  s2: number;
} {
  const pivot = (candle.high + candle.low + candle.close) / 3;
  const r1 = 2 * pivot - candle.low;
  const s1 = 2 * pivot - candle.high;
  const r2 = pivot + (candle.high - candle.low);
  const s2 = pivot - (candle.high - candle.low);
  return { pivot, r1, r2, s1, s2 };
}

export function analyzeSupportResistance(
  candles: Candle[],
  currentPrice: number
): SupportResistanceAnalysis {
  if (candles.length < 5) {
    const p = currentPrice;
    return {
      supports: [],
      resistances: [],
      nearestSupport: p * 0.98,
      nearestResistance: p * 1.02,
      pricePosition: "mid_range",
      pivotPoint: p,
      r1: p * 1.01,
      r2: p * 1.02,
      s1: p * 0.99,
      s2: p * 0.98,
    };
  }

  const swingHighs: number[] = [];
  const swingLows: number[] = [];

  for (let i = 2; i < candles.length - 2; i++) {
    if (isSwingHigh(candles, i)) swingHighs.push(candles[i].high);
    if (isSwingLow(candles, i)) swingLows.push(candles[i].low);
  }

  const prev = candles[candles.length - 2] ?? candles[candles.length - 1];
  const pivots = calculatePivotPoints(prev);

  const resistanceClusters = clusterLevels([
    ...swingHighs,
    pivots.r1,
    pivots.r2,
  ]);
  const supportClusters = clusterLevels([
    ...swingLows,
    pivots.s1,
    pivots.s2,
  ]);

  const resistances: SupportResistanceLevel[] = resistanceClusters
    .filter((c) => c.price > currentPrice * 0.995)
    .slice(0, 5)
    .map((c) => ({
      price: c.price,
      strength: Math.min(100, c.touches * 25),
      type: "resistance" as const,
      touches: c.touches,
    }));

  const supports: SupportResistanceLevel[] = supportClusters
    .filter((c) => c.price < currentPrice * 1.005)
    .slice(0, 5)
    .map((c) => ({
      price: c.price,
      strength: Math.min(100, c.touches * 25),
      type: "support" as const,
      touches: c.touches,
    }));

  const nearestSupport =
    supports.filter((s) => s.price <= currentPrice).sort((a, b) => b.price - a.price)[0]
      ?.price ??
    supports[0]?.price ??
    currentPrice * 0.98;

  const nearestResistance =
    resistances.filter((r) => r.price >= currentPrice).sort((a, b) => a.price - b.price)[0]
      ?.price ??
    resistances[0]?.price ??
    currentPrice * 1.02;

  let pricePosition: SupportResistanceAnalysis["pricePosition"] = "mid_range";
  const supportDist = Math.abs(currentPrice - nearestSupport) / currentPrice;
  const resistDist = Math.abs(nearestResistance - currentPrice) / currentPrice;

  if (supportDist < 0.003) pricePosition = "at_support";
  else if (resistDist < 0.003) pricePosition = "at_resistance";
  else if (currentPrice > nearestResistance) pricePosition = "breakout";
  else if (currentPrice < nearestSupport) pricePosition = "breakdown";

  return {
    supports,
    resistances,
    nearestSupport,
    nearestResistance,
    pricePosition,
    pivotPoint: pivots.pivot,
    r1: pivots.r1,
    r2: pivots.r2,
    s1: pivots.s1,
    s2: pivots.s2,
  };
}

export function srTradeBias(
  sr: SupportResistanceAnalysis,
  price: number
): { bias: "bullish" | "bearish" | "neutral"; reason: string } {
  switch (sr.pricePosition) {
    case "at_support":
      return { bias: "bullish", reason: "Price at support — bounce potential" };
    case "at_resistance":
      return { bias: "bearish", reason: "Price at resistance — rejection risk" };
    case "breakout":
      return { bias: "bullish", reason: "Breakout above resistance — momentum long" };
    case "breakdown":
      return { bias: "bearish", reason: "Breakdown below support — avoid longs" };
    default:
      return {
        bias: "neutral",
        reason: `Mid-range between S $${sr.nearestSupport?.toFixed(2)} and R $${sr.nearestResistance?.toFixed(2)}`,
      };
  }
}
