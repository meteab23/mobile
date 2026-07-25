import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/marketing/FadeIn";
import { CtaBand } from "@/components/marketing/CtaBand";
import { products } from "@/lib/data";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Account Trade, Pay Later (30/60/90), and Installments (3/4/6) — Yusr’s B2B BNPL suite for the UAE.",
};

export default function ProductsIndexPage() {
  return (
    <>
      <section className="section-pad mesh-soft">
        <div className="shell max-w-3xl">
          <FadeIn>
            <p className="font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
              Products
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl text-balance">
              Flexible B2B payment products — built for UAE merchants
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              Start with Account Trade today. Pay Later and Installments are
              coming soon — each with clear how-it-works flows and transparent
              pricing.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad !pt-0">
        <div className="shell grid gap-6">
          {products.map((product, i) => (
            <FadeIn key={product.slug} delay={i * 0.06}>
              <Link
                href={`/products/${product.slug}`}
                className="group grid gap-6 rounded-[1.75rem] border border-line bg-paper-elev p-8 transition hover:border-accent sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-2xl font-semibold text-ink">
                      {product.name}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.status === "live"
                          ? "bg-accent-soft text-accent-deep"
                          : "bg-paper-soft text-ink-muted"
                      }`}
                    >
                      {product.status === "live" ? "Live" : "Coming soon"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink-muted">
                    {product.terms.join(" · ")}
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                    {product.summary}
                  </p>
                </div>
                <span className="text-sm font-medium text-accent group-hover:underline">
                  How it works & pricing →
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
