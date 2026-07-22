export interface MoveAnalysis {
  moveSummary: {
    direction: "bullish" | "bearish" | "neutral";
    magnitude: string;
    summary: string;
    forecast?: string;
  };
  primaryDrivers: Array<{
    driver: string;
    detail: string;
    source?: string;
  }>;
  fundamentalsSnapshot: {
    revenueTrend?: string;
    margins?: string;
    valuation?: string;
    notes?: string;
  };
  technicalRead: {
    vwapPosition: string;
    orbStatus: string;
    rsi: number;
    strategyAlignment: string;
    supportResistance?: string;
    candlePattern?: string;
    directionForecast?: string;
    compositeScore?: number;
  };
  tradePlan?: {
    action: string;
    entry: number;
    stopLoss: number;
    takeProfit1: number;
    takeProfit2: number;
    riskReward: string;
  };
  risksAndCaveats: string[];
  sources: Array<{ title: string; url: string }>;
}

export interface AnalysisInput {
  ticker: string;
  price: number;
  changePercent: number;
  gapPercent: number;
  relativeVolume: number;
  vwap: number;
  rsi: number;
  session: string;
  openingRange?: { high: number; low: number; complete: boolean } | null;
  news: Array<{
    title: string;
    url: string;
    publishedUtc: string;
    sentiment?: string;
    sentimentReasoning?: string;
  }>;
  financials: Array<{
    period: string;
    revenue?: number;
    netIncome?: number;
  }>;
  tickerDetails: {
    name: string;
    marketCap?: number;
    description?: string;
    sicDescription?: string;
  };
  dayStrategy?: {
    action: string;
    direction: string;
    compositeScore: number;
    summary: string;
    nearestSupport?: number;
    nearestResistance?: number;
    candlePattern?: string;
    strategyScores?: Array<{ name: string; score: number; bias: string; detail: string }>;
    evenRisk?: {
      entry: number;
      stopLoss: number;
      takeProfit1: number;
      takeProfit2: number;
    };
  };
}

export type AIProvider = "openai" | "anthropic";
