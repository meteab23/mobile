import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { GradientMesh, GradientPicture } from "@/components/marketing/GradientArt";
import { brand } from "@/lib/data";

export function Hero() {
  return (
    <section className="relative min-h-[min(100svh,920px)] overflow-hidden">
      <GradientMesh />
      <div className="shell relative section-pad flex min-h-[min(100svh,920px)] flex-col justify-center !pb-16 !pt-14 lg:!pt-20">
        <div className="max-w-3xl">
          <p className="animate-fade-up font-display text-sm font-semibold tracking-[0.18em] text-accent-deep uppercase">
            {brand.name}
          </p>
          <h1 className="animate-fade-up mt-5 font-display text-[clamp(2.75rem,7vw,5.25rem)] font-semibold leading-[0.98] tracking-tight text-ink text-balance [animation-delay:80ms]">
            The new standard for B2B payments in the UAE
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-ink-muted [animation-delay:140ms]">
            Offer Account Trade today — with Pay Later (30 / 60 / 90) and
            Installments (3 / 4 / 6) on the way. Get paid upfront. Connect your
            POS and repay as you sell.
          </p>
          <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-3 [animation-delay:200ms]">
            <ButtonLink href="/demo" variant="accent">
              Book a demo
              <ArrowRight size={16} />
            </ButtonLink>
            <ButtonLink href="/products" variant="ghost">
              Explore products
            </ButtonLink>
          </div>
        </div>

        <div className="animate-fade-up mt-14 grid gap-5 lg:grid-cols-12 [animation-delay:280ms]">
          <GradientPicture
            className="min-h-[320px] lg:col-span-7 lg:min-h-[420px]"
            label="Account Trade · Live in UAE"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-rows-2 lg:gap-5">
            <div className="relative overflow-hidden rounded-[1.75rem] mesh-panel p-7 text-white shadow-lift">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sand/40 blur-2xl" />
              <p className="relative text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                Coming soon
              </p>
              <p className="relative mt-4 font-display text-2xl font-semibold">
                Pay Later
              </p>
              <p className="relative mt-2 text-sm text-white/70">
                Net 30 · 60 · 90 for every B2B channel.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-ink p-7 text-white shadow-lift">
              <div className="absolute inset-0 opacity-60 mesh-panel" />
              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                  Coming soon
                </p>
                <p className="mt-4 font-display text-2xl font-semibold">
                  Installments
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Split large purchases over 3, 4, or 6 months.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
