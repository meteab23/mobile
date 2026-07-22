"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/invoices", label: "Invoices", icon: CreditCard },
  { href: "/dashboard/buyers", label: "Buyers", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto grid min-h-screen max-w-[1400px] lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-line bg-surface lg:border-r lg:border-b-0">
          <div className="flex h-16 items-center justify-between px-5 lg:h-[4.25rem]">
            <Link href="/" className="font-display text-xl font-bold tracking-[-0.04em]">
              Stride<span className="text-accent">.</span>
            </Link>
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-accent uppercase lg:hidden">
              Merchant
            </span>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-6">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-ink text-white"
                      : "text-muted hover:bg-bg hover:text-ink"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden border-t border-line px-4 py-5 lg:block">
            <div className="flex items-center gap-3 rounded-xl bg-bg px-3 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Building2 size={16} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">Meridian Goods</p>
                <p className="truncate text-xs text-muted">Live · EU</p>
              </div>
            </div>
            <Link
              href="/"
              className="mt-3 flex items-center gap-2 px-2 text-sm text-muted hover:text-ink"
            >
              <LogOut size={14} />
              Back to site
            </Link>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="flex h-16 items-center justify-between border-b border-line px-5 md:px-8 lg:h-[4.25rem]">
            <div>
              <p className="text-xs tracking-wide text-muted uppercase">Merchant platform</p>
              <p className="font-display text-lg tracking-[-0.03em] text-ink">Meridian Goods</p>
            </div>
            <Link href="/checkout/demo" className="btn-secondary !px-3.5 !py-2 text-sm">
              Preview checkout
            </Link>
          </header>
          <div className="px-5 py-6 md:px-8 md:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
