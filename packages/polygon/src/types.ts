export type DataMode = "realtime" | "delayed";

export interface MarketStatus {
  market: string;
  serverTime: string;
  exchanges: {
    nasdaq: string;
    nyse: string;
    otc: string;
  };
  currencies: {
    crypto: string;
    fx: string;
  };
  earlyHours: boolean;
  afterHours: boolean;
}

export type MarketSession = "pre_market" | "regular" | "after_hours" | "closed";

export interface AggregateBar {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  vw?: number;
  n?: number;
}

export interface TickerSnapshot {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  dayOpen: number;
  dayHigh: number;
  dayLow: number;
  dayClose: number;
  dayVolume: number;
  prevClose: number;
  preMarket?: { price: number; change: number; changePercent: number };
  afterHours?: { price: number; change: number; changePercent: number };
}

export interface TickerDetails {
  ticker: string;
  name: string;
  marketCap?: number;
  shareClassSharesOutstanding?: number;
  weightedSharesOutstanding?: number;
  description?: string;
  sicDescription?: string;
  homepageUrl?: string;
  totalEmployees?: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  author?: string;
  publishedUtc: string;
  articleUrl: string;
  description?: string;
  tickers: string[];
  publisher?: { name: string; homepageUrl?: string };
  insights?: Array<{
    ticker: string;
    sentiment: string;
    sentimentReasoning?: string;
  }>;
}

export interface FinancialsResult {
  ticker: string;
  period: string;
  fiscalPeriod?: string;
  fiscalYear?: number;
  revenue?: number;
  netIncome?: number;
  grossProfit?: number;
  operatingIncome?: number;
}

export interface TickerSearchResult {
  ticker: string;
  name: string;
  market: string;
  type: string;
}

export interface GainerLoser {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}
