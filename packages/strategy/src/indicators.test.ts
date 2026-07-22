import { describe, expect, it } from "vitest";
import {
  calculateGapPercent,
  calculateRelativeVolume,
  calculateRSI,
  calculateVWAP,
} from "./indicators.js";
import type { Candle } from "./types.js";

const sampleCandles: Candle[] = [
  { time: 1, open: 100, high: 102, low: 99, close: 101, volume: 1000 },
  { time: 2, open: 101, high: 103, low: 100, close: 102, volume: 1500 },
  { time: 3, open: 102, high: 104, low: 101, close: 103, volume: 2000 },
  { time: 4, open: 103, high: 105, low: 102, close: 104, volume: 1200 },
  { time: 5, open: 104, high: 106, low: 103, close: 105, volume: 1800 },
];

describe("indicators", () => {
  it("calculates VWAP", () => {
    const vwap = calculateVWAP(sampleCandles);
    expect(vwap).toBeGreaterThan(0);
    expect(vwap).toBeLessThan(110);
  });

  it("calculates RSI in valid range", () => {
    const rsi = calculateRSI(sampleCandles);
    expect(rsi).toBeGreaterThanOrEqual(0);
    expect(rsi).toBeLessThanOrEqual(100);
  });

  it("calculates relative volume", () => {
    expect(calculateRelativeVolume(1500, 1000)).toBe(1.5);
  });

  it("calculates gap percent", () => {
    expect(calculateGapPercent(105, 100)).toBeCloseTo(5);
  });
});
