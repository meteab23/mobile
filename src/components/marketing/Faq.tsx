import { FadeIn } from "@/components/marketing/FadeIn";
import { faqs } from "@/lib/data";

export function Faq() {
  return (
    <section id="faq" className="section-pad mesh-soft">
      <div className="shell">
        <FadeIn>
          <p className="font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
            FAQ
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Answers, plainly
          </h2>
        </FadeIn>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {faqs.map((item, i) => (
            <FadeIn key={item.q} delay={i * 0.05}>
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-ink">
                  {item.q}
                  <span className="text-ink-muted transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
                  {item.a}
                </p>
              </details>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
