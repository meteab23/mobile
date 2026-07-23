"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  PLAN_MILESTONES,
  PLAN_PROJECTION,
  USER,
  computeTotals,
} from "@/lib/demo-data";
import { formatAED } from "@/lib/format";
import { CheckCircle2, AlertTriangle, CircleDot, SlidersHorizontal } from "lucide-react";

type Scenario = "baseline" | "aggressive" | "conservative";

export function PlanView() {
  const [scenario, setScenario] = useState<Scenario>("baseline");
  const [savingsBoost, setSavingsBoost] = useState(0);
  const totals = computeTotals();

  const chartData = PLAN_PROJECTION.map((p) => {
    const boost =
      savingsBoost *
      12 *
      ((Math.pow(1.075, p.year - 2026) - 1) / 0.075);
    return {
      year: p.year,
      baseline: p.baseline + (scenario === "baseline" ? boost : 0),
      aggressive: p.aggressive + (scenario === "aggressive" ? boost : 0),
      conservative: p.conservative + (scenario === "conservative" ? boost : 0),
    };
  });

  const endValue = chartData[chartData.length - 1][scenario];

  return (
    <div className="scrollbar-thin h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="animate-fade-up mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-ink-400">Financial plan</div>
            <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink-900 sm:text-4xl">
              {USER.household}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-ink-500">
              A living plan grounded in your connected UAE accounts. Model
              scenarios, audit the math, and keep milestones honest.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-soft">
            <div className="text-[11px] uppercase tracking-wide text-ink-400">
              Starting net worth
            </div>
            <div className="font-mono text-xl font-medium text-ink-900">
              {formatAED(totals.netWorth)}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {(
            [
              ["baseline", "Baseline"],
              ["aggressive", "Growth +"],
              ["conservative", "Cautious"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setScenario(id)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                scenario === id
                  ? "bg-ink-800 text-sand-50"
                  : "border border-[var(--border)] bg-[var(--surface)] text-ink-600 hover:bg-sand-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-soft sm:p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-ink-400">
                Projected net worth · 2045
              </div>
              <div className="font-display text-2xl font-medium text-ink-900">
                {formatAED(endValue)}
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-sand-50 px-3 py-2">
              <SlidersHorizontal size={14} className="text-ink-400" />
              <label className="text-xs text-ink-500">
                Extra savings / mo
                <span className="ml-2 font-mono text-ink-800">
                  {formatAED(savingsBoost)}
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={8000}
                step={500}
                value={savingsBoost}
                onChange={(e) => setSavingsBoost(Number(e.target.value))}
                className="w-28 accent-gulf-600"
              />
            </div>
          </div>

          <div className="h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="planFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1A5F7A" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#1A5F7A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(18,23,18,0.06)"
                />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "#9AA19A" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`}
                  tick={{ fontSize: 11, fill: "#9AA19A" }}
                  axisLine={false}
                  tickLine={false}
                  width={42}
                />
                <Tooltip
                  formatter={(value) => formatAED(Number(value))}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(18,23,18,0.08)",
                    background: "#FFFCF8",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="conservative"
                  name="Cautious"
                  stroke="#A3B18A"
                  fill="transparent"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  hide={scenario !== "conservative"}
                />
                <Area
                  type="monotone"
                  dataKey="baseline"
                  name="Baseline"
                  stroke="#245A42"
                  fill="url(#planFill)"
                  strokeWidth={2}
                  hide={scenario !== "baseline"}
                />
                <Area
                  type="monotone"
                  dataKey="aggressive"
                  name="Growth +"
                  stroke="#1A5F7A"
                  fill="transparent"
                  strokeWidth={2}
                  hide={scenario !== "aggressive"}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-display text-xl font-medium text-ink-900">
            Milestones
          </h2>
          <div className="mt-3 space-y-2">
            {PLAN_MILESTONES.map((m) => {
              const Icon =
                m.status === "completed"
                  ? CheckCircle2
                  : m.status === "at-risk"
                    ? AlertTriangle
                    : CircleDot;
              const tone =
                m.status === "completed"
                  ? "text-gulf-600 bg-gulf-50"
                  : m.status === "at-risk"
                    ? "text-clay-600 bg-clay-400/15"
                    : "text-tide-500 bg-tide-500/10";
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-soft transition hover:shadow-lift"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-ink-800">{m.label}</div>
                    <div className="text-xs text-ink-400">
                      {m.year} · {m.status.replace("-", " ")}
                    </div>
                  </div>
                  {m.amount != null && (
                    <div className="font-mono text-sm text-ink-700">
                      {formatAED(m.amount, true)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Assumptions",
              body: "7.5% blended return · 3% salary growth · 2.5% inflation · no UAE income tax",
            },
            {
              title: "Risk notes",
              body: "Education goal underfunded. Property concentration high. Credit is revolving float only.",
            },
            {
              title: "Next action",
              body: "Raise education transfers by AED 800/mo or extend FI target by 11 months.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-soft"
            >
              <div className="text-sm font-medium text-ink-800">{c.title}</div>
              <p className="mt-1 text-sm leading-relaxed text-ink-500">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
