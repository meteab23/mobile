import type { AIProvider, AnalysisInput, MoveAnalysis } from "./types.js";

const SYSTEM_PROMPT = `You are an expert day trading analyst for an educational app.
Use ONLY the data provided. Synthesize technical analysis (S/R, candlesticks, ORB+VWAP, EMA, volume) with fundamentals and news.
Give CLEAR, ACTIONABLE entry and exit levels for an intraday scalp trade (2-5% target).
Return valid JSON:
{
  "moveSummary": { "direction": "bullish"|"bearish"|"neutral", "magnitude": string, "summary": string, "forecast": string },
  "primaryDrivers": [{ "driver": string, "detail": string, "source": string|null }],
  "fundamentalsSnapshot": { "revenueTrend": string|null, "margins": string|null, "valuation": string|null, "notes": string|null },
  "technicalRead": {
    "vwapPosition": string, "orbStatus": string, "rsi": number, "strategyAlignment": string,
    "supportResistance": string, "candlePattern": string, "directionForecast": string, "compositeScore": number
  },
  "tradePlan": {
    "action": "ENTER LONG"|"ENTER SHORT"|"WAIT"|"AVOID",
    "entry": number, "stopLoss": number, "takeProfit1": number, "takeProfit2": number, "riskReward": string
  },
  "risksAndCaveats": [string],
  "sources": [{ "title": string, "url": string }]
}
tradePlan must include exact dollar prices for entry, stopLoss (exit if wrong), takeProfit1 (primary target), takeProfit2 (extended target).
Use dayStrategy.evenRisk levels when provided. Educational only, not financial advice.`;

function buildUserPrompt(input: AnalysisInput): string {
  return JSON.stringify(
    {
      ticker: input.ticker,
      company: input.tickerDetails.name,
      sector: input.tickerDetails.sicDescription,
      marketCap: input.tickerDetails.marketCap,
      price: input.price,
      changePercent: input.changePercent,
      gapPercent: input.gapPercent,
      relativeVolume: input.relativeVolume,
      session: input.session,
      technicals: {
        vwap: input.vwap,
        rsi: input.rsi,
        priceVsVwap: input.price > input.vwap ? "above" : "below",
        openingRange: input.openingRange,
      },
      dayStrategy: input.dayStrategy,
      news: input.news.slice(0, 8),
      financials: input.financials.slice(0, 4),
    },
    null,
    2
  );
}

async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0]?.message?.content ?? "{}";
}

async function callAnthropic(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    content: Array<{ type: string; text: string }>;
  };
  const text = data.content.find((c) => c.type === "text")?.text ?? "{}";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch?.[0] ?? text;
}

function fallbackAnalysis(input: AnalysisInput): MoveAnalysis {
  const ds = input.dayStrategy;
  const direction =
    ds?.direction === "up"
      ? "bullish"
      : ds?.direction === "down"
        ? "bearish"
        : input.changePercent > 0.5
          ? "bullish"
          : input.changePercent < -0.5
            ? "bearish"
            : "neutral";

  return {
    moveSummary: {
      direction,
      magnitude: `${input.changePercent >= 0 ? "+" : ""}${input.changePercent.toFixed(2)}%`,
      summary: ds?.summary ?? `${input.ticker} technical and fundamental snapshot.`,
      forecast:
        ds?.direction === "up"
          ? `Bias toward resistance $${ds.nearestResistance?.toFixed(2) ?? "N/A"}`
          : ds?.direction === "down"
            ? `Risk toward support $${ds.nearestSupport?.toFixed(2) ?? "N/A"}`
            : "Sideways until S/R break",
    },
    primaryDrivers: input.news.slice(0, 3).map((n) => ({
      driver: n.sentiment ?? "news",
      detail: n.title,
      source: n.url,
    })),
    fundamentalsSnapshot: {
      revenueTrend: input.financials[0]?.revenue
        ? `Latest revenue: $${(input.financials[0].revenue / 1e9).toFixed(2)}B`
        : "Financial data unavailable",
      notes: input.tickerDetails.description?.slice(0, 200),
    },
    technicalRead: {
      vwapPosition: input.price > input.vwap ? "Above VWAP (bullish bias)" : "Below VWAP (bearish bias)",
      orbStatus: input.openingRange?.complete
        ? `OR High: ${input.openingRange.high.toFixed(2)}, Low: ${input.openingRange.low.toFixed(2)}`
        : "Opening range forming",
      rsi: input.rsi,
      strategyAlignment: ds?.summary ?? "Multi-strategy analysis available",
      supportResistance: ds
        ? `Support $${ds.nearestSupport?.toFixed(2)} / Resistance $${ds.nearestResistance?.toFixed(2)}`
        : undefined,
      candlePattern: ds?.candlePattern ?? "none",
      directionForecast: ds?.direction ?? "sideways",
      compositeScore: ds?.compositeScore,
    },
    tradePlan: ds?.evenRisk
      ? {
          action: ds.action,
          entry: ds.evenRisk.entry,
          stopLoss: ds.evenRisk.stopLoss,
          takeProfit1: ds.evenRisk.takeProfit1,
          takeProfit2: ds.evenRisk.takeProfit2,
          riskReward: "1:1 and 1:2 even risk",
        }
      : undefined,
    risksAndCaveats: [
      "Educational analysis only — not financial advice.",
      input.session !== "regular" ? "Extended hours — wider spreads." : "Regular session.",
    ],
    sources: input.news.map((n) => ({ title: n.title, url: n.url })),
  };
}

export async function analyzeMove(
  input: AnalysisInput,
  provider: AIProvider = "openai"
): Promise<MoveAnalysis> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  const hasKey =
    (provider === "openai" && openaiKey) ||
    (provider === "anthropic" && anthropicKey);

  if (!hasKey) {
    return fallbackAnalysis(input);
  }

  const prompt = buildUserPrompt(input);

  try {
    const raw =
      provider === "anthropic" && anthropicKey
        ? await callAnthropic(prompt, anthropicKey)
        : await callOpenAI(prompt, openaiKey!);

    const parsed = JSON.parse(raw) as MoveAnalysis;
    parsed.sources = [
      ...input.news.map((n) => ({ title: n.title, url: n.url })),
      ...(parsed.sources ?? []),
    ];
    return parsed;
  } catch {
    return fallbackAnalysis(input);
  }
}

export type { AnalysisInput, MoveAnalysis, AIProvider };
