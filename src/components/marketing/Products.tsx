import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/marketing/FadeIn";
import { products } from "@/lib/data";

export function Products() {
  return (
    <section className="section-pad bg-paper-elev">
      <div className="shell">
        <FadeIn>
          <p className="font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
            Our products
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl text-balance">
            Made to delight your buyers — and free your cash flow
          </h2>
        </FadeIn>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {products.map((product, i) => (
            <FadeIn key={product.slug} delay={i * 0.08}>
              <Link
                href={`/products/${product.slug}`}
                className="group flex h-full flex-col border-t border-line pt-8 transition hover:border-accent"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      product.status === "live"
                        ? "bg-accent-soft text-accent-deep"
                        : "bg-paper-soft text-ink-muted"
                    }`}
                  >
                    {product.status === "live" ? "Live" : "Coming soon"}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-ink-muted transition group-hover:text-accent"
                  />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-ink">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  {product.terms.join(" · ")}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">
                  {product.summary}
                </p>
                <span className="mt-8 text-sm font-medium text-accent">
                  How it works & pricing →
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
