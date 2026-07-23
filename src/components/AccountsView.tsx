"use client";

import { useMemo, useState } from "react";
import {
  ACCOUNTS,
  TRANSACTIONS,
  UAE_BANKS,
  computeTotals,
} from "@/lib/demo-data";
import { formatAED, formatDate, formatShortDate } from "@/lib/format";
import type { AccountType } from "@/lib/types";
import {
  Building2,
  CreditCard,
  Landmark,
  LineChart,
  Bitcoin,
  Home,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

const TYPE_ICON: Record<AccountType, typeof Building2> = {
  checking: Building2,
  savings: Landmark,
  credit: CreditCard,
  investment: LineChart,
  loan: Landmark,
  property: Home,
  crypto: Bitcoin,
};

export function AccountsView() {
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [connectOpen, setConnectOpen] = useState(false);
  const [connectedExtra, setConnectedExtra] = useState<string[]>([]);
  const [selectedTxAccount, setSelectedTxAccount] = useState<string | "all">(
    "all",
  );
  const totals = computeTotals();

  const accounts = useMemo(() => {
    return ACCOUNTS.filter((a) => {
      if (filter !== "all" && a.type !== filter) return false;
      if (
        query &&
        !`${a.name} ${a.institution}`.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [filter, query]);

  const txs = useMemo(() => {
    return TRANSACTIONS.filter(
      (t) => selectedTxAccount === "all" || t.accountId === selectedTxAccount,
    ).sort((a, b) => b.date.localeCompare(a.date));
  }, [selectedTxAccount]);

  return (
    <div className="scrollbar-thin h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="animate-fade-up mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-ink-400">Accounts</div>
            <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink-900">
              Connected institutions
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              {ACCOUNTS.length + connectedExtra.length} links · last sync just
              now · UAE demo data
            </p>
          </div>
          <button
            onClick={() => setConnectOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gulf-700 px-4 py-2.5 text-sm font-medium text-sand-50 shadow-soft transition hover:bg-gulf-600"
          >
            <Plus size={16} />
            Connect account
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Assets", value: totals.assets },
            { label: "Liabilities", value: totals.liabilities },
            { label: "Cash", value: totals.cash },
            { label: "Investments", value: totals.investments },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 shadow-soft"
            >
              <div className="text-[11px] uppercase tracking-wide text-ink-400">
                {s.label}
              </div>
              <div className="mt-1 font-mono text-sm font-medium text-ink-800">
                {formatAED(s.value, true)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accounts"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2 pl-9 pr-3 text-sm outline-none focus:border-gulf-300 focus:ring-2 focus:ring-gulf-100"
            />
          </div>
          {(
            [
              "all",
              "checking",
              "savings",
              "credit",
              "investment",
              "loan",
              "property",
              "crypto",
            ] as const
          ).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs capitalize transition ${
                filter === f
                  ? "bg-ink-800 text-sand-50"
                  : "border border-[var(--border)] bg-[var(--surface)] text-ink-500 hover:bg-sand-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {accounts.map((a) => {
            const Icon = TYPE_ICON[a.type];
            return (
              <button
                key={a.id}
                onClick={() => setSelectedTxAccount(a.id)}
                className={`flex items-start gap-3 rounded-2xl border bg-[var(--surface)] p-4 text-left shadow-soft transition hover:shadow-lift ${
                  selectedTxAccount === a.id
                    ? "border-gulf-400 ring-2 ring-gulf-100"
                    : "border-[var(--border)]"
                }`}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ background: a.color }}
                >
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-ink-800">{a.name}</div>
                      <div className="text-xs text-ink-400">
                        {a.institution} · {a.mask}
                      </div>
                    </div>
                    <div
                      className={`font-mono text-sm font-medium ${
                        a.balance < 0 ? "text-clay-600" : "text-ink-800"
                      }`}
                    >
                      {formatAED(a.balance)}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-400">
                    <RefreshCw size={11} />
                    Synced {formatDate(a.lastSynced)}
                    {a.change30d != null && (
                      <span
                        className={
                          a.change30d >= 0 ? "text-gulf-600" : "text-clay-600"
                        }
                      >
                        · {a.change30d >= 0 ? "+" : ""}
                        {a.change30d}% 30d
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          {connectedExtra.map((name) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-2xl border border-dashed border-gulf-300 bg-gulf-50/50 p-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gulf-700 text-sand-50">
                <Plus size={18} />
              </div>
              <div>
                <div className="font-medium text-ink-800">{name}</div>
                <div className="text-xs text-gulf-700">Connected · demo</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-medium text-ink-900">
              Recent transactions
            </h2>
            <button
              onClick={() => setSelectedTxAccount("all")}
              className="text-xs text-tide-500 hover:underline"
            >
              Show all
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-soft">
            {txs.map((t, i) => {
              const acc = ACCOUNTS.find((a) => a.id === t.accountId);
              return (
                <div
                  key={t.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i !== txs.length - 1 ? "border-b border-[var(--border)]" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink-800">
                      {t.merchant}
                      {t.pending && (
                        <span className="ml-2 rounded-full bg-sand-200 px-1.5 py-0.5 text-[10px] font-medium uppercase text-ink-500">
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-ink-400">
                      {t.category} · {acc?.institution} ·{" "}
                      {formatShortDate(t.date)}
                    </div>
                  </div>
                  <div
                    className={`font-mono text-sm font-medium ${
                      t.amount >= 0 ? "text-gulf-700" : "text-ink-800"
                    }`}
                  >
                    {t.amount >= 0 ? "+" : ""}
                    {formatAED(t.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {connectOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-900/40 p-4 backdrop-blur-sm sm:items-center">
          <div className="animate-fade-up max-h-[80vh] w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lift">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div>
                <div className="font-medium text-ink-900">Connect an account</div>
                <div className="text-xs text-ink-400">
                  UAE banks & platforms · demo only
                </div>
              </div>
              <button
                onClick={() => setConnectOpen(false)}
                className="rounded-lg p-1.5 text-ink-400 hover:bg-sand-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="scrollbar-thin max-h-[60vh] overflow-y-auto p-2">
              {UAE_BANKS.map((b) => (
                <button
                  key={b.name}
                  onClick={() => {
                    if (!connectedExtra.includes(b.name)) {
                      setConnectedExtra((c) => [...c, b.name]);
                    }
                    setConnectOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-sand-100"
                >
                  <div>
                    <div className="text-sm font-medium text-ink-800">
                      {b.name}
                    </div>
                    <div className="text-xs text-ink-400">{b.type}</div>
                  </div>
                  <Plus size={16} className="text-ink-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
