"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HOLDINGS, NET_WORTH_HISTORY, computeTotals } from "@/lib/demo-data";
import { formatAED, formatPct } from "@/lib/format";
import { ChatView } from "./ChatView";
import { TrendingDown, TrendingUp } from "lucide-react";

const ALLOCATION_COLORS = [
  "#1A5F7A",
  "#2D6A4F",
  "#40916C",
  "#BC6C25",
  "#6B705C",
  "#52796F",
  "#A3B18A",
];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-lift">
      <div className="text-[11px] text-ink-400">{label}</div>
      <div className="font-mono text-sm font-medium text-ink-800">
        {formatAED(payload[0].value)}
      </div>
    </div>
  );
}

export function PortfolioView() {
  const totals = computeTotals();
  const latest = NET_WORTH_HISTORY[NET_WORTH_HISTORY.length - 1];
  const prev = NET_WORTH_HISTORY[NET_WORTH_HISTORY.length - 2];
  const changePct =
    prev && prev.netWorth
      ? ((latest.netWorth - prev.netWorth) / prev.netWorth) * 100
      : 0;
  const up = changePct >= 0;

  const pieData = HOLDINGS.map((h) => ({
    name: h.symbol,
    value: h.value,
    full: h.name,
  }));

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <div className="scrollbar-thin flex-1 overflow-y-auto border-b border-[var(--border)] p-4 sm:p-6 lg:border-b-0 lg:border-r">
        <div className="animate-fade-up mx-auto max-w-3xl">
          <div className="mb-1 text-sm font-medium text-ink-400">
            Portfolio · Household
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <h1 className="font-display text-4xl font-medium tracking-tight text-ink-900">
              {formatAED(totals.netWorth)}
            </h1>
            <span
              className={`mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                up
                  ? "bg-gulf-50 text-gulf-700"
                  : "bg-clay-400/15 text-clay-600"
              }`}
            >
              {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {formatPct(changePct)} MoM
            </span>
          </div>
          <p className="mt-2 text-sm text-ink-500">
            Assets {formatAED(totals.assets)} · Liabilities{" "}
            {formatAED(totals.liabilities)}
          </p>

          <div className="mt-6 h-64 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-soft sm:h-72">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
              Net worth over time
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={NET_WORTH_HISTORY}>
                <defs>
                  <linearGradient id="nwFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2D6A4F" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2D6A4F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(18,23,18,0.06)"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString("en-AE", {
                      month: "short",
                      year: "2-digit",
                    })
                  }
                  tick={{ fontSize: 11, fill: "#9AA19A" }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={40}
                />
                <YAxis
                  tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`}
                  tick={{ fontSize: 11, fill: "#9AA19A" }}
                  axisLine={false}
                  tickLine={false}
                  width={42}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="netWorth"
                  stroke="#245A42"
                  strokeWidth={2}
                  fill="url(#nwFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-soft">
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
                Asset allocation
              </div>
              <div className="flex items-center gap-4">
                <div className="h-40 w-40 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        innerRadius={42}
                        outerRadius={68}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {pieData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={ALLOCATION_COLORS[i % ALLOCATION_COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {HOLDINGS.slice(0, 5).map((h, i) => (
                    <div
                      key={h.symbol}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            background:
                              ALLOCATION_COLORS[i % ALLOCATION_COLORS.length],
                          }}
                        />
                        <span className="text-ink-600">{h.symbol}</span>
                      </div>
                      <span className="font-mono text-ink-800">
                        {h.allocation}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-soft">
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
                Top movers · 30d
              </div>
              <div className="space-y-2.5">
                {[...HOLDINGS]
                  .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
                  .slice(0, 5)
                  .map((h) => (
                    <div
                      key={h.symbol}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-ink-800">
                          {h.name}
                        </div>
                        <div className="text-xs text-ink-400">{h.assetClass}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm text-ink-800">
                          {formatAED(h.value, true)}
                        </div>
                        <div
                          className={`text-xs font-medium ${
                            h.changePct >= 0 ? "text-gulf-600" : "text-clay-600"
                          }`}
                        >
                          {formatPct(h.changePct)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Investable", value: totals.investments },
              { label: "Cash", value: totals.cash },
              { label: "Property equity", value: 2100000 - 1185000 },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 shadow-soft"
              >
                <div className="text-[11px] uppercase tracking-wide text-ink-400">
                  {s.label}
                </div>
                <div className="mt-1 font-mono text-sm font-medium text-ink-800 sm:text-base">
                  {formatAED(s.value, true)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-[420px] min-h-0 flex-col bg-sand-50/50 lg:h-auto lg:w-[380px] xl:w-[420px]">
        <div className="border-b border-[var(--border)] px-4 py-3">
          <div className="text-sm font-medium text-ink-800">Portfolio analyst</div>
          <div className="text-xs text-ink-400">
            Ask about allocation, drawdowns, alternatives
          </div>
        </div>
        <div className="min-h-0 flex-1">
          <ChatView compact seedPrompt="Show my asset allocation" />
        </div>
      </div>
    </div>
  );
}
