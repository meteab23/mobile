"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Banknote,
  Users,
  FileText,
  Settings,
  LifeBuoy,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";

const nav = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: ArrowLeftRight, label: "Transactions" },
  { icon: Banknote, label: "Payouts" },
  { icon: Users, label: "Buyers" },
  { icon: FileText, label: "Invoices" },
];

const secondary = [
  { icon: Settings, label: "Settings" },
  { icon: LifeBuoy, label: "Support" },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-line bg-bg px-4 py-3 lg:hidden">
        <Logo />
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full text-ink"
          aria-label="Toggle sidebar"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } border-b border-line bg-bg px-4 py-4 lg:sticky lg:top-0 lg:block lg:h-dvh lg:w-64 lg:flex-none lg:border-b-0 lg:border-r lg:px-5 lg:py-6`}
      >
        <div className="hidden lg:block">
          <Logo />
        </div>

        <nav className="mt-0 space-y-1 lg:mt-8">
          {nav.map((n) => (
            <NavItem key={n.label} {...n} />
          ))}
        </nav>

        <div className="mt-6 space-y-1 border-t border-line pt-6">
          {secondary.map((n) => (
            <NavItem key={n.label} {...n} />
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-white p-4 lg:mt-8">
          <p className="text-sm font-medium text-ink">Sandbox mode</p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
            You&apos;re viewing demo data. Connect a store to go live.
          </p>
          <Link
            href="/product"
            className="mt-3 inline-flex text-[13px] font-medium text-brand hover:underline"
          >
            Go live →
          </Link>
        </div>
      </aside>
    </>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors ${
        active
          ? "bg-brand-soft font-medium text-brand-ink"
          : "text-ink-soft hover:bg-black/[0.04]"
      }`}
    >
      <Icon size={18} className={active ? "text-brand" : "text-ink-muted"} />
      {label}
    </button>
  );
}
