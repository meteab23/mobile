import { WebSocketServer, WebSocket } from "ws";
import { createPolygonClient } from "@daytrading/polygon";
import {
  OrbVwapStrategy,
  barsToCandles,
  type StrategySignal,
} from "@daytrading/strategy";

const PORT = Number(process.env.WS_PORT ?? 3001);
const apiKey = process.env.POLYGON_API_KEY ?? "";

interface ClientMessage {
  action: "subscribe" | "unsubscribe";
  tickers: string[];
}

interface ServerMessage {
  type: "status" | "aggregate" | "trade" | "signal" | "error";
  data: unknown;
}

const subscribedTickers = new Set<string>();
const clientSubscriptions = new Map<WebSocket, Set<string>>();
const strategies = new Map<string, OrbVwapStrategy>();
const candleBuffers = new Map<string, Array<{ t: number; o: number; h: number; l: number; c: number; v: number }>>();
const avgVolumeCache = new Map<string, number>();
const prevCloseCache = new Map<string, number>();

let polygonWs: WebSocket | null = null;
let polygonConnected = false;

function getStrategy(ticker: string): OrbVwapStrategy {
  const key = ticker.toUpperCase();
  if (!strategies.has(key)) {
    strategies.set(key, new OrbVwapStrategy());
  }
  return strategies.get(key)!;
}

function broadcast(message: ServerMessage, ticker?: string): void {
  const payload = JSON.stringify(message);
  for (const [client, subs] of clientSubscriptions) {
    if (client.readyState !== WebSocket.OPEN) continue;
    if (!ticker || subs.has(ticker.toUpperCase()) || subs.has("*")) {
      client.send(payload);
    }
  }
}

async function ensureTickerMeta(ticker: string): Promise<void> {
  const key = ticker.toUpperCase();
  if (!avgVolumeCache.has(key) || !prevCloseCache.has(key)) {
    try {
      const client = createPolygonClient(apiKey);
      const [avgVol, prevClose] = await Promise.all([
        client.getAverageVolume(key),
        client.getPreviousClose(key),
      ]);
      avgVolumeCache.set(key, avgVol);
      prevCloseCache.set(key, prevClose);
    } catch {
      avgVolumeCache.set(key, 1_000_000);
      prevCloseCache.set(key, 0);
    }
  }
}

async function evaluateAndBroadcast(ticker: string): Promise<void> {
  const key = ticker.toUpperCase();
  const bars = candleBuffers.get(key) ?? [];
  if (bars.length === 0) return;

  const strategy = getStrategy(key);
  const candles = barsToCandles(bars);
  const signal = strategy.evaluate(
    key,
    candles,
    prevCloseCache.get(key) ?? 0,
    avgVolumeCache.get(key) ?? 1_000_000
  );

  if (signal) {
    broadcast({ type: "signal", data: signal }, key);
  }
}

function connectPolygon(): void {
  if (!apiKey) {
    console.warn("POLYGON_API_KEY not set — WS server running in demo mode");
    return;
  }

  const client = createPolygonClient(apiKey);
  const url = client.getWebSocketUrl();
  polygonWs = new WebSocket(url);

  polygonWs.on("open", () => {
    polygonConnected = true;
    polygonWs?.send(JSON.stringify({ action: "auth", params: apiKey }));
    broadcast({ type: "status", data: { connected: true, mode: client.getDataMode() } });
    resubscribePolygon();
  });

  polygonWs.on("message", (raw) => {
    const messages = JSON.parse(raw.toString()) as Array<Record<string, unknown>>;
    for (const msg of messages) {
      handlePolygonMessage(msg);
    }
  });

  polygonWs.on("close", () => {
    polygonConnected = false;
    broadcast({ type: "status", data: { connected: false } });
    setTimeout(connectPolygon, 5000);
  });

  polygonWs.on("error", (err) => {
    console.error("Polygon WS error:", err.message);
  });
}

function resubscribePolygon(): void {
  if (!polygonWs || polygonWs.readyState !== WebSocket.OPEN) return;
  if (subscribedTickers.size === 0) return;

  const tickers = [...subscribedTickers];
  polygonWs.send(
    JSON.stringify({
      action: "subscribe",
      params: tickers.flatMap((t) => [`AM.${t}`, `T.${t}`]),
    })
  );
}

function handlePolygonMessage(msg: Record<string, unknown>): void {
  if (msg.ev === "status") {
    broadcast({ type: "status", data: msg });
    return;
  }

  if (msg.ev === "AM") {
    const ticker = (msg.sym as string)?.toUpperCase();
    if (!ticker) return;

    const bar = {
      t: msg.s as number,
      o: msg.o as number,
      h: msg.h as number,
      l: msg.l as number,
      c: msg.c as number,
      v: msg.v as number,
    };

    const buffer = candleBuffers.get(ticker) ?? [];
    const existing = buffer.findIndex((b) => b.t === bar.t);
    if (existing >= 0) buffer[existing] = bar;
    else buffer.push(bar);
    if (buffer.length > 500) buffer.shift();
    candleBuffers.set(ticker, buffer);

    broadcast({ type: "aggregate", data: { ticker, bar } }, ticker);
    void evaluateAndBroadcast(ticker);
    return;
  }

  if (msg.ev === "T") {
    const ticker = (msg.sym as string)?.toUpperCase();
    if (!ticker) return;
    broadcast(
      {
        type: "trade",
        data: {
          ticker,
          price: msg.p,
          size: msg.s,
          timestamp: msg.t,
        },
      },
      ticker
    );
  }
}

async function loadHistoricalBars(ticker: string): Promise<void> {
  if (!apiKey) return;
  try {
    const client = createPolygonClient(apiKey);
    await ensureTickerMeta(ticker);
    const bars = await client.getTodayAggregates(ticker, 1, "minute");
    candleBuffers.set(ticker.toUpperCase(), bars);
    await evaluateAndBroadcast(ticker);
  } catch (err) {
    console.error(`Failed to load bars for ${ticker}:`, err);
  }
}

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  clientSubscriptions.set(ws, new Set());
  ws.send(
    JSON.stringify({
      type: "status",
      data: { connected: polygonConnected, server: "daytrading-ws" },
    })
  );

  ws.on("message", async (raw) => {
    try {
      const msg = JSON.parse(raw.toString()) as ClientMessage;

      if (msg.action === "subscribe") {
        const subs = clientSubscriptions.get(ws)!;
        for (const t of msg.tickers) {
          const ticker = t.toUpperCase();
          subs.add(ticker);
          subscribedTickers.add(ticker);
          await loadHistoricalBars(ticker);
        }
        resubscribePolygon();
      }

      if (msg.action === "unsubscribe") {
        const subs = clientSubscriptions.get(ws)!;
        for (const t of msg.tickers) {
          subs.delete(t.toUpperCase());
        }
      }
    } catch {
      ws.send(JSON.stringify({ type: "error", data: { message: "Invalid message" } }));
    }
  });

  ws.on("close", () => {
    clientSubscriptions.delete(ws);
  });
});

connectPolygon();
console.log(`WebSocket server listening on ws://localhost:${PORT}`);

export type { StrategySignal, ServerMessage };
