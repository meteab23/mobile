export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type SignalType =
  | "WATCH"
  | "ENTER_LONG"
  | "ENTER_SHORT"
  | "HOLD"
  | "EXIT"
  | "TP1_HIT"
  | "TP2_HIT"
  | "SL_HIT";

export interface StrategySignal {
  type: SignalType;
  ticker: string;
  timestamp: number;
  price: number;
  entry?: number;
  stopLoss?: number;
  takeProfit1?: number;
  takeProfit2?: number;
  riskReward?: number;
  confidence: number;
  reason: string;
  session: "pre_market" | "regular" | "after_hours";
  reducedReliability?: boolean;
}

export interface OpeningRange {
  high: number;
  low: number;
  startTime: number;
  endTime: number;
  complete: boolean;
}

export interface StrategyConfig {
  openingRangeMinutes: number;
  minRelativeVolume: number;
  rsiMin: number;
  rsiMax: number;
  tp1Multiplier: number;
  tp2Multiplier: number;
  gapThresholdPercent: number;
}

export const DEFAULT_STRATEGY_CONFIG: StrategyConfig = {
  openingRangeMinutes: 15,
  minRelativeVolume: 1.5,
  rsiMin: 40,
  rsiMax: 70,
  tp1Multiplier: 1.5,
  tp2Multiplier: 2.5,
  gapThresholdPercent: 2,
};

export interface StrategyState {
  ticker: string;
  openingRange: OpeningRange | null;
  vwap: number;
  rsi: number;
  relativeVolume: number;
  gapPercent: number;
  activeSignal: StrategySignal | null;
  inTrade: boolean;
  tradeDirection: "long" | "short" | null;
  entryPrice: number | null;
  stopLoss: number | null;
  takeProfit1: number | null;
  takeProfit2: number | null;
}
