import type { Candle } from "./types.js";

export type CandlePattern =
  | "hammer"
  | "inverted_hammer"
  | "shooting_star"
  | "hanging_man"
  | "bullish_engulfing"
  | "bearish_engulfing"
  | "doji"
  | "morning_star"
  | "evening_star"
  | "three_white_soldiers"
  | "three_black_crows"
  | "none";

export interface CandlePatternResult {
  pattern: CandlePattern;
  signal: "bullish" | "bearish" | "neutral";
  confidence: number;
  description: string;
  barIndex: number;
}

function bodySize(c: Candle): number {
  return Math.abs(c.close - c.open);
}

function upperShadow(c: Candle): number {
  return c.high - Math.max(c.open, c.close);
}

function lowerShadow(c: Candle): number {
  return Math.min(c.open, c.close) - c.low;
}

function isBullish(c: Candle): boolean {
  return c.close > c.open;
}

function range(c: Candle): number {
  return c.high - c.low || 0.0001;
}

function detectSingle(c: Candle, prev?: Candle): CandlePatternResult | null {
  const body = bodySize(c);
  const r = range(c);
  const bodyRatio = body / r;

  if (bodyRatio < 0.1) {
    return {
      pattern: "doji",
      signal: "neutral",
      confidence: 55,
      description: "Doji — indecision, wait for confirmation candle",
      barIndex: -1,
    };
  }

  const lower = lowerShadow(c);
  const upper = upperShadow(c);

  if (bodyRatio < 0.35 && lower > body * 2 && upper < body * 0.5) {
    return {
      pattern: isBullish(c) ? "hammer" : "hanging_man",
      signal: isBullish(c) ? "bullish" : "bearish",
      confidence: 70,
      description: isBullish(c)
        ? "Hammer — bullish reversal at support"
        : "Hanging man — bearish warning at highs",
      barIndex: -1,
    };
  }

  if (bodyRatio < 0.35 && upper > body * 2 && lower < body * 0.5) {
    return {
      pattern: isBullish(c) ? "inverted_hammer" : "shooting_star",
      signal: isBullish(c) ? "bullish" : "bearish",
      confidence: 68,
      description: isBullish(c)
        ? "Inverted hammer — potential bullish reversal"
        : "Shooting star — bearish rejection at resistance",
      barIndex: -1,
    };
  }

  if (prev) {
    if (!isBullish(prev) && isBullish(c) && c.open <= prev.close && c.close >= prev.open) {
      return {
        pattern: "bullish_engulfing",
        signal: "bullish",
        confidence: 78,
        description: "Bullish engulfing — strong buy signal",
        barIndex: -1,
      };
    }
    if (isBullish(prev) && !isBullish(c) && c.open >= prev.close && c.close <= prev.open) {
      return {
        pattern: "bearish_engulfing",
        signal: "bearish",
        confidence: 78,
        description: "Bearish engulfing — strong sell signal",
        barIndex: -1,
      };
    }
  }

  return null;
}

function detectMulti(candles: Candle[]): CandlePatternResult | null {
  if (candles.length < 3) return null;
  const [a, b, c] = candles.slice(-3);

  const aBear = !isBullish(a);
  const bSmall = bodySize(b) / range(b) < 0.3;
  const cBull = isBullish(c) && c.close > (a.open + a.close) / 2;

  if (aBear && bSmall && cBull) {
    return {
      pattern: "morning_star",
      signal: "bullish",
      confidence: 82,
      description: "Morning star — 3-candle bullish reversal pattern",
      barIndex: candles.length - 1,
    };
  }

  const aBull = isBullish(a);
  const cBear = !isBullish(c) && c.close < (a.open + a.close) / 2;

  if (aBull && bSmall && cBear) {
    return {
      pattern: "evening_star",
      signal: "bearish",
      confidence: 82,
      description: "Evening star — 3-candle bearish reversal pattern",
      barIndex: candles.length - 1,
    };
  }

  if (candles.length >= 3) {
    const last3 = candles.slice(-3);
    if (last3.every(isBullish) && last3.every((x, i) => i === 0 || x.close > last3[i - 1].close)) {
      return {
        pattern: "three_white_soldiers",
        signal: "bullish",
        confidence: 75,
        description: "Three white soldiers — sustained bullish momentum",
        barIndex: candles.length - 1,
      };
    }
    if (last3.every((x) => !isBullish(x)) && last3.every((x, i) => i === 0 || x.close < last3[i - 1].close)) {
      return {
        pattern: "three_black_crows",
        signal: "bearish",
        confidence: 75,
        description: "Three black crows — sustained bearish pressure",
        barIndex: candles.length - 1,
      };
    }
  }

  return null;
}

export function detectCandlePatterns(candles: Candle[]): CandlePatternResult[] {
  if (candles.length === 0) return [];

  const results: CandlePatternResult[] = [];
  const latest = candles[candles.length - 1];
  const prev = candles.length > 1 ? candles[candles.length - 2] : undefined;

  const multi = detectMulti(candles);
  if (multi) results.push(multi);

  const single = detectSingle(latest, prev);
  if (single && !results.some((r) => r.pattern === single.pattern)) {
    results.push(single);
  }

  if (results.length === 0) {
    results.push({
      pattern: "none",
      signal: "neutral",
      confidence: 30,
      description: "No classic reversal pattern on latest candles",
      barIndex: candles.length - 1,
    });
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}

export function candleBias(
  patterns: CandlePatternResult[]
): { signal: "bullish" | "bearish" | "neutral"; topPattern: CandlePatternResult } {
  const top = patterns[0];
  return { signal: top.signal, topPattern: top };
}
