"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/marketing/FadeIn";
import { ButtonLink } from "@/components/ui/Button";
import { repaymentOptions } from "@/lib/data";

export function RepaymentPreview() {
  const [selected, setSelected] = useState(repaymentOptions[1].id);
  const option = repaymentOptions.find((o) => o.id === selected)!;
  const pct = Number(option.label.split("%")[0]);
  const sale = 1000;
  const sweep = Math.round((sale * pct) / 100);
  const keep = sale - sweep;

  return (
    <section className="section-pad bg-ink text-paper-elev overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0 opacity-40 mesh-panel" />
      <div className="shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <p className="font-display text-sm font-semibold tracking-[0.16em] text-sand uppercase">
              Collect payments · YouLend-style
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Connect your POS. Choose how you repay.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65">
              Link Yusr to your payment terminals or gateway. Pick a share of
              each transaction — like 10% — and repay automatically as you sell.
              Quiet day? You repay less. Busy day? You catch up naturally.
            </p>
            <div className="mt-8">
              <ButtonLink href="/repayments" variant="light">
                Explore POS repayments
              </ButtonLink>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
              <p className="text-sm text-white/55">Repayment share</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {repaymentOptions.map((opt) => {
                  const active = opt.id === selected;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelected(opt.id)}
                      className={`rounded-full px-3 py-2 text-sm transition ${
                        active
                          ? "bg-paper-elev text-ink"
                          : "bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {opt.label.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-white/55">{option.detail}</p>

              <div className="mt-8 space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/45">
                      Sample sale
                    </p>
                    <p className="font-display text-3xl font-semibold">
                      AED {sale.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-white/55">{pct}% sweep</p>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-sand"
                    animate={{ width: `${pct * 5}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    style={{ maxWidth: "100%" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-white/45">To Yusr</p>
                    <p className="font-display text-xl font-semibold text-sand">
                      AED {sweep}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/45">To your account</p>
                    <p className="font-display text-xl font-semibold">
                      AED {keep}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
