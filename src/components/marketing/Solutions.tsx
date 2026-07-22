import { FadeIn } from "./FadeIn";

const solutions = [
  {
    title: "Ecommerce",
    copy: "For merchants selling directly to B2B customers online—with instant credit at checkout.",
  },
  {
    title: "Marketplaces",
    copy: "Connect third-party sellers and B2B buyers with shared risk cover and unified settlement.",
  },
  {
    title: "Platforms",
    copy: "Digital infrastructure for B2B software—embed flexible terms into your product.",
  },
];

export function Solutions() {
  return (
    <section id="solutions" className="section-pad">
      <div className="container-narrow">
        <FadeIn>
          <p className="text-sm font-semibold tracking-[0.14em] text-accent uppercase">
            Made for every business
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl tracking-[-0.04em] text-ink md:text-5xl text-balance">
            One payment layer. Every model.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {solutions.map((item, i) => (
            <FadeIn key={item.title} delay={0.06 * i} className="bg-surface p-7 md:p-8">
              <h3 className="font-display text-xl tracking-[-0.03em] text-ink">{item.title}</h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{item.copy}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
