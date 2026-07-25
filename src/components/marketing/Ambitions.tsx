import { FadeIn } from "@/components/marketing/FadeIn";
import { ambitions } from "@/lib/data";

export function Ambitions() {
  return (
    <section className="section-pad mesh-soft">
      <div className="shell">
        <FadeIn>
          <p className="font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
            Made for your ambitions
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl text-balance">
            Grow sales. Cut payment ops. Expand across the Emirates.
          </h2>
        </FadeIn>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {ambitions.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <p className="font-display text-xs font-semibold tracking-[0.18em] text-ink-muted">
                0{i + 1}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
