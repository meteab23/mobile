import { restClient } from "@polygon.io/client-js";
import type {
  AggregateBar,
  DataMode,
  FinancialsResult,
  GainerLoser,
  MarketSession,
  MarketStatus,
  NewsArticle,
  TickerDetails,
  TickerSearchResult,
  TickerSnapshot,
} from "./types.js";

export class PolygonClient {
  private client: ReturnType<typeof restClient>;
  private apiKey: string;
  private dataMode: DataMode;

  constructor(apiKey: string, dataMode: DataMode = "realtime") {
    this.apiKey = apiKey;
    this.dataMode = dataMode;
    this.client = restClient(apiKey);
  }

  getDataMode(): DataMode {
    return this.dataMode;
  }

  async getMarketStatus(): Promise<MarketStatus & { session: MarketSession }> {
    const res = await this.client.reference.marketStatus();
    const status = res as unknown as MarketStatus;
    return { ...status, session: this.resolveSession(status) };
  }

  resolveSession(status: MarketStatus): MarketSession {
    if (status.earlyHours) return "pre_market";
    if (status.afterHours) return "after_hours";
    const nasdaq = status.exchanges?.nasdaq ?? "closed";
    const nyse = status.exchanges?.nyse ?? "closed";
    if (nasdaq === "open" || nyse === "open") return "regular";
    return "closed";
  }

  async getAggregates(
    ticker: string,
    multiplier: number,
    timespan: "minute" | "hour" | "day",
    from: string,
    to: string,
    limit = 50000
  ): Promise<AggregateBar[]> {
    const res = await this.client.stocks.aggregates(
      ticker,
      multiplier,
      timespan,
      from,
      to,
      { adjusted: "true", sort: "asc", limit }
    );
    const results = res.results ?? [];
    return results.map((b) => ({
      t: b.t ?? 0,
      o: b.o ?? 0,
      h: b.h ?? 0,
      l: b.l ?? 0,
      c: b.c ?? 0,
      v: b.v ?? 0,
      vw: b.vw,
      n: b.n,
    }));
  }

  async getTodayAggregates(
    ticker: string,
    multiplier: number,
    timespan: "minute" | "hour" = "minute"
  ): Promise<AggregateBar[]> {
    const now = new Date();
    const from = this.formatDate(now);
    const to = from;
    return this.getAggregates(ticker, multiplier, timespan, from, to);
  }

  async getPreviousClose(ticker: string): Promise<number> {
    const res = await this.client.stocks.previousClose(ticker, {
      adjusted: "true",
    });
    return res.results?.[0]?.c ?? 0;
  }

  async getSnapshot(ticker: string): Promise<TickerSnapshot> {
    const res = await this.client.stocks.snapshotTicker(ticker);
    const data = res as {
      ticker?: string;
      day?: { o: number; h: number; l: number; c: number; v: number };
      prevDay?: { c: number };
      min?: { c: number; v: number };
      todaysChange?: number;
      todaysChangePerc?: number;
      lastTrade?: { p: number };
    };

    const price =
      data.lastTrade?.p ?? data.min?.c ?? data.day?.c ?? data.prevDay?.c ?? 0;
    const prevClose = data.prevDay?.c ?? 0;
    const change = data.todaysChange ?? price - prevClose;
    const changePercent =
      data.todaysChangePerc ??
      (prevClose ? ((price - prevClose) / prevClose) * 100 : 0);

    return {
      ticker: data.ticker ?? ticker,
      price,
      change,
      changePercent,
      dayOpen: data.day?.o ?? 0,
      dayHigh: data.day?.h ?? 0,
      dayLow: data.day?.l ?? 0,
      dayClose: data.day?.c ?? price,
      dayVolume: data.day?.v ?? 0,
      prevClose,
    };
  }

  async getTickerDetails(ticker: string): Promise<TickerDetails> {
    const res = await this.client.reference.tickerDetails(ticker);
    const r = (res as { results?: Record<string, unknown> }).results ?? {};
    return {
      ticker: (r.ticker as string) ?? ticker,
      name: (r.name as string) ?? ticker,
      marketCap: r.market_cap as number | undefined,
      shareClassSharesOutstanding: r.share_class_shares_outstanding as
        | number
        | undefined,
      weightedSharesOutstanding: r.weighted_shares_outstanding as
        | number
        | undefined,
      description: r.description as string | undefined,
      sicDescription: r.sic_description as string | undefined,
      homepageUrl: r.homepage_url as string | undefined,
      totalEmployees: r.total_employees as number | undefined,
    };
  }

