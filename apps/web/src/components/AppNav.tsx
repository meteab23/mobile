"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Dashboard" },
  { href: "/signals", label: "Buy Signals" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 border-b border-zinc-800 bg-zinc-950 px-4">
      <span className="mr-4 hidden font-bold text-emerald-400 sm:inline">DayTrader Pro</span>
      {tabs.map((tab) => {
        const active =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
