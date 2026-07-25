"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cable, Percent, Store, Wallet } from "lucide-react";
import { FadeIn } from "@/components/marketing/FadeIn";
import { CtaBand } from "@/components/marketing/CtaBand";
import { ButtonLink } from "@/components/ui/Button";
import { repaymentOptions } from "@/lib/data";

const steps = [
  {
    icon: Store,
    title: "Connect your POS",
    body: "Link Yusr to Network International, Geidea, Stripe Terminal, or your gateway. Sales sync automatically.",
  },
  {
    icon: Percent,
    title: "Choose your share",
    body: "Pick 5%, 10%, 15%, or 20% of each card/digital transaction toward your Yusr balance.",
  },
  {
    icon: Wallet,
    title: "Repay as you sell",
    body: "Every sale routes the agreed share to Yusr and the rest to you — no fixed EMI calendar.",
  },
  {
    icon: Cable,
    title: "Stay in control",
    body: "Pause, adjust percentage, or make one-off repayments anytime from the merchant portal.",
  },
];

export default function RepaymentsPage() {
  const [selected, setSelected] = useState(repaymentOptions[1].id);
  const [dailySales, setDailySales] = useState(8500);
  const option = repaymentOptions.find((o) => o.id === selected)!;
  const pct = Number(option.label.split("%")[0]);
  const toYusr = Math.round((dailySales * pct) / 100);
  const toYou = dailySales - toYusr;

  return (
    <>
      <section className="relative overflow-hidden section-pad">
        <div className="absolute inset-0 mesh-hero" />
        <div className="shell relative max-w-3xl">
          <FadeIn>
            <p className="font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
              POS & repayments
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl text-balance">
              Collect payments the YouLend way — tied to real sales
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              Connect Yusr to your POS. Choose how much of each transaction
              goes toward repayment — for example 10%. Strong sales days repay
              faster; quiet days give you breathing room.
            </p>
            <div className="mt-8">
              <ButtonLink href="/demo" variant="accent">
                Talk to our UAE team
              </ButtonLink>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad bg-paper-elev !py-16">
        <div className="shell">
          <FadeIn>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
              How POS repayment works
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.07}>
                <step.icon className="text-accent" size={22} />
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="shell grid items-start gap-12 lg:grid-cols-2">
          <FadeIn>
            <p className="font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
              Interactive example
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
              See a day of sales split live
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Adjust daily sales and repayment share. This is the same mental
              model merchants use with revenue-based financing — adapted for
              Yusr BNPL settlement.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-[1.75rem] border border-line bg-paper-elev p-6 shadow-soft sm:p-8">
              <label className="block text-sm text-ink-muted">
                Daily card & digital sales (AED)
                <input
                  type="range"
                  min={1000}
                  max={50000}
                  step={500}
                  value={dailySales}
                  onChange={(e) => setDailySales(Number(e.target.value))}
                  className="mt-3 w-full accent-accent"
                />
                <span className="mt-2 block font-display text-2xl font-semibold text-ink">
                  AED {dailySales.toLocaleString()}
                </span>
              </label>

              <p className="mt-8 text-sm text-ink-muted">Repayment share</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {repaymentOptions.map((opt) => {
                  const active = opt.id === selected;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelected(opt.id)}
                      className={`rounded-full px-3 py-2 text-sm transition ${
                        active
                          ? "bg-ink text-paper-elev"
                          : "bg-paper-soft text-ink-muted hover:bg-line/60"
                      }`}
                    >
                      {opt.label.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-ink-muted">{option.detail}</p>

              <div className="mt-8 h-4 overflow-hidden rounded-full bg-paper-soft">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent via-sky to-sand"
                  animate={{ width: `${Math.min(pct * 5, 100)}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-accent-soft p-4">
                  <p className="text-xs uppercase tracking-wider text-accent-deep">
                    To Yusr ({pct}%)
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink">
                    AED {toYusr.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl bg-paper-soft p-4">
                  <p className="text-xs uppercase tracking-wider text-ink-muted">
                    To your account
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink">
                    AED {toYou.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad mesh-soft !py-16">
        <div className="shell max-w-3xl">
          <FadeIn>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Why merchants prefer sales-based repayment
            </h2>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-ink-muted">
              <li>· No rigid EMI that ignores seasonal UAE trading patterns.</li>
              <li>· Zero repayment on zero-sales days — cash flow stays intact.</li>
              <li>· One fixed commercial understanding, not compounding interest surprises.</li>
              <li>· Works alongside Account Trade payouts and future Pay Later / Installments settlement.</li>
            </ul>
          </FadeIn>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
