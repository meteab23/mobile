"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/marketing/SiteNav";

const plans = [
  {
    id: "pay-later",
    title: "Pay Later",
    subtitle: "Pay in 30 days",
    detail: "Full amount due in 30 days. No fees for the buyer.",
  },
  {
    id: "pay-in-x",
    title: "Pay in 3",
    subtitle: "3 interest-free installments",
    detail: "Split €4,800 into three payments of €1,600.",
  },
  {
    id: "pay-on-account",
    title: "Pay on Account",
    subtitle: "Open account · Net 60",
    detail: "Use your revolving credit line. Limit refreshed monthly.",
  },
];

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const initial =
    plans.find((p) => p.id === searchParams.get("product"))?.id ?? "pay-later";
  const [selected, setSelected] = useState(initial);
  const [step, setStep] = useState<"choose" | "approved">("choose");

  const plan = useMemo(
    () => plans.find((p) => p.id === selected) ?? plans[0],
    [selected],
  );

  return (
    <>
      <SiteNav />
      <main className="atmosphere noise min-h-screen pt-24 pb-16">
        <div className="container-narrow px-5 md:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-sm font-semibold tracking-[0.14em] text-accent uppercase">
              Buyer checkout
            </p>
            <h1 className="font-display mt-3 text-center text-3xl tracking-[-0.04em] text-ink md:text-4xl text-balance">
              Complete your order with Stride
            </h1>

            <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-[0_30px_70px_-40px_rgba(11,13,12,0.45)]">
              <div className="border-b border-line bg-bg px-5 py-4 md:px-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted">Meridian Goods · Order #48219</p>
                    <p className="font-display mt-1 text-2xl tracking-[-0.03em] text-ink">
                      €4,800.00
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                    <ShieldCheck size={13} />
                    Buyer protection
                  </div>
                </div>
              </div>

              {step === "choose" ? (
                <div className="p-5 md:p-7">
                  <p className="text-sm font-semibold text-ink">Choose how to pay</p>
                  <div className="mt-4 space-y-3">
                    {plans.map((item) => {
                      const active = item.id === selected;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelected(item.id)}
                          className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                            active
                              ? "border-accent bg-accent-soft/50"
                              : "border-line hover:border-[#b8c2bb]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-ink">{item.title}</p>
                              <p className="mt-0.5 text-sm text-muted">{item.subtitle}</p>
                              <p className="mt-2 text-sm text-muted">{item.detail}</p>
                            </div>
                            <span
                              className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${
                                active
                                  ? "border-accent bg-accent text-white"
                                  : "border-line"
                              }`}
                            >
                              {active ? <Check size={12} /> : null}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className="btn-primary mt-6 w-full"
                    onClick={() => setStep("approved")}
                  >
                    Continue with {plan.title}
                  </button>
                  <p className="mt-3 text-center text-xs text-muted">
                    Instant decision · Merchant paid today · You pay later
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center md:p-12">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Check size={28} />
                  </div>
                  <h2 className="font-display mt-5 text-2xl tracking-[-0.03em] text-ink">
                    Approved in 1.2 seconds
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-muted">
                    {plan.title} is confirmed. Meridian Goods is settled instantly.
                    Your repayment schedule is ready.
                  </p>
                  <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-bg px-4 py-4 text-left text-sm">
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted">Product</span>
                      <span className="font-semibold text-ink">{plan.title}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted">Order total</span>
                      <span className="font-semibold text-ink">€4,800</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted">Merchant payout</span>
                      <span className="font-semibold text-accent">Today</span>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link href="/dashboard" className="btn-primary">
                      View merchant dashboard
                    </Link>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setStep("choose")}
                    >
                      Try another term
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
