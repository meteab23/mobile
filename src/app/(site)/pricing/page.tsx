import type { Metadata } from "next";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeader } from "@/components/marketing/primitives";
import { Reveal } from "@/components/marketing/Reveal";
import { CTA } from "@/components/marketing/CTA";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transaction-based pricing for B2B Buy Now, Pay Later. No setup fees, no monthly minimums. Pay only when you get paid.",
};

const tiers = [
  {
    name: "Starter",
    tagline: "For sellers getting started with net terms.",
    price: "2.9%",
    unit: "+ €0.30 per transaction",
    highlight: false,
    cta: "Start for free",
    features: [
      "Upfront payouts on approved orders",
      "Net 30 terms for buyers",
      "Drop-in hosted checkout",
      "Automated invoicing & reminders",
      "Standard fraud & risk cover",
      "Email support",
    ],
  },
  {
    name: "Growth",
    tagline: "For scaling B2B sellers who want more flexibility.",
    price: "2.4%",
    unit: "+ €0.30 per transaction",
    highlight: true,
    cta: "Get started",
    features: [
      "Everything in Starter",
      "Net 30 / 60 / 90 terms",
      "Installment plans",
      "Full REST API & webhooks",
      "Multi-currency payouts",
      "Dynamic per-buyer credit limits",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For high-volume and complex B2B operations.",
    price: "Custom",
    unit: "volume-based rates",
    highlight: false,
    cta: "Talk to sales",
    features: [
      "Everything in Growth",
      "Custom credit limits & terms",
      "PO matching & reconciliation",
      "Dedicated underwriting",
      "SLA & solutions engineering",
      "Single sign-on (SSO)",
    ],
  },
];

const faqs = [
  {
    q: "When do I get paid?",
    a: "As soon as an order is approved, the full amount is settled to your account within one business day — regardless of the terms your buyer chooses.",
  },
  {
    q: "What if a buyer doesn't pay?",
    a: "That's on us. Vela underwrites every buyer and takes on 100% of the credit and fraud risk. Approved orders are guaranteed, so you keep your money.",
  },
  {
    q: "Are there any setup or monthly fees?",
    a: "No. There are no setup fees, no monthly minimums and no lock-in. You only pay a transaction fee when you get paid.",
  },
  {
    q: "How long does integration take?",
    a: "Most sellers are live within a day using the drop-in checkout. A fully custom API integration typically takes an afternoon.",
  },
  {
    q: "Which markets do you support?",
    a: "Vela supports business buyers across 30+ markets with multi-currency payouts and localized terms.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Pay only when <span className="text-brand">you get paid</span>
          </>
        }
        subtitle="Transparent, transaction-based pricing. No setup fees, no monthly minimums, no risk on your balance sheet."
      />

      {/* Tiers */}
      <section className="container-x -mt-8 pb-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div
                className={`flex h-full flex-col rounded-[24px] border p-8 ${
                  t.highlight
                    ? "border-brand bg-white shadow-[var(--shadow-lg)] ring-1 ring-brand"
                    : "border-line bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-ink">{t.name}</h3>
                  {t.highlight && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-xs font-medium text-white">
                      <Sparkles size={12} /> Popular
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[15px] text-ink-muted">{t.tagline}</p>

                <div className="mt-6">
                  <span className="display text-4xl text-ink">{t.price}</span>
                  <p className="mt-1 text-sm text-ink-muted">{t.unit}</p>
                </div>

                <ButtonLink
                  href="/product"
                  variant={t.highlight ? "primary" : "secondary"}
                  size="lg"
                  className="mt-6 w-full"
                >
                  {t.cta}
                  <ArrowRight size={17} />
                </ButtonLink>

                <ul className="mt-8 space-y-3.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-brand-soft">
                        <Check size={12} className="text-brand" />
                      </span>
                      <span className="text-[15px] text-ink-soft">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x py-24">
        <Reveal>
          <SectionHeader center eyebrow="FAQ" title="Questions, answered" />
        </Reveal>
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-line rounded-[22px] border border-line bg-white">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 50}>
              <details className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium text-ink">
                  {f.q}
                  <span className="grid h-7 w-7 flex-none place-items-center rounded-full border border-line text-ink-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}
