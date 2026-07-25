import { FadeIn } from "@/components/marketing/FadeIn";
import { ButtonLink } from "@/components/ui/Button";
import { channels } from "@/lib/data";

export function Channels() {
  return (
    <section className="section-pad">
      <div className="shell">
        <FadeIn>
          <p className="font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
            Omnichannel
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl text-balance">
            Made for every sales channel
          </h2>
        </FadeIn>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {channels.map((channel, i) => (
            <FadeIn key={channel.title} delay={i * 0.08}>
              <div className="border-l border-line pl-6">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {channel.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {channel.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="mt-12">
          <ButtonLink href="/repayments" variant="ghost">
            See POS-connected repayments →
          </ButtonLink>
        </FadeIn>
      </div>
    </section>
  );
}
