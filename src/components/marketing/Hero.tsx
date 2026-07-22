"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden atmosphere noise">
      <div className="pointer-events-none absolute inset-0 grid-fade" />
      <div className="container-wide relative px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-sm font-semibold tracking-[0.18em] text-accent uppercase"
          >
            Stride
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mt-5 text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.95] font-bold tracking-[-0.05em] text-ink text-balance"
          >
            The new standard for B2B payments
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-muted md:text-lg"
          >
            Save time, boost sales, and scale with ease. Modern buy-now-pay-later
            for business buyers—settled instantly for you.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/demo" className="btn-primary">
              Book a demo now
              <ArrowRight size={16} />
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              Explore the platform
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 w-full max-w-5xl"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_50%_0%,rgba(23,163,122,0.2),transparent_60%)] blur-2xl" />
          <HeroProductVisual />
        </motion.div>
      </div>
    </section>
  );
}

function HeroProductVisual() {
  return (
    <div className="animate-float relative overflow-hidden rounded-[1.5rem] border border-line/80 bg-surface shadow-[0_40px_80px_-30px_rgba(11,13,12,0.35)]">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5 md:px-6">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <p className="text-xs tracking-wide text-muted uppercase">Merchant console</p>
        <div className="h-2 w-16 rounded-full bg-line" />
      </div>

      <div className="grid md:grid-cols-[0.9fr_1.2fr]">
        <div className="border-b border-line p-5 md:border-r md:border-b-0 md:p-7">
          <p className="text-sm text-muted">Today&apos;s settlement</p>
          <p className="font-display mt-2 text-4xl tracking-[-0.04em] text-ink md:text-5xl">
            €128,440
          </p>
          <p className="mt-3 text-sm text-accent">+€24.1k vs yesterday</p>

          <div className="mt-8 space-y-3">
            {[
              { label: "Pay Later approvals", value: "98%" },
              { label: "Funds released", value: "Same day" },
              { label: "Risk covered", value: "100%" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-xl bg-bg px-3.5 py-3"
              >
                <span className="text-sm text-muted">{row.label}</span>
                <span className="text-sm font-semibold text-ink">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 md:p-7">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg tracking-[-0.03em]">Live buyer decisions</p>
            <span className="animate-pulse-soft inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Real-time
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {[
              {
                buyer: "Nordic Supply Co.",
                amount: "€18,450",
                term: "Net 30",
                status: "Approved",
              },
              {
                buyer: "Helix Materials",
                amount: "€9,200",
                term: "Pay in 3",
                status: "Review",
              },
              {
                buyer: "Atlas Retail Group",
                amount: "€41,200",
                term: "Net 60",
                status: "Approved",
              },
            ].map((item) => (
              <div
                key={item.buyer}
                className="grid grid-cols-[1fr_auto] gap-3 rounded-2xl border border-line px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{item.buyer}</p>
                  <p className="mt-1 text-xs text-muted">
                    {item.term} · {item.amount}
                  </p>
                </div>
                <span
                  className={`self-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    item.status === "Approved"
                      ? "bg-accent-soft text-accent"
                      : "bg-[#f5efe4] text-[#8a5a12]"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
