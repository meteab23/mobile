import { Watchlist } from "@/components/Watchlist";
import { TradingChart } from "@/components/TradingChart";
import { KeyStats } from "@/components/KeyStats";
import { SignalPanel } from "@/components/SignalPanel";
import { AIAnalysis } from "@/components/AIAnalysis";

export default async function TickerPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const ticker = symbol.toUpperCase();

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <aside className="hidden w-48 shrink-0 md:block lg:w-56">
        <Watchlist activeTicker={ticker} />
      </aside>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex-1 overflow-y-auto">
          <TradingChart ticker={ticker} />
          <KeyStats ticker={ticker} />
          <AIAnalysis ticker={ticker} />
        </div>

        <aside className="w-full shrink-0 lg:w-72 xl:w-80">
          <SignalPanel ticker={ticker} />
        </aside>
      </div>
    </div>
  );
}
