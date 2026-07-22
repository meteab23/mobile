import {
  calculateGapPercent,
  calculateRelativeVolume,
  calculateRSI,
  calculateVWAP,
  getMarketSession,
  isAfterOpeningRange,
  isWithinOpeningRangeWindow,
} from "./indicators.js";
import {
  DEFAULT_STRATEGY_CONFIG,
  type Candle,
  type OpeningRange,
  type StrategyConfig,
  type StrategySignal,
  type StrategyState,
} from "./types.js";

export class OrbVwapStrategy {
  private config: StrategyConfig;
  private state: Map<string, StrategyState> = new Map();

  constructor(config: Partial<StrategyConfig> = {}) {
    this.config = { ...DEFAULT_STRATEGY_CONFIG, ...config };
  }

  getState(ticker: string): StrategyState | undefined {
    return this.state.get(ticker.toUpperCase());
  }

  evaluate(
    ticker: string,
    candles: Candle[],
    previousClose: number,
    averageVolume: number
  ): StrategySignal | null {
    const symbol = ticker.toUpperCase();
    if (candles.length === 0) return null;

    const latest = candles[candles.length - 1];
    const vwap = calculateVWAP(candles);
    const rsi = calculateRSI(candles);
    const dayVolume = candles.reduce((s, c) => s + c.volume, 0);
    const relativeVolume = calculateRelativeVolume(dayVolume, averageVolume);
    const gapPercent = calculateGapPercent(latest.close, previousClose);
    const session = getMarketSession(latest.time);

    let state = this.state.get(symbol);
    if (!state) {
      state = this.createInitialState(symbol);
      this.state.set(symbol, state);
    }

    state.vwap = vwap;
    state.rsi = rsi;
    state.relativeVolume = relativeVolume;
    state.gapPercent = gapPercent;

    if (session === "pre_market") {
      return this.evaluatePreMarket(state, latest, session);
    }

    state.openingRange = this.computeOpeningRange(
      candles,
      this.config.openingRangeMinutes
    );

    if (!state.openingRange?.complete) {
      return this.createSignal(state, "WATCH", latest.close, latest.time, session, {
        reason: "Building opening range — waiting for first 15 minutes to complete",
        confidence: 20,
      });
    }

    if (state.inTrade) {
      return this.manageTrade(state, latest, session);
    }

    return this.evaluateEntry(state, latest, session);
  }

  private createInitialState(ticker: string): StrategyState {
    return {
      ticker,
      openingRange: null,
      vwap: 0,
      rsi: 50,
      relativeVolume: 1,
      gapPercent: 0,
      activeSignal: null,
      inTrade: false,
      tradeDirection: null,
      entryPrice: null,
      stopLoss: null,
      takeProfit1: null,
      takeProfit2: null,
    };
  }

  private computeOpeningRange(
    candles: Candle[],
    rangeMinutes: number
  ): OpeningRange | null {
    const orCandles = candles.filter((c) =>
      isWithinOpeningRangeWindow(c.time, rangeMinutes)
    );

    if (orCandles.length === 0) {
      const hasPastOR = candles.some((c) =>
        isAfterOpeningRange(c.time, rangeMinutes)
      );
      if (!hasPastOR) return null;

      const firstRegular = candles.filter((c) => {
        const session = getMarketSession(c.time);
        return session === "regular";
      });
      const orWindow = firstRegular.slice(0, rangeMinutes);
      if (orWindow.length === 0) return null;

      return {
        high: Math.max(...orWindow.map((c) => c.high)),
        low: Math.min(...orWindow.map((c) => c.low)),
        startTime: orWindow[0].time,
        endTime: orWindow[orWindow.length - 1].time,
        complete: orWindow.length >= rangeMinutes || isAfterOpeningRange(candles[candles.length - 1].time, rangeMinutes),
      };
    }

    return {
      high: Math.max(...orCandles.map((c) => c.high)),
      low: Math.min(...orCandles.map((c) => c.low)),
      startTime: orCandles[0].time,
      endTime: orCandles[orCandles.length - 1].time,
      complete: isAfterOpeningRange(candles[candles.length - 1].time, rangeMinutes),
    };
  }

