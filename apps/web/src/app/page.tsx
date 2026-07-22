import Link from "next/link";
import { Watchlist } from "@/components/Watchlist";
import { Scanner } from "@/components/Scanner";
import { SignalHistory } from "@/components/SignalHistory";

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <aside className="hidden w-48 shrink-0 md:block lg:w-56">
        <Watchlist />
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-100">DayTrader Pro</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Opening Range Breakout + VWAP strategy with live US market data and AI analysis
          </p>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <Scanner />
          <SignalHistory />
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Quick Start
            </h2>
            <ol className="list-decimal space-y-2 pl-4 text-sm text-zinc-400">
              <li>Add your <code className="text-emerald-400">POLYGON_API_KEY</code> to <code className="text-zinc-300">.env</code></li>
              <li>Start the WebSocket server: <code className="text-zinc-300">npm run dev -w @daytrading/ws-server</code></li>
              <li>Select a ticker from watchlist or scanner</li>
              <li>Watch for ORB breakout signals with TP/SL levels</li>
              <li>Use AI Analysis to understand why a stock moved</li>
            </ol>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Popular Tickers
          </h2>
          <div className="flex flex-wrap gap-2">
            {["AAPL", "TSLA", "NVDA", "MSFT", "AMD", "META", "GOOGL", "AMZN", "SPY", "QQQ"].map(
              (t) => (
                <Link
                  key={t}
                  href={`/ticker/${t}`}
                  className="rounded bg-zinc-800 px-3 py-1.5 font-mono text-sm text-zinc-300 hover:bg-emerald-600 hover:text-white"
                >
                  {t}
                </Link>
              )
            )}
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
          <h2 className="mb-2 text-sm font-semibold text-zinc-400">Strategy: ORB + VWAP</h2>
          <p className="text-sm text-zinc-500">
            Trades opening range breakouts (first 15 min) confirmed by VWAP position, relative
            volume (&gt;1.5x), and RSI filter (40–70). Stop loss at opposite OR boundary. Take
            profit at 1.5R and 2.5R.
          </p>
        </div>
      </main>
    </div>
  );
}
