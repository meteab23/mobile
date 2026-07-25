import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/marketing/FadeIn";
import { GradientPicture } from "@/components/marketing/GradientArt";
import { CtaBand } from "@/components/marketing/CtaBand";
import { ButtonLink } from "@/components/ui/Button";
import { getProduct, products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return params.then(({ slug }) => {
    const product = getProduct(slug);
    if (!product) return {};
    return {
      title: product.name,
      description: product.summary,
    };
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== product.slug);

  return (
    <>
      <section className="relative overflow-hidden section-pad !pb-12">
        <div className="pointer-events-none absolute inset-0 mesh-soft" />
        <div className="shell relative grid items-end gap-10 lg:grid-cols-2">
          <FadeIn>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                product.status === "live"
                  ? "bg-accent-soft text-accent-deep"
                  : "bg-paper-soft text-ink-muted"
              }`}
            >
              {product.eyebrow}
            </span>
            <p className="mt-6 font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
              {product.name}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl text-balance">
              {product.headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              {product.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {product.terms.map((term) => (
                <span
                  key={term}
                  className="rounded-full border border-line bg-paper-elev px-3 py-1 text-sm text-ink-soft"
                >
                  {term}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/demo" variant="accent">
                {product.status === "live" ? "Get started" : "Join waitlist"}
              </ButtonLink>
              <ButtonLink href="#how-it-works" variant="ghost">
                How it works
              </ButtonLink>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <GradientPicture
              className="min-h-[340px] lg:min-h-[420px]"
              label={`${product.name} · UAE`}
            />
          </FadeIn>
        </div>
      </section>

      <section className="section-pad bg-paper-elev !py-16">
        <div className="shell grid gap-10 md:grid-cols-3">
          {product.highlights.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <h2 className="font-display text-xl font-semibold text-ink">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="section-pad">
        <div className="shell">
          <FadeIn>
            <p className="font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Simple for buyers. Safe for merchants.
            </h2>
          </FadeIn>
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {product.howItWorks.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.07}>
                <p className="font-display text-sm font-semibold text-accent">
                  {step.step}
                </p>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="section-pad mesh-soft">
        <div className="shell grid gap-12 lg:grid-cols-2">
          <FadeIn>
            <p className="font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
              Pricing
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Transparent, volume-aware pricing
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Like Billie and Mondu, Yusr prices as a merchant discount rate —
              comparable to card fees — while buyers get flexible terms.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-[1.75rem] border border-line bg-paper-elev p-8 shadow-soft">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-muted">
                    Merchant
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-ink">
                    {product.pricing.merchant}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-muted">
                    Buyer
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold text-ink">
                    {product.pricing.buyer}
                  </p>
                </div>
              </div>
              <ul className="mt-8 space-y-3 border-t border-line pt-6">
                {product.pricing.notes.map((note) => (
                  <li
                    key={note}
                    className="text-sm leading-relaxed text-ink-muted"
                  >
                    · {note}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad !py-16">
        <div className="shell">
          <FadeIn>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Why merchants choose {product.name}
            </h2>
          </FadeIn>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {product.benefits.map((benefit, i) => (
              <FadeIn key={benefit} delay={i * 0.05}>
                <li className="border-l border-accent/40 pl-5 text-sm leading-relaxed text-ink-soft">
                  {benefit}
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-pad !pt-0">
        <div className="shell">
          <p className="font-display text-sm font-semibold tracking-[0.16em] text-ink-muted uppercase">
            More products
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group rounded-[1.25rem] border border-line bg-paper-elev p-6 transition hover:border-accent"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {p.name}
                  </h3>
                  <span className="text-xs text-ink-muted">
                    {p.status === "live" ? "Live" : "Coming soon"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-muted">{p.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
