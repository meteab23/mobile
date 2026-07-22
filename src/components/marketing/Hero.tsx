import { ArrowRight, ShieldCheck, Zap, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Pill } from "./primitives";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-70" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-soft blur-[120px] opacity-60" />

      <div className="container-x relative grid gap-14 pt-16 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-24 lg:pb-28">
        <div>
          <Reveal>
            <Pill>
              <span className="grid h-4 w-4 place-items-center rounded-full bg-brand text-white">
                <Zap size={10} />
              </span>
              B2B Buy Now, Pay Later
            </Pill>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="display mt-6 text-[clamp(2.6rem,6vw,4.6rem)] text-ink">
              Get paid upfront.
              <br />
              Let customers{" "}
              <span className="relative whitespace-nowrap text-brand">
                pay later
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2 9c40-7 120-9 196-3"
                    stroke="var(--lime)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">
              Vela is the payment method built for B2B. Offer your business
              buyers flexible net terms at checkout. We pay you immediately and
              take on the credit risk, fraud, and collections.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/product" size="lg">
                Start selling on terms
                <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="/checkout" variant="secondary" size="lg">
                Try the checkout demo
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={16} className="text-pos" />
                100% payout protection
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-pos" />
                Live in a day
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-pos" />
                No setup fees
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <HeroCheckoutCard />
        </Reveal>
      </div>
    </section>
  );
}

function HeroCheckoutCard() {
  const terms = [
    { label: "Pay in 30 days", meta: "0% for buyer", active: true },
    { label: "Pay in 60 days", meta: "1.5% fee" },
    { label: "3 monthly installments", meta: "from 0.9%/mo" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -right-6 -top-6 hidden animate-floaty rounded-2xl border border-line bg-white px-4 py-3 shadow-[var(--shadow-md)] sm:block">
        <p className="text-xs text-ink-muted">Paid to you today</p>
        <p className="text-lg font-semibold text-ink">€ 12,480.00</p>
      </div>

      <div className="rounded-[26px] border border-line bg-white p-6 shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-ink-muted">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-ink text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 5l8 14L20 5"
                  stroke="#fff"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Pay with Vela
          </div>
          <span className="rounded-full bg-mint px-2.5 py-1 text-xs font-medium text-pos">
            Approved
          </span>
        </div>

        <div className="mt-6 rounded-2xl bg-bg p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-ink-muted">Order total</span>
            <span className="font-mono text-sm text-ink-muted">Net terms</span>
          </div>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">
            € 12,480.00
          </p>
        </div>

        <div className="mt-5 space-y-2.5">
          {terms.map((t) => (
            <div
              key={t.label}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                t.active
                  ? "border-brand bg-brand-soft/60"
                  : "border-line bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full border ${
                    t.active
                      ? "border-brand bg-brand"
                      : "border-line-strong bg-white"
                  }`}
                >
                  {t.active && <Check size={12} className="text-white" />}
                </span>
                <span className="text-[15px] font-medium text-ink">
                  {t.label}
                </span>
              </div>
              <span className="text-sm text-ink-muted">{t.meta}</span>
            </div>
          ))}
        </div>

        <button className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand font-medium text-white transition-colors hover:bg-brand-strong">
          Confirm order
          <ArrowRight size={18} />
        </button>
        <p className="mt-3 text-center text-xs text-ink-muted">
          Buyer approved instantly · Seller paid upfront
        </p>
      </div>
    </div>
  );
}
