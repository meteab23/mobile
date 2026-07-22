"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type LineData,
} from "lightweight-charts";

interface Bar {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

interface TradingChartProps {
  ticker: string;
  multiplier?: number;
}

export function TradingChart({ ticker, multiplier = 1 }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const vwapSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const [timeframe, setTimeframe] = useState(multiplier);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#09090b" },
        textColor: "#a1a1aa",
      },
      grid: {
        vertLines: { color: "#27272a" },
        horzLines: { color: "#27272a" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: "#27272a" },
      timeScale: { borderColor: "#27272a", timeVisible: true },
      width: containerRef.current.clientWidth,
      height: 400,
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    const vwapSeries = chart.addLineSeries({
      color: "#f59e0b",
      lineWidth: 2,
      title: "VWAP",
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    vwapSeriesRef.current = vwapSeries;

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    const loadBars = async () => {
      const res = await fetch(
        `/api/ticker/${ticker}/bars?multiplier=${timeframe}&timespan=${timeframe >= 5 ? "minute" : "minute"}`
      );
      const data = await res.json();
      const bars: Bar[] = data.bars ?? [];
      updateChart(bars);
    };
    loadBars();
    const interval = setInterval(loadBars, 30_000);
    return () => clearInterval(interval);
  }, [ticker, timeframe]);

  const updateChart = (bars: Bar[]) => {
    if (!candleSeriesRef.current || !vwapSeriesRef.current) return;

    const candles: CandlestickData[] = bars.map((b) => ({
      time: Math.floor(b.t / 1000) as CandlestickData["time"],
      open: b.o,
      high: b.h,
      low: b.l,
      close: b.c,
    }));

    candleSeriesRef.current.setData(candles);

    let cumVolPrice = 0;
    let cumVol = 0;
    const vwapData: LineData[] = bars.map((b) => {
      const typical = (b.h + b.l + b.c) / 3;
      cumVolPrice += typical * b.v;
      cumVol += b.v;
      return {
        time: Math.floor(b.t / 1000) as LineData["time"],
        value: cumVol > 0 ? cumVolPrice / cumVol : typical,
      };
    });
    vwapSeriesRef.current.setData(vwapData);
    chartRef.current?.timeScale().fitContent();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
        <span className="font-mono text-lg font-bold text-zinc-100">{ticker}</span>
        <div className="ml-auto flex gap-1">
          {[1, 5].map((m) => (
            <button
              key={m}
              onClick={() => setTimeframe(m)}
              className={`rounded px-2 py-0.5 text-xs ${
                timeframe === m
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {m}m
            </button>
          ))}
        </div>
      </div>
      <div className="px-2 py-1 text-xs text-zinc-600">
        <span className="mr-3 inline-block h-2 w-4 bg-amber-500/30" /> Pre-market
        <span className="mx-3 inline-block h-2 w-4 bg-emerald-500/30" /> Regular
        <span className="mx-3 inline-block h-2 w-4 bg-purple-500/30" /> After-hours
      </div>
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