  async searchTickers(query: string, limit = 10): Promise<TickerSearchResult[]> {
    const res = await this.client.reference.tickers({
      search: query,
      active: "true",
      market: "stocks",
      limit,
    });
    const results = res.results ?? [];
    return results.map((r) => ({
      ticker: r.ticker,
      name: r.name,
      market: r.market,
      type: r.type,
    }));
  }

  async getNews(ticker: string, limit = 10): Promise<NewsArticle[]> {
    const res = await this.client.reference.tickerNews({
      ticker,
      limit,
      order: "desc",
      sort: "published_utc",
    });
    const results = res.results ?? [];
    return results.map((a) => ({
      id: a.id ?? "",
      title: a.title ?? "",
      author: a.author,
      publishedUtc: a.published_utc ?? "",
      articleUrl: a.article_url ?? "",
      description: a.description,
      tickers: a.tickers ?? [],
      publisher: a.publisher as NewsArticle["publisher"],
      insights: (a as { insights?: NewsArticle["insights"] }).insights,
    }));
  }

  async getFinancials(ticker: string, limit = 4): Promise<FinancialsResult[]> {
    const url = new URL("https://api.polygon.io/vX/reference/financials");
    url.searchParams.set("ticker", ticker);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("sort", "filing_date");
    url.searchParams.set("order", "desc");
    url.searchParams.set("apiKey", this.apiKey);

    const res = await fetch(url.toString());
    if (!res.ok) return [];
    const data = (await res.json()) as {
      results?: Array<{
        ticker: string;
        financials?: {
          income_statement?: {
            revenues?: { value?: number };
            net_income_loss?: { value?: number };
            gross_profit?: { value?: number };
            operating_income_loss?: { value?: number };
          };
        };
        fiscal_period?: string;
        fiscal_year?: number;
        timeframe?: string;
      }>;
    };

    return (data.results ?? []).map((r) => {
      const income = r.financials?.income_statement;
      return {
        ticker: r.ticker,
        period: r.timeframe ?? "unknown",
        fiscalPeriod: r.fiscal_period,
        fiscalYear: r.fiscal_year,
        revenue: income?.revenues?.value,
        netIncome: income?.net_income_loss?.value,
        grossProfit: income?.gross_profit?.value,
        operatingIncome: income?.operating_income_loss?.value,
      };
    });
  }

  async getAverageVolume(ticker: string, days = 20): Promise<number> {
    const to = this.formatDate(new Date());
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days - 5);
    const from = this.formatDate(fromDate);

    const bars = await this.getAggregates(ticker, 1, "day", from, to, days + 10);
    const recent = bars.slice(-days);
    if (recent.length === 0) return 0;
    return recent.reduce((sum, b) => sum + b.v, 0) / recent.length;
  }

  async getGainers(limit = 20): Promise<GainerLoser[]> {
    const res = await this.client.stocks.snapshotGainersLosers("gainers");
    return this.parseSnapshotTickers(res as unknown as { tickers?: GainerLoserRaw[] }, limit);
  }

  async getLosers(limit = 20): Promise<GainerLoser[]> {
    const res = await this.client.stocks.snapshotGainersLosers("losers");
    return this.parseSnapshotTickers(res as unknown as { tickers?: GainerLoserRaw[] }, limit);
  }

  private parseSnapshotTickers(
    res: { tickers?: GainerLoserRaw[] },
    limit: number
  ): GainerLoser[] {
    const tickers = res.tickers ?? [];
    return tickers.slice(0, limit).map((t) => ({
      ticker: t.ticker,
      price: t.day?.c ?? 0,
      change: t.todaysChange ?? 0,
      changePercent: t.todaysChangePerc ?? 0,
      volume: t.day?.v ?? 0,
    }));
  }

  getWebSocketUrl(): string {
    return this.dataMode === "delayed"
      ? "wss://delayed.polygon.io/stocks"
      : "wss://socket.polygon.io/stocks";
  }

  private formatDate(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  static getSessionLabel(session: MarketSession): string {
    const labels: Record<MarketSession, string> = {
      pre_market: "Pre-Market",
      regular: "Regular Hours",
      after_hours: "After-Hours",
      closed: "Market Closed",
    };
    return labels[session];
  }
}

export function createPolygonClient(
  apiKey?: string,
  dataMode?: DataMode
): PolygonClient {
  const key = apiKey ?? process.env.POLYGON_API_KEY ?? "";
  const mode =
    dataMode ??
    (process.env.POLYGON_DATA_MODE as DataMode | undefined) ??
    "realtime";
  if (!key) {
    throw new Error("POLYGON_API_KEY is required");
  }
  return new PolygonClient(key, mode);
}

export type { DataMode, MarketSession, MarketStatus };

interface GainerLoserRaw {
  ticker: string;
  day?: { c: number; v: number };
  todaysChange?: number;
  todaysChangePerc?: number;
}
