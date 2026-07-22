import { FadeIn } from "./FadeIn";

const stats = [
  {
    value: "+1.3M",
    label: "Buyers",
    copy: "Businesses already purchasing with flexible Stride terms across Europe.",
  },
  {
    value: "+€3B",
    label: "Processed",
    copy: "Transaction volume settled through the Stride payment network.",
  },
  {
    value: "+9,000",
    label: "Merchants",
    copy: "Active partners running Pay Later, Pay in X, and open account.",
  },
];

export function Stats() {
  return (
    <section className="section-pad">
      <div className="container-narrow">
        <FadeIn>
          <p className="text-sm font-semibold tracking-[0.14em] text-accent uppercase">
            Chart new territories
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl tracking-[-0.04em] text-ink md:text-5xl text-balance">
            Unlock cross-border B2B trade.
          </h2>
        </FadeIn>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={0.08 * i}>
              <p className="font-display text-5xl tracking-[-0.05em] text-ink md:text-6xl">
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-semibold tracking-[0.12em] text-accent uppercase">
                {stat.label}
              </p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{stat.copy}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
