"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, type IChartApi, type ISeriesApi } from "lightweight-charts";

interface Bar {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

export function DailyChart({ bars }: { bars: Bar[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, {
      layout: { background: { type: ColorType.Solid, color: "#18181b" }, textColor: "#a1a1aa" },
      grid: { vertLines: { color: "#27272a" }, horzLines: { color: "#27272a" } },
      width: ref.current.clientWidth,
      height: 280,
    });
    const series = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });
    chartRef.current = chart;
    seriesRef.current = series;

    const ro = new ResizeObserver(() => {
      if (ref.current) chart.applyOptions({ width: ref.current.clientWidth });
    });
    ro.observe(ref.current);

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || bars.length === 0) return;
    seriesRef.current.setData(
      bars.map((b) => ({
        time: Math.floor(b.t / 1000) as never,
        open: b.o,
        high: b.h,
        low: b.l,
        close: b.c,
      }))
    );
    chartRef.current?.timeScale().fitContent();
  }, [bars]);

  if (bars.length === 0) {
    return <div className="flex h-[280px] items-center justify-center text-sm text-zinc-600">No chart data</div>;
  }

  return <div ref={ref} className="w-full rounded-lg overflow-hidden" />;
}
