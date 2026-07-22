import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "./Reveal";

export function CTA() {
  return (
    <section className="container-x pb-24 pt-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] border border-line bg-ink px-8 py-16 text-white sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 noise opacity-[0.12]" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/50 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-lime/20 blur-[110px]" />

          <div className="relative max-w-2xl">
            <h2 className="display text-[clamp(2rem,4.5vw,3.4rem)]">
              Ready to sell on terms without the risk?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/60">
              Join the B2B sellers offering instant net terms at checkout. Go
              live in a day — no setup fees, no lock-in.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/product" variant="lime" size="lg">
                Get started
                <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink
                href="/pricing"
                size="lg"
                className="border border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                View pricing
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
