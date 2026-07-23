"use client";

import { useState } from "react";
import { GOALS } from "@/lib/demo-data";
import { formatAED, formatDate } from "@/lib/format";
import {
  GraduationCap,
  Home,
  Landmark,
  Plus,
  Shield,
  Sparkles,
  X,
} from "lucide-react";

const ICONS = {
  shield: Shield,
  home: Home,
  landmark: Landmark,
  graduation: GraduationCap,
  spark: Sparkles,
} as const;

export function GoalsView() {
  const [goals, setGoals] = useState(GOALS);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("50000");

  function addGoal() {
    if (!name.trim() || !Number(target)) return;
    setGoals((g) => [
      ...g,
      {
        id: `goal-${Date.now()}`,
        name: name.trim(),
        target: Number(target),
        current: 0,
        deadline: "2030-12-31",
        icon: "spark",
        color: "#52796F",
      },
    ]);
    setName("");
    setTarget("50000");
    setOpen(false);
  }

  function contribute(id: string, amount: number) {
    setGoals((gs) =>
      gs.map((g) =>
        g.id === id
          ? { ...g, current: Math.min(g.target, g.current + amount) }
          : g,
      ),
    );
  }

  return (
    <div className="scrollbar-thin h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="animate-fade-up mx-auto max-w-4xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-ink-400">Goals</div>
            <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink-900">
              What you&apos;re building toward
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              UAE-aware targets — emergency liquidity, Hajj, property, and
              long-horizon independence.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gulf-700 px-4 py-2.5 text-sm font-medium text-sand-50 shadow-soft transition hover:bg-gulf-600"
          >
            <Plus size={16} />
            New goal
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {goals.map((g) => {
            const Icon = ICONS[g.icon as keyof typeof ICONS] || Sparkles;
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            const done = g.current >= g.target;
            return (
              <div
                key={g.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-soft transition hover:shadow-lift"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ background: g.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="font-medium text-ink-900">{g.name}</div>
                        <div className="text-xs text-ink-400">
                          Target {formatDate(g.deadline)}
                          {done && (
                            <span className="ml-2 text-gulf-600">· Complete</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right font-mono text-sm">
                        <span className="font-medium text-ink-800">
                          {formatAED(g.current)}
                        </span>
                        <span className="text-ink-300">
                          {" "}
                          / {formatAED(g.target)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-sand-200">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${pct}%`,
                          background: g.color,
                        }}
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-ink-500">
                        {pct}% funded
                      </span>
                      {!done && (
                        <>
                          <button
                            onClick={() => contribute(g.id, 1000)}
                            className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-ink-600 transition hover:bg-sand-100"
                          >
                            + AED 1,000
                          </button>
                          <button
                            onClick={() => contribute(g.id, 5000)}
                            className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-ink-600 transition hover:bg-sand-100"
                          >
                            + AED 5,000
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-900/40 p-4 backdrop-blur-sm sm:items-center">
          <div className="animate-fade-up w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-lift">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-medium text-ink-900">
                New goal
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-ink-400 hover:bg-sand-100"
              >
                <X size={18} />
              </button>
            </div>
            <label className="block text-xs font-medium text-ink-500">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-gulf-300 focus:ring-2 focus:ring-gulf-100"
                placeholder="e.g. Umrah trip"
              />
            </label>
            <label className="mt-3 block text-xs font-medium text-ink-500">
              Target (AED)
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-gulf-300 focus:ring-2 focus:ring-gulf-100"
              />
            </label>
            <button
              onClick={addGoal}
              className="mt-4 w-full rounded-xl bg-gulf-700 py-2.5 text-sm font-medium text-sand-50 hover:bg-gulf-600"
            >
              Create goal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
