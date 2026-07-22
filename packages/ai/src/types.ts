export interface MoveAnalysis {
  moveSummary: {
    direction: "bullish" | "bearish" | "neutral";
    magnitude: string;
    summary: string;
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
}

export type AIProvider = "openai" | "anthropic";
