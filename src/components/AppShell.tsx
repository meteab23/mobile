"use client";

import { useState } from "react";
import { Sidebar, MobileHeader } from "./Sidebar";
import { ChatView } from "./ChatView";
import { PlanView } from "./PlanView";
import { PortfolioView } from "./PortfolioView";
import { AccountsView } from "./AccountsView";
import { CashflowView } from "./CashflowView";
import { GoalsView } from "./GoalsView";
import { SettingsView } from "./SettingsView";
import type { ViewId } from "@/lib/types";
import { USER } from "@/lib/demo-data";
import { ArrowRight, Sparkles } from "lucide-react";

const TITLES: Record<ViewId, string> = {
  chat: "Chat",
  plan: "Plan",
  portfolio: "Portfolio",
  accounts: "Accounts",
  cashflow: "Cashflow",
  goals: "Goals",
  settings: "Settings",
};

function WelcomeGate({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="app-grain relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-gulf-200/40 blur-3xl" />
        <div className="absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-tide-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gulf-700 text-sand-50 shadow-lift">
            <span className="font-display text-2xl font-semibold">M</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-ink-900">
            Mizan
          </h1>
          <p className="mt-2 text-ink-500">
            Your AI personal CFO for the UAE
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/95 p-6 shadow-lift backdrop-blur-md sm:p-8">
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-gulf-50 px-4 py-3 text-sm text-gulf-800">
            <Sparkles size={16} className="mt-0.5 shrink-0" />
            <p>
              Demo workspace for <strong>{USER.name}</strong> — Emirates NBD,
              FAB, Sarwa, Marina property, and a living financial plan in AED.
            </p>
          </div>

          <button
            onClick={onEnter}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-800 py-3.5 text-sm font-medium text-sand-50 transition hover:bg-ink-700"
          >
            Continue to Mizan
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-0.5"
            />
          </button>

          <div className="relative my-5 text-center text-xs text-ink-300">
            <span className="relative z-10 bg-[var(--surface)] px-2">or</span>
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--border)]" />
          </div>

          <button
            onClick={onEnter}
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] py-3 text-sm font-medium text-ink-700 transition hover:bg-sand-50"
          >
            Continue with UAE Pass
          </button>
          <button
            onClick={onEnter}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] py-3 text-sm font-medium text-ink-700 transition hover:bg-sand-50"
          >
            Continue with Google
          </button>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-ink-300">
            By continuing you enter an interactive demo. Not affiliated with
            Hiro Finance. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AppShell() {
  const [entered, setEntered] = useState(false);
  const [view, setView] = useState<ViewId>("chat");
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!entered) {
    return <WelcomeGate onEnter={() => setEntered(true)} />;
  }

  return (
    <div className="app-grain relative flex h-dvh overflow-hidden">
      <Sidebar
        active={view}
        onNavigate={setView}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <MobileHeader
          title={TITLES[view]}
          onOpenMenu={() => setMobileOpen(true)}
        />

        <main className="min-h-0 flex-1">
          {view === "chat" && <ChatView />}
          {view === "plan" && <PlanView />}
          {view === "portfolio" && <PortfolioView />}
          {view === "accounts" && <AccountsView />}
          {view === "cashflow" && <CashflowView />}
          {view === "goals" && <GoalsView />}
          {view === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
