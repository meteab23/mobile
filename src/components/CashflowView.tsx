"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CASHFLOW, SPENDING } from "@/lib/demo-data";
import { formatAED } from "@/lib/format";

export function CashflowView() {
  const latest = CASHFLOW[CASHFLOW.length - 1];
  const avgSave =
    CASHFLOW.reduce((s, m) => s + m.savings, 0) / CASHFLOW.length;

  return (
    <div className="scrollbar-thin h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="animate-fade-up mx-auto max-w-5xl">
        <div className="text-sm font-medium text-ink-400">Cashflow</div>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink-900">
          Income, spend & surplus
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-500">
          Built from Emirates NBD salary credits and categorized card spend
          across ADCB and everyday UAE merchants.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "July income", value: latest.income },
            { label: "July expenses", value: latest.expenses },
            { label: "July surplus", value: latest.savings },
            { label: "6-mo avg save", value: Math.round(avgSave) },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 shadow-soft"
            >
              <div className="text-[11px] uppercase tracking-wide text-ink-400">
                {s.label}
              </div>
              <div className="mt-1 font-mono text-sm font-medium text-ink-800">
                {formatAED(s.value)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 h-72 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-soft sm:h-80">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
            Monthly cashflow
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={CASHFLOW} barGap={4}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(18,23,18,0.06)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9AA19A" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${v / 1000}k`}
                tick={{ fontSize: 11, fill: "#9AA19A" }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                formatter={(v) => formatAED(Number(v))}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(18,23,18,0.08)",
                }}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#1A5F7A" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#BC6C25"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="savings"
                name="Surplus"
                fill="#2D6A4F"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h2 className="font-display text-xl font-medium text-ink-900">
            July spending mix
          </h2>
          <div className="mt-3 space-y-3">
            {SPENDING.map((s) => (
              <div key={s.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-ink-700">{s.name}</span>
                  <span className="font-mono text-ink-800">
                    {formatAED(s.amount)} · {s.pct}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-sand-200">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${s.pct}%`,
                      background: s.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
