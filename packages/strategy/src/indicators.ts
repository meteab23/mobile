import type { Candle } from "./types.js";

export function calculateVWAP(candles: Candle[]): number {
  if (candles.length === 0) return 0;
  let cumVolPrice = 0;
  let cumVol = 0;
  for (const c of candles) {
    const typical = (c.high + c.low + c.close) / 3;
    cumVolPrice += typical * c.volume;
    cumVol += c.volume;
  }
  return cumVol > 0 ? cumVolPrice / cumVol : 0;
}

export function calculateRSI(candles: Candle[], period = 14): number {
  if (candles.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = candles.length - period; i < candles.length; i++) {
    const change = candles[i].close - candles[i - 1].close;
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export function calculateEMA(values: number[], period: number): number {
  if (values.length === 0) return 0;
  if (values.length < period) {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
  const k = 2 / (period + 1);
  let ema = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < values.length; i++) {
    ema = values[i] * k + ema * (1 - k);
  }
  return ema;
}

export function calculateRelativeVolume(
  currentVolume: number,
  averageVolume: number
): number {
  if (averageVolume <= 0) return 1;
  return currentVolume / averageVolume;
}

export function calculateGapPercent(
  currentPrice: number,
  previousClose: number
): number {
  if (previousClose <= 0) return 0;
  return ((currentPrice - previousClose) / previousClose) * 100;
}

export function isWithinOpeningRangeWindow(
  timestampMs: number,
  rangeMinutes: number
): boolean {
  const et = getETComponents(timestampMs);
  const marketOpenMinutes = 9 * 60 + 30;
  const currentMinutes = et.hours * 60 + et.minutes;
  return (
    currentMinutes >= marketOpenMinutes &&
    currentMinutes < marketOpenMinutes + rangeMinutes
  );
}

export function isAfterOpeningRange(
  timestampMs: number,
  rangeMinutes: number
): boolean {
  const et = getETComponents(timestampMs);
  const marketOpenMinutes = 9 * 60 + 30;
  const currentMinutes = et.hours * 60 + et.minutes;
  return currentMinutes >= marketOpenMinutes + rangeMinutes;
}

export function getETComponents(timestampMs: number): {
  hours: number;
  minutes: number;
} {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = formatter.formatToParts(new Date(timestampMs));
  const hours = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minutes = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return { hours, minutes };
}

export function getMarketSession(
  timestampMs: number
): "pre_market" | "regular" | "after_hours" {
  const et = getETComponents(timestampMs);
  const mins = et.hours * 60 + et.minutes;
  if (mins >= 4 * 60 && mins < 9 * 60 + 30) return "pre_market";
  if (mins >= 9 * 60 + 30 && mins < 16 * 60) return "regular";
  return "after_hours";
}
