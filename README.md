# DayTrader Pro

A modern day trading web app for US stocks powered by [Polygon.io](https://polygon.io) market data. Features live pre-market, regular, and after-hours data, **Opening Range Breakout (ORB) + VWAP** strategy signals with entry/TP/SL levels, and AI-powered market analysis.

> **Disclaimer:** For educational purposes only. Not financial advice. Day trading involves substantial risk of loss.

## Features

- **Live market sessions** — Pre-market (4:00–9:30 AM ET), regular hours, after-hours (4:00–8:00 PM ET)
- **ORB + VWAP strategy** — Transparent buy/sell signals with stop loss and take profit levels
- **Real-time WebSocket** — Minute aggregates and trades via Polygon WebSocket proxy
- **Key stats** — Gap %, relative volume, VWAP, RSI, pre-market high/low, market cap, float
- **AI analysis** — Why a stock moved (news, fundamentals, technicals) via OpenAI or Anthropic
- **Top movers scanner** — Gainers and losers with volume filters
- **Watchlist** — Persisted in SQLite
- **Signal history** — Logged entry/exit signals with browser notifications

## Stack

- **Next.js 15** — Web UI + REST API
- **WebSocket server** — Polygon live data bridge
- **lightweight-charts** — TradingView-style candlestick charts
- **Drizzle ORM + SQLite** — Watchlist & signal history
- **Turborepo** — Monorepo with shared packages

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and add your POLYGON_API_KEY
```

Get a Polygon API key at [polygon.io](https://polygon.io). For real-time day trading signals, a paid plan with WebSocket access is required. Use `POLYGON_DATA_MODE=delayed` for Starter tier (15-min delay).

### 3. Build packages

```bash
npm run build
```

### 4. Start development servers

In separate terminals:

```bash
# Web app (port 3000)
npm run dev -w @daytrading/web

# WebSocket server (port 3001)
npm run dev -w @daytrading/ws-server
```

Or run both via Turborepo:

```bash
npm run dev
```

### 5. Open the app

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── apps/
│   ├── web/              # Next.js dashboard
│   └── ws-server/        # Polygon WebSocket proxy + signal engine
├── packages/
│   ├── polygon/          # Polygon REST client
│   ├── strategy/         # ORB + VWAP indicators & signals
│   └── ai/               # LLM market analysis
└── .env.example
```

## Strategy: ORB + VWAP

| Parameter | Default |
|-----------|---------|
| Opening range | First 15 minutes (9:30–9:45 AM ET) |
| Min relative volume | 1.5× 20-day average |
| Trend filter | Long above VWAP, short below |
| RSI filter | 40–70 for long entries |
| Stop loss | Opposite OR boundary |
| Take profit | TP1 at 1.5R, TP2 at 2.5R |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `POLYGON_API_KEY` | Polygon.io API key (required) |
| `POLYGON_DATA_MODE` | `realtime` or `delayed` |
| `AI_PROVIDER` | `openai` or `anthropic` |
| `OPENAI_API_KEY` | OpenAI API key for AI analysis |
| `ANTHROPIC_API_KEY` | Anthropic API key (alternative) |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL (default `ws://localhost:3001`) |

## License

MIT
