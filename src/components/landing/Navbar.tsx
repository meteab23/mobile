"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Menu,
  Moon,
  Sun,
  X,
  CreditCard,
  Building2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
}

interface NavGroup {
  label: string;
  items: NavLink[];
}

const productLinks: NavGroup = {
  label: "Products",
  items: [
    {
      label: "Buy Now, Pay Later",
      href: "#features",
      description: "Flexible net terms at checkout",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      label: "Trade Accounts",
      href: "#features",
      description: "Recurring B2B credit lines",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      label: "AI Underwriting",
      href: "#terminal",
      description: "Instant risk decisions",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
  ],
};

const simpleLinks: NavLink[] = [
  { label: "Solutions", href: "#features" },
  { label: "Metrics", href: "#metrics" },
  { label: "Pricing", href: "#cta" },
];

export function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [productsOpen, setProductsOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-300 sm:px-4",
          scrolled
            ? "border-neutral-200/50 bg-white/70 shadow-soft backdrop-blur-md dark:border-neutral-800/60 dark:bg-black/70"
            : "border-transparent bg-white/40 backdrop-blur-md dark:bg-black/40"
        )}
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 pl-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Billie</span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                aria-expanded={productsOpen}
              >
                {productLinks.label}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    productsOpen && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full pt-2"
                  >
                    <div className="w-72 rounded-2xl border border-neutral-200/80 bg-white/95 p-2 shadow-xl shadow-black/5 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95">
                      {productLinks.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                        >
                          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200/80 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                            {item.icon}
                          </span>
                          <span>
                            <span className="block text-sm font-medium tracking-tight">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {simpleLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="hidden sm:inline-flex"
          >
            {mounted ? (
              isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <Moon className="h-4 w-4 opacity-0" />
            )}
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link href="#cta">Schedule Demo</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 max-w-6xl rounded-3xl border border-neutral-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95 lg:hidden"
          >
            <div className="space-y-1">
              <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Products
              </p>
              {productLinks.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900"
                >
                  {item.label}
                </Link>
              ))}
              {simpleLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-neutral-200/80 pt-4 dark:border-neutral-800">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setTheme(isDark ? "light" : "dark")}
              >
                {isDark ? "Light mode" : "Dark mode"}
              </Button>
              <Button asChild className="flex-1">
                <Link href="#cta" onClick={() => setMobileOpen(false)}>
                  Schedule Demo
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
