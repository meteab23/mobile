"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  CreditCard,
  Headphones,
  Shield,
  Sparkles,
  Store,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SolutionId = "checkout" | "telesales" | "inperson";

interface FeatureCard {
  title: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
}

interface SolutionTab {
  id: SolutionId;
  label: string;
  headline: string;
  subcopy: string;
  icon: React.ReactNode;
  cards: FeatureCard[];
}

const SOLUTIONS: SolutionTab[] = [
  {
    id: "checkout",
    label: "Online Checkout",
    headline: "Convert more B2B carts with flexible payment terms",
    subcopy:
      "Embed BNPL and trade credit into your ecommerce flow without slowing buyers down.",
    icon: <CreditCard className="h-4 w-4" />,
    cards: [
      {
        title: "Buy Now, Pay Later",
        description:
          "Let buyers split invoices across Net-30/60/90 while you receive funds next day.",
        badge: "Buy Now, Pay Later",
        icon: <Zap className="h-5 w-5" />,
      },
      {
        title: "Trade Account",
        description:
          "Offer revolving credit lines for returning wholesale and enterprise customers.",
        badge: "Trade Account",
        icon: <Building2 className="h-5 w-5" />,
      },
      {
        title: "Real-time Underwriting",
        description:
          "AI evaluates buyer risk in milliseconds and auto-approves eligible orders.",
        badge: "Real-time Underwriting",
        icon: <Shield className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "telesales",
    label: "Telesales",
    headline: "Close larger deals on the phone with instant credit decisions",
    subcopy:
      "Empower sales reps with live limits, terms, and payment links during every call.",
    icon: <Headphones className="h-4 w-4" />,
    cards: [
      {
        title: "Live credit limits",
        description:
          "Surface approved spend ceilings while the buyer is still on the line.",
        badge: "Trade Account",
        icon: <Sparkles className="h-5 w-5" />,
      },
      {
        title: "One-click payment links",
        description:
          "Send branded checkout links with prefilled order amounts and terms.",
        badge: "Buy Now, Pay Later",
        icon: <Zap className="h-5 w-5" />,
      },
      {
        title: "Rep-ready risk signals",
        description:
          "Give telesales teams clear approve / review guidance without finance bottlenecks.",
        badge: "Real-time Underwriting",
        icon: <Shield className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "inperson",
    label: "In-Person B2B",
    headline: "Bring modern trade credit to showrooms and field sales",
    subcopy:
      "Capture larger ticket orders on-site with the same AI underwriting used online.",
    icon: <Store className="h-4 w-4" />,
    cards: [
      {
        title: "Showroom checkout",
        description:
          "Accept net terms from tablets or POS without paperwork delays.",
        badge: "Buy Now, Pay Later",
        icon: <Store className="h-5 w-5" />,
      },
      {
        title: "Field sales financing",
        description:
          "Approve credit for distributors and dealers during on-site visits.",
        badge: "Trade Account",
        icon: <Building2 className="h-5 w-5" />,
      },
      {
        title: "Instant KYB checks",
        description:
          "Verify business identity and payment capacity before the handshake ends.",
        badge: "Real-time Underwriting",
        icon: <Shield className="h-5 w-5" />,
      },
    ],
  },
];

export function FeatureTabs() {
  const [activeId, setActiveId] = React.useState<SolutionId>("checkout");
  const active = SOLUTIONS.find((s) => s.id === activeId) ?? SOLUTIONS[0];

  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-violet-500/5 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-tight text-emerald-700 dark:text-emerald-400">
            Solutions
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for every B2B sales channel
          </h2>
          <p className="mt-3 text-muted-foreground">
            Switch between checkout, telesales, and in-person workflows—same
            risk engine, tailored experience.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full border border-neutral-200/80 bg-white/70 p-1 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/70">
            {SOLUTIONS.map((tab) => {
              const selected = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveId(tab.id)}
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                    selected
                      ? "text-white"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="feature-tab-pill"
                      className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10",
                      selected && "dark:text-neutral-900"
                    )}
                  >
                    {tab.icon}
                  </span>
                  <span
                    className={cn(
                      "relative z-10",
                      selected && "dark:text-neutral-900"
                    )}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="mt-12"
          >
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {active.headline}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {active.subcopy}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {active.cards.map((card, index) => (
                <motion.article
                  key={`${active.id}-${card.title}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.35 }}
                  className="group rounded-3xl border border-neutral-200/80 bg-white/80 p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5 dark:border-neutral-800 dark:bg-neutral-950/80"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50 text-neutral-800 transition-colors group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:group-hover:text-emerald-400">
                      {card.icon}
                    </span>
                    <Badge variant="outline">{card.badge}</Badge>
                  </div>
                  <h4 className="text-lg font-semibold tracking-tight">
                    {card.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
