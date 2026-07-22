import { Reveal } from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Buyer picks Vela at checkout",
    body: "Your business customer selects net terms. We run an instant credit decision — no forms, no waiting.",
  },
  {
    n: "02",
    title: "Instant approval",
    body: "We underwrite the buyer in real time using thousands of B2B data signals. Approval decisions land in under 3 seconds.",
  },
  {
    n: "03",
    title: "You get paid upfront",
    body: "The full order amount is settled to your account within one business day. We manage the invoice for the buyer.",
  },
  {
    n: "04",
    title: "We handle the rest",
    body: "Reminders, dunning, and collections are all on us. The buyer pays Vela on their agreed terms.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white">
      <div className="pointer-events-none absolute inset-0 noise opacity-[0.12]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[420px] w-[560px] rounded-full bg-brand/40 blur-[130px]" />

      <div className="container-x relative">
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow mb-4 text-lime">How it works</p>
            <h2 className="display text-[clamp(1.9rem,4vw,3rem)]">
              From checkout to cash in four steps
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/60">
              A single integration turns net terms from a back-office headache
              into a growth lever.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[24px] border border-white/10 bg-white/5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="h-full bg-ink p-8">
                <span className="font-mono text-sm text-lime">{s.n}</span>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/55">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
