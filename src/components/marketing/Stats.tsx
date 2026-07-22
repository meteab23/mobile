import { Reveal } from "./Reveal";

const stats = [
  { v: "+40%", k: "Average order value uplift" },
  { v: "94%", k: "Instant buyer approval rate" },
  { v: "1 day", k: "Time to get paid" },
  { v: "30+", k: "Markets supported" },
];

export function Stats() {
  return (
    <section className="container-x py-8">
      <div className="grid gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.k} delay={i * 70}>
            <div className="h-full bg-white p-8">
              <p className="display text-[clamp(2.2rem,4vw,3.2rem)] text-brand">
                {s.v}
              </p>
              <p className="mt-2 text-[15px] text-ink-muted">{s.k}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
