export type ScalpDirection = "long" | "short";

export interface ScalpSetup {
  direction: ScalpDirection;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  targetPercent: number;
  stopPercent: number;
  riskReward: number;
  potentialProfit: number;
  potentialLoss: number;
}

export const SCALP_TARGETS = [2, 3, 4, 5] as const;
export type ScalpTarget = (typeof SCALP_TARGETS)[number];

/** Scalp for 2–5% profit; stop at half the target (2:1 reward:risk). */
export function calculateScalpLevels(
  price: number,
  targetPercent: ScalpTarget,
  direction: ScalpDirection = "long"
): ScalpSetup {
  const stopPercent = targetPercent / 2;

  if (direction === "long") {
    const takeProfit = price * (1 + targetPercent / 100);
    const stopLoss = price * (1 - stopPercent / 100);
    const risk = price - stopLoss;
    const reward = takeProfit - price;
    return {
      direction,
      entry: price,
      stopLoss,
      takeProfit,
      targetPercent,
      stopPercent,
      riskReward: risk > 0 ? reward / risk : 0,
      potentialProfit: reward,
      potentialLoss: risk,
    };
  }

  const takeProfit = price * (1 - targetPercent / 100);
  const stopLoss = price * (1 + stopPercent / 100);
  const risk = stopLoss - price;
  const reward = price - takeProfit;
  return {
    direction,
    entry: price,
    stopLoss,
    takeProfit,
    targetPercent,
    stopPercent,
    riskReward: risk > 0 ? reward / risk : 0,
    potentialProfit: reward,
    potentialLoss: risk,
  };
}

export type TrendDirection = "up" | "down" | "sideways";

export function detectTrend(
  ema9: number,
  ema21: number,
  price: number
): { trend: TrendDirection; label: string } {
  const spread = ((ema9 - ema21) / ema21) * 100;
  if (ema9 > ema21 && price > ema9) {
    return { trend: "up", label: `Uptrend (EMA9 above EMA21, +${spread.toFixed(2)}%)` };
  }
  if (ema9 < ema21 && price < ema9) {
    return { trend: "down", label: `Downtrend (EMA9 below EMA21, ${spread.toFixed(2)}%)` };
  }
  return { trend: "sideways", label: "Sideways — no clear trend" };
}
