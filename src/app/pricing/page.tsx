import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/marketing/FadeIn";
import { CtaBand } from "@/components/marketing/CtaBand";
import { products } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent MDR pricing for Account Trade, Pay Later, and Installments — plus POS repayment shares.",
};

export default function PricingPage() {
  return (
    <>
      <section className="section-pad mesh-soft">
        <div className="shell max-w-3xl">
          <FadeIn>
            <p className="font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
              Pricing
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl text-balance">
              Simple merchant pricing. Flexible buyer terms.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              Yusr charges a merchant discount rate comparable to card fees.
              Exact rates depend on industry, basket size, volume, and payout
              speed — always quoted in AED.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad !pt-0">
        <div className="shell grid gap-5 lg:grid-cols-3">
          {products.map((product, i) => (
            <FadeIn key={product.slug} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-[1.75rem] border border-line bg-paper-elev p-7">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-xl font-semibold text-ink">
                    {product.name}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      product.status === "live"
                        ? "bg-accent-soft text-accent-deep"
                        : "bg-paper-soft text-ink-muted"
                    }`}
                  >
                    {product.status === "live" ? "Live" : "Soon"}
                  </span>
                </div>
                <p className="mt-6 font-display text-3xl font-semibold text-ink">
                  {product.pricing.merchant}
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  {product.pricing.buyer}
                </p>
                <ul className="mt-6 flex-1 space-y-2 border-t border-line pt-5">
                  {product.pricing.notes.slice(0, 2).map((note) => (
                    <li key={note} className="text-sm text-ink-muted">
                      · {note}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/products/${product.slug}#pricing`}
                  className="mt-6 text-sm font-medium text-accent"
                >
                  Full product details →
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="section-pad !pt-0">
        <div className="shell rounded-[1.75rem] border border-line bg-ink p-8 text-paper-elev sm:p-10">
          <FadeIn>
            <h2 className="font-display text-2xl font-semibold">
              POS repayment shares
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
              When you finance settlement through sales-based repayment, you
              choose a sweep of typically 5–20% of each POS transaction. No
              separate interest clock — just a clear share of sales until the
              balance is clear.
            </p>
            <Link
              href="/repayments"
              className="mt-6 inline-flex text-sm font-medium text-sand"
            >
              Model your repayment →
            </Link>
          </FadeIn>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
