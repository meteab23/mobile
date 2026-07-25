import { FadeIn } from "@/components/marketing/FadeIn";
import { stats } from "@/lib/data";

export function Stats() {
  return (
    <section className="section-pad">
      <div className="shell">
        <FadeIn>
          <p className="font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
            Built for UAE trade
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl text-balance">
            Chart new territories across the Emirates
          </h2>
        </FadeIn>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.06}>
              <p className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-ink-muted">{stat.label}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
