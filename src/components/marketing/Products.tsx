import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { products } from "@/lib/data";
import { FadeIn } from "./FadeIn";

export function Products() {
  return (
    <section id="products" className="section-pad atmosphere-dark text-[#f4f6f4]">
      <div className="container-narrow">
        <FadeIn>
          <p className="text-sm font-semibold tracking-[0.14em] text-accent-bright uppercase">
            Our products
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl tracking-[-0.04em] md:text-5xl text-balance">
            Made to delight your customers
          </h2>
          <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-white/60">
            Flexible B2B payment terms that feel instant at checkout and invisible in your
            back office.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {products.map((product, i) => (
            <FadeIn key={product.slug} delay={0.08 * i}>
              <Link
                href={`/checkout/demo?product=${product.slug}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-accent-bright/40 hover:bg-white/[0.06]"
              >
                <div>
                  <p className="text-xs tracking-[0.16em] text-white/40 uppercase">
                    0{i + 1}
                  </p>
                  <h3 className="font-display mt-5 text-2xl tracking-[-0.03em]">
                    {product.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-white/55">
                    {product.summary}
                  </p>
                </div>
                <span className="mt-8 inline-flex items-center gap-1 text-sm text-accent-bright">
                  See checkout
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