  private evaluatePreMarket(
    state: StrategyState,
    latest: Candle,
    session: "pre_market" | "regular" | "after_hours"
  ): StrategySignal | null {
    const gap = Math.abs(state.gapPercent);
    const volOk = state.relativeVolume >= this.config.minRelativeVolume;
    const gapOk = gap >= this.config.gapThresholdPercent;

    if (gapOk && volOk) {
      const direction = state.gapPercent > 0 ? "long" : "short";
      return this.createSignal(
        state,
        "WATCH",
        latest.close,
        latest.time,
        session,
        {
          reason: `Gap-and-go candidate: ${state.gapPercent.toFixed(2)}% gap with ${state.relativeVolume.toFixed(1)}x relative volume — watch for ORB at open (${direction})`,
          confidence: 55,
          reducedReliability: true,
        }
      );
    }

    return this.createSignal(state, "WATCH", latest.close, latest.time, session, {
      reason: "Pre-market — monitoring for gap and volume setup",
      confidence: 15,
      reducedReliability: true,
    });
  }

  private evaluateEntry(
    state: StrategyState,
    latest: Candle,
    session: "pre_market" | "regular" | "after_hours"
  ): StrategySignal | null {
    const or = state.openingRange;
    if (!or) return null;

    const volOk = state.relativeVolume >= this.config.minRelativeVolume;
    const checklist: string[] = [];
    let confidence = 0;

    const brokeAbove = latest.close > or.high && latest.close > state.vwap;
    const brokeBelow = latest.close < or.low && latest.close < state.vwap;

    if (brokeAbove) {
      checklist.push("Broke above opening range high");
      confidence += 25;
      if (latest.close > state.vwap) {
        checklist.push("Price above VWAP");
        confidence += 20;
      }
      if (state.rsi >= this.config.rsiMin && state.rsi <= this.config.rsiMax) {
        checklist.push(`RSI in range (${state.rsi.toFixed(1)})`);
        confidence += 15;
      }
      if (volOk) {
        checklist.push(`Relative volume ${state.relativeVolume.toFixed(1)}x`);
        confidence += 20;
      } else {
        checklist.push("Volume below threshold — reduced confidence");
      }

      if (confidence >= 50) {
        const entry = latest.close;
        const orWidth = or.high - or.low;
        const sl = Math.max(or.low, entry - orWidth);
        const risk = entry - sl;
        const tp1 = entry + risk * this.config.tp1Multiplier;
        const tp2 = entry + risk * this.config.tp2Multiplier;

        state.inTrade = true;
        state.tradeDirection = "long";
        state.entryPrice = entry;
        state.stopLoss = sl;
        state.takeProfit1 = tp1;
        state.takeProfit2 = tp2;

        return this.createSignal(state, "ENTER_LONG", entry, latest.time, session, {
          reason: checklist.join("; "),
          confidence,
          entry,
          stopLoss: sl,
          takeProfit1: tp1,
          takeProfit2: tp2,
          riskReward: risk > 0 ? (tp1 - entry) / risk : 0,
        });
      }
    }

    if (brokeBelow) {
      checklist.push("Broke below opening range low");
      confidence += 25;
      if (latest.close < state.vwap) {
        checklist.push("Price below VWAP");
        confidence += 20;
      }
      if (state.rsi >= 100 - this.config.rsiMax && state.rsi <= 100 - this.config.rsiMin) {
        checklist.push(`RSI favorable for short (${state.rsi.toFixed(1)})`);
        confidence += 15;
      }
      if (volOk) {
        checklist.push(`Relative volume ${state.relativeVolume.toFixed(1)}x`);
        confidence += 20;
      }

      if (confidence >= 50) {
        const entry = latest.close;
        const orWidth = or.high - or.low;
        const sl = Math.min(or.high, entry + orWidth);
        const risk = sl - entry;
        const tp1 = entry - risk * this.config.tp1Multiplier;
        const tp2 = entry - risk * this.config.tp2Multiplier;

        state.inTrade = true;
        state.tradeDirection = "short";
        state.entryPrice = entry;
        state.stopLoss = sl;
        state.takeProfit1 = tp1;
        state.takeProfit2 = tp2;

        return this.createSignal(state, "ENTER_SHORT", entry, latest.time, session, {
          reason: checklist.join("; "),
          confidence,
          entry,
          stopLoss: sl,
          takeProfit1: tp1,
          takeProfit2: tp2,
          riskReward: risk > 0 ? (entry - tp1) / risk : 0,
        });
      }
    }

    const nearHigh = Math.abs(latest.close - or.high) / or.high < 0.003;
    const nearLow = Math.abs(latest.close - or.low) / or.low < 0.003;

    if (nearHigh || nearLow) {
      return this.createSignal(state, "WATCH", latest.close, latest.time, session, {
        reason: nearHigh
          ? "Price approaching opening range high — breakout watch"
          : "Price approaching opening range low — breakdown watch",
        confidence: 35,
      });
    }

    return null;
  }

