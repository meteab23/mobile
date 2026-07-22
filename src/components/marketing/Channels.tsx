import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "./FadeIn";

const channels = [
  {
    title: "Online store",
    copy: "Offer flexible payment terms in your webshop with a one-line integration.",
  },
  {
    title: "Telesales",
    copy: "Quote Net terms on phone orders and get instant credit decisions.",
  },
  {
    title: "In-person",
    copy: "Extend Pay Later in-store or on the road—without paper invoices.",
  },
];

export function Channels() {
  return (
    <section id="channels" className="section-pad bg-bg-elevated">
      <div className="container-narrow">
        <FadeIn>
          <p className="text-sm font-semibold tracking-[0.14em] text-accent uppercase">
            Made for any channel
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl tracking-[-0.04em] text-ink md:text-5xl text-balance">
            Omnichannel B2B terms.
          </h2>
        </FadeIn>

        <div className="mt-12 space-y-0">
          {channels.map((channel, i) => (
            <FadeIn key={channel.title} delay={0.05 * i}>
              <div className="grid items-center gap-4 border-t border-line py-8 md:grid-cols-[0.8fr_1.4fr_auto] md:gap-8">
                <h3 className="font-display text-2xl tracking-[-0.03em] text-ink">
                  {channel.title}
                </h3>
                <p className="text-[1rem] leading-relaxed text-muted">{channel.copy}</p>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-ink"
                >
                  Learn more
                  <ArrowRight size={14} />
                </Link>
              </div>
            </FadeIn>
          ))}
          <div className="border-t border-line" />
        </div>
      </div>
    </section>
  );
}
