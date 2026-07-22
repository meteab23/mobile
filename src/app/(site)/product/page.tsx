import type { Metadata } from "next";
import {
  ArrowRight,
  Boxes,
  Store,
  Cpu,
  Building2,
  Gauge,
  FileText,
  Globe2,
  Lock,
  Braces,
  Webhook,
  Terminal,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeader } from "@/components/marketing/primitives";
import { Reveal } from "@/components/marketing/Reveal";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { CTA } from "@/components/marketing/CTA";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Vela is the complete B2B Buy Now, Pay Later platform — instant underwriting, upfront payouts, and automated collections in one integration.",
};

const capabilities = [
  {
    icon: Gauge,
    title: "Instant underwriting",
    body: "Real-time credit decisions on every buyer using thousands of B2B signals — approvals in under 3 seconds.",
  },
  {
    icon: FileText,
    title: "Automated invoicing",
    body: "Branded invoices, reminders and dunning handled end-to-end so your finance team never chases a payment.",
  },
  {
    icon: Globe2,
    title: "Global payouts",
    body: "Settle in 30+ markets and multiple currencies with a single reconciliation feed.",
  },
  {
    icon: Lock,
    title: "Fraud & risk cover",
    body: "We take on 100% of the credit and fraud risk. Approved orders are guaranteed paid.",
  },
];

const useCases = [
  {
    icon: Store,
    title: "Marketplaces",
    body: "Give every seller net terms without holding the risk on your balance sheet.",
    tint: "var(--mint)",
  },
  {
    icon: Boxes,
    title: "Wholesale & distribution",
    body: "Replace manual trade credit and paper invoices with instant terms at checkout.",
    tint: "var(--sky)",
  },
  {
    icon: Cpu,
    title: "SaaS & software",
    body: "Offer flexible billing terms on annual contracts and expansion deals.",
    tint: "var(--peach)",
  },
  {
    icon: Building2,
    title: "Enterprise",
    body: "Custom credit limits, PO matching, and dedicated underwriting for large accounts.",
    tint: "var(--brand-soft)",
  },
];

const integrations = [
  { icon: Braces, title: "Drop-in checkout", body: "Add the Vela button with a few lines of code." },
  { icon: Webhook, title: "Webhooks", body: "React to approvals, payouts and settlements in real time." },
  { icon: Terminal, title: "Full REST API", body: "Build fully custom B2B payment flows end to end." },
];

export default function ProductPage() {
  return (
    <>
      <PageHero
        eyebrow="The platform"
        title={
          <>
            Everything you need to sell on{" "}
            <span className="text-brand">net terms</span>
          </>
        }
        subtitle="Underwriting, upfront payouts, invoicing and collections — the entire B2B payment stack in one integration."
      >
        <ButtonLink href="/checkout" size="lg">
          Try the checkout demo
          <ArrowRight size={18} />
        </ButtonLink>
        <ButtonLink href="/pricing" variant="secondary" size="lg">
          See pricing
        </ButtonLink>
      </PageHero>

      {/* Capabilities */}
      <section className="container-x py-24">
        <Reveal>
          <SectionHeader
            eyebrow="Capabilities"
            title="One integration, the whole payment lifecycle"
            subtitle="Vela handles the parts of B2B payments that slow you down, so you can focus on selling."
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 70}>
              <div className="flex h-full gap-5 rounded-[22px] border border-line bg-white p-7">
                <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-brand-soft">
                  <c.icon size={22} className="text-brand" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{c.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                    {c.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <HowItWorks />

      {/* Use cases */}
      <section className="container-x py-24">
        <Reveal>
          <SectionHeader
            center
            eyebrow="Solutions"
            title="Built for every kind of B2B seller"
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((u, i) => (
            <Reveal key={u.title} delay={i * 70}>
              <div className="h-full rounded-[22px] border border-line bg-white p-7">
                <div
                  className="grid h-12 w-12 place-items-center rounded-2xl"
                  style={{ background: u.tint }}
                >
                  <u.icon size={22} className="text-ink" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-ink">
                  {u.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                  {u.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Developers / integration */}
      <section className="container-x pb-24">
        <div className="grid items-center gap-14 rounded-[28px] border border-line bg-white p-8 lg:grid-cols-2 lg:p-12">
          <Reveal>
            <div>
              <p className="eyebrow mb-4 text-brand">For developers</p>
              <h2 className="display text-[clamp(1.8rem,3.6vw,2.6rem)] text-ink">
                Integrate in an afternoon
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-muted">
                Whether you want a drop-in button or a fully bespoke flow, Vela
                meets your stack where it is.
              </p>
              <div className="mt-8 space-y-4">
                {integrations.map((it) => (
                  <div key={it.title} className="flex items-start gap-4">
                    <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-soft">
                      <it.icon size={17} className="text-brand" />
                    </span>
                    <div>
                      <p className="font-medium text-ink">{it.title}</p>
                      <p className="text-[15px] text-ink-muted">{it.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <CodeCard />
          </Reveal>
        </div>
      </section>

      <CTA />
    </>
  );
}

function CodeCard() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-white/10 bg-ink text-sm shadow-[var(--shadow-lg)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-white/20" />
        <span className="h-3 w-3 rounded-full bg-white/20" />
        <span className="h-3 w-3 rounded-full bg-white/20" />
        <span className="ml-2 font-mono text-xs text-white/40">
          create-order.ts
        </span>
      </div>
      <pre className="scroll-slim overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-white/80">
        <code>{`import { Vela } from "@vela/node";

const vela = new Vela(process.env.VELA_KEY);

// Offer net terms & get paid upfront
const order = await vela.orders.create({
  amount: 12480_00,
  currency: "EUR",
  buyer: { taxId: "DE123456789" },
  terms: ["net30", "net60"],
});

console.log(order.status);
// -> "approved"  ✓ settled to you in 1 day`}</code>
      </pre>
    </div>
  );
}
