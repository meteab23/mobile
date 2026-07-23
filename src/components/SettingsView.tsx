"use client";

import { useState } from "react";
import { USER } from "@/lib/demo-data";
import {
  Bell,
  Download,
  HelpCircle,
  LogOut,
  Shield,
  Users,
  Check,
} from "lucide-react";

export function SettingsView() {
  const [notifications, setNotifications] = useState(true);
  const [household, setHousehold] = useState(true);
  const [exported, setExported] = useState(false);
  const [supportSent, setSupportSent] = useState(false);

  return (
    <div className="scrollbar-thin h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="animate-fade-up mx-auto max-w-2xl">
        <div className="text-sm font-medium text-ink-400">Settings</div>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink-900">
          Your Mizan workspace
        </h1>

        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gulf-500 to-tide-500 text-lg font-semibold text-white">
              {USER.avatarInitials}
            </div>
            <div>
              <div className="font-medium text-ink-900">{USER.name}</div>
              <div className="text-sm text-ink-500">{USER.email}</div>
              <div className="text-xs text-ink-400">
                {USER.occupation} · {USER.city}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-6">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
            Preferences
          </h2>
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-soft">
            <ToggleRow
              icon={Bell}
              title="Smart nudges"
              description="Cashflow alerts, goal drift, and month-end digests"
              enabled={notifications}
              onToggle={() => setNotifications((v) => !v)}
            />
            <ToggleRow
              icon={Users}
              title="Household sharing"
              description={`${USER.household} — shared plan & chats`}
              enabled={household}
              onToggle={() => setHousehold((v) => !v)}
            />
            <div className="flex items-center gap-3 border-t border-[var(--border)] px-4 py-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand-100 text-ink-500">
                <Shield size={16} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-ink-800">
                  Privacy & encryption
                </div>
                <div className="text-xs text-ink-400">
                  Demo mode — no live bank credentials stored
                </div>
              </div>
              <span className="rounded-full bg-gulf-50 px-2.5 py-1 text-[11px] font-medium text-gulf-700">
                Active
              </span>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
            About
          </h2>
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-soft">
            <button
              onClick={() => {
                setExported(true);
                setTimeout(() => setExported(false), 2000);
              }}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-sand-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand-100 text-ink-500">
                {exported ? <Check size={16} className="text-gulf-600" /> : <Download size={16} />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-ink-800">
                  Export demo data
                </div>
                <div className="text-xs text-ink-400">
                  {exported ? "Export ready (demo)" : "JSON snapshot of accounts & plan"}
                </div>
              </div>
            </button>
            <button
              onClick={() => {
                setSupportSent(true);
                setTimeout(() => setSupportSent(false), 2000);
              }}
              className="flex w-full items-center gap-3 border-t border-[var(--border)] px-4 py-3.5 text-left transition hover:bg-sand-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand-100 text-ink-500">
                {supportSent ? (
                  <Check size={16} className="text-gulf-600" />
                ) : (
                  <HelpCircle size={16} />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-ink-800">
                  Contact support
                </div>
                <div className="text-xs text-ink-400">
                  {supportSent
                    ? "Message queued (demo)"
                    : "help@mizan.ae · demo form"}
                </div>
              </div>
            </button>
            <div className="flex items-center gap-3 border-t border-[var(--border)] px-4 py-3.5 text-ink-400">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand-100">
                <LogOut size={16} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Sign out</div>
                <div className="text-xs">Disabled in demo</div>
              </div>
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-ink-300">
          Mizan · Inspired by Hiro Finance · UAE demo · Not financial advice
        </p>
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3.5 last:border-b-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand-100 text-ink-500">
        <Icon size={16} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-ink-800">{title}</div>
        <div className="text-xs text-ink-400">{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`relative h-6 w-11 rounded-full transition ${
          enabled ? "bg-gulf-600" : "bg-sand-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            enabled ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