  private manageTrade(
    state: StrategyState,
    latest: Candle,
    session: "pre_market" | "regular" | "after_hours"
  ): StrategySignal | null {
    const { tradeDirection, entryPrice, stopLoss, takeProfit1, takeProfit2 } =
      state;
    if (!entryPrice || !stopLoss || !takeProfit1 || !takeProfit2) return null;

    const price = latest.close;

    if (tradeDirection === "long") {
      if (price <= stopLoss) {
        this.resetTrade(state);
        return this.createSignal(state, "SL_HIT", price, latest.time, session, {
          reason: "Stop loss hit — price fell below opening range support",
          confidence: 100,
          entry: entryPrice,
          stopLoss,
        });
      }
      if (price >= takeProfit2) {
        this.resetTrade(state);
        return this.createSignal(state, "TP2_HIT", price, latest.time, session, {
          reason: "Take profit 2 reached (2.5R)",
          confidence: 100,
          entry: entryPrice,
          takeProfit1,
          takeProfit2,
        });
      }
      if (price >= takeProfit1) {
        return this.createSignal(state, "TP1_HIT", price, latest.time, session, {
          reason: "Take profit 1 reached (1.5R) — consider partial exit",
          confidence: 90,
          entry: entryPrice,
          takeProfit1,
          takeProfit2,
          stopLoss,
        });
      }
      if (price < state.vwap) {
        this.resetTrade(state);
        return this.createSignal(state, "EXIT", price, latest.time, session, {
          reason: "VWAP breakdown — exit long",
          confidence: 85,
          entry: entryPrice,
        });
      }
    }

    if (tradeDirection === "short") {
      if (price >= stopLoss) {
        this.resetTrade(state);
        return this.createSignal(state, "SL_HIT", price, latest.time, session, {
          reason: "Stop loss hit — price rose above opening range resistance",
          confidence: 100,
          entry: entryPrice,
          stopLoss,
        });
      }
      if (price <= takeProfit2) {
        this.resetTrade(state);
        return this.createSignal(state, "TP2_HIT", price, latest.time, session, {
          reason: "Take profit 2 reached (2.5R)",
          confidence: 100,
          entry: entryPrice,
          takeProfit1,
          takeProfit2,
        });
      }
      if (price <= takeProfit1) {
        return this.createSignal(state, "TP1_HIT", price, latest.time, session, {
          reason: "Take profit 1 reached (1.5R) — consider partial exit",
          confidence: 90,
          entry: entryPrice,
          takeProfit1,
          takeProfit2,
          stopLoss,
        });
      }
      if (price > state.vwap) {
        this.resetTrade(state);
        return this.createSignal(state, "EXIT", price, latest.time, session, {
          reason: "VWAP reclaim — exit short",
          confidence: 85,
          entry: entryPrice,
        });
      }
    }

    return this.createSignal(state, "HOLD", price, latest.time, session, {
      reason: `In ${tradeDirection} trade — monitoring TP/SL levels`,
      confidence: 70,
      entry: entryPrice,
      stopLoss,
      takeProfit1,
      takeProfit2,
    });
  }

  private resetTrade(state: StrategyState): void {
    state.inTrade = false;
    state.tradeDirection = null;
    state.entryPrice = null;
    state.stopLoss = null;
    state.takeProfit1 = null;
    state.takeProfit2 = null;
  }

  private createSignal(
    state: StrategyState,
    type: StrategySignal["type"],
    price: number,
    timestamp: number,
    session: StrategySignal["session"],
    extra: Partial<StrategySignal> = {}
  ): StrategySignal {
    const signal: StrategySignal = {
      type,
      ticker: state.ticker,
      timestamp,
      price,
      confidence: extra.confidence ?? 50,
      reason: extra.reason ?? "",
      session,
      reducedReliability:
        extra.reducedReliability ?? session !== "regular",
      ...extra,
    };
    state.activeSignal = signal;
    return signal;
  }
}

export function barsToCandles(
  bars: Array<{ t: number; o: number; h: number; l: number; c: number; v: number }>
): Candle[] {
  return bars.map((b) => ({
    time: b.t,
    open: b.o,
    high: b.h,
    low: b.l,
    close: b.c,
    volume: b.v,
  }));
}
