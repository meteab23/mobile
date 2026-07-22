import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

const quotes = [
  {
    quote:
      "We turned on Vela and average order value jumped 38% in the first quarter. Buyers finally get the terms they expect, and we never wait on cash.",
    name: "Marta Kowalski",
    role: "CFO, Meridian Supply",
    accent: "var(--mint)",
  },
  {
    quote:
      "Underwriting used to take our team days per account. Now it's instant at checkout and the risk isn't ours. It's a completely different business.",
    name: "David Osei",
    role: "Head of Revenue, Foundry Co.",
    accent: "var(--sky)",
  },
  {
    quote:
      "The integration took an afternoon. Collections, reminders, reconciliation — all gone from our plate. Our finance team got their week back.",
    name: "Lena Bergström",
    role: "COO, Brightwell",
    accent: "var(--peach)",
  },
];

export function Testimonials() {
  return (
    <section className="container-x py-24">
      <Reveal>
        <SectionHeader
          center
          eyebrow="Customers"
          title="B2B sellers grow faster on Vela"
        />
      </Reveal>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {quotes.map((q, i) => (
          <Reveal key={q.name} delay={i * 90}>
            <figure className="flex h-full flex-col rounded-[22px] border border-line bg-white p-7">
              <div
                className="h-1.5 w-10 rounded-full"
                style={{ background: q.accent }}
              />
              <blockquote className="mt-6 flex-1 text-[17px] leading-relaxed text-ink">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-6">
                <span
                  className="grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-ink"
                  style={{ background: q.accent }}
                >
                  {q.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{q.name}</p>
                  <p className="text-sm text-ink-muted">{q.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
