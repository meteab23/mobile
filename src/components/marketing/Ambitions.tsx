import { FadeIn } from "./FadeIn";

const ambitions = [
  {
    title: "Grow revenues",
    copy: "Reach double-digit sales growth and increase buyer satisfaction—risk free.",
  },
  {
    title: "Modernize operations",
    copy: "Cut cost from payment operations by up to 25% with automated underwriting and collections.",
  },
  {
    title: "Expand footprint",
    copy: "Tap into new markets, channels, and customer segments with zero extra credit risk.",
  },
];

export function Ambitions() {
  return (
    <section className="section-pad">
      <div className="container-narrow">
        <FadeIn>
          <p className="text-sm font-semibold tracking-[0.14em] text-accent uppercase">
            Made for your ambitions
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl tracking-[-0.04em] text-ink md:text-5xl text-balance">
            Growth without the credit headache.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {ambitions.map((item, i) => (
            <FadeIn key={item.title} delay={0.08 * i}>
              <div className="border-t border-line pt-6">
                <h3 className="font-display text-xl tracking-[-0.03em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{item.copy}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
