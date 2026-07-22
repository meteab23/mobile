import { Wallet, ShieldCheck, TrendingUp } from "lucide-react";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

const items = [
  {
    icon: Wallet,
    title: "Get paid upfront",
    body: "Receive the full order value within one business day — even while your buyer pays on 30, 60 or 90-day terms.",
    tint: "var(--mint)",
  },
  {
    icon: ShieldCheck,
    title: "Zero risk, zero collections",
    body: "We underwrite every buyer and take on 100% of the credit and fraud risk. If a buyer doesn't pay, you keep your money.",
    tint: "var(--sky)",
  },
  {
    icon: TrendingUp,
    title: "Grow order value",
    body: "Sellers on Vela see up to 40% higher average order value and 20% more repeat purchases from business buyers.",
    tint: "var(--peach)",
  },
];

export function ValueProps() {
  return (
    <section className="container-x py-24">
      <Reveal>
        <SectionHeader
          eyebrow="Why Vela"
          title="The payment method that grows your B2B revenue"
          subtitle="Everything about B2B payments — net terms, underwriting, invoicing and collections — handled in a single checkout."
        />
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 80}>
            <div className="group h-full rounded-[22px] border border-line bg-white p-7 transition-shadow hover:shadow-[var(--shadow-md)]">
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{ background: it.tint }}
              >
                <it.icon size={22} className="text-ink" />
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">
                {it.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                {it.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
