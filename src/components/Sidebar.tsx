"use client";

import {
  MessageSquare,
  Map,
  PieChart,
  Wallet,
  ArrowLeftRight,
  Target,
  Settings,
  Menu,
  X,
} from "lucide-react";
import type { ViewId } from "@/lib/types";
import { USER } from "@/lib/demo-data";

const NAV: { id: ViewId; label: string; icon: typeof MessageSquare }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "plan", label: "Plan", icon: Map },
  { id: "portfolio", label: "Portfolio", icon: PieChart },
  { id: "accounts", label: "Accounts", icon: Wallet },
  { id: "cashflow", label: "Cashflow", icon: ArrowLeftRight },
  { id: "goals", label: "Goals", icon: Target },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  active: ViewId;
  onNavigate: (view: ViewId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  active,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-ink-900/30 backdrop-blur-[2px] lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[72px] flex-col border-r border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-center border-b border-[var(--border)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gulf-700 text-sand-50 shadow-soft">
            <span className="font-display text-lg font-semibold leading-none">
              M
            </span>
          </div>
          <button
            className="absolute right-3 top-4 rounded-lg p-1 text-ink-400 lg:hidden"
            onClick={onCloseMobile}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center gap-1 px-2 py-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gulf-700 text-sand-50 shadow-soft"
                    : "text-ink-400 hover:bg-sand-100 hover:text-ink-700"
                }`}
                title={item.label}
                aria-label={item.label}
              >
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-ink-800 px-2.5 py-1 text-xs text-sand-50 opacity-0 shadow-lift transition group-hover:opacity-100 xl:block">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col items-center gap-3 border-t border-[var(--border)] py-4">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gulf-500 to-tide-500 text-xs font-semibold text-white"
            title={USER.name}
          >
            {USER.avatarInitials}
          </div>
        </div>
      </aside>
    </>
  );
}

export function MobileHeader({
  title,
  onOpenMenu,
}: {
  title: string;
  onOpenMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)]/90 px-4 backdrop-blur-md lg:hidden">
      <button
        onClick={onOpenMenu}
        className="rounded-lg p-2 text-ink-600 hover:bg-sand-100"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2">
        <span className="font-display text-lg font-semibold tracking-tight text-ink-900">
          Mizan
        </span>
        <span className="text-ink-300">·</span>
        <span className="text-sm text-ink-500">{title}</span>
      </div>
    </header>
  );
}
