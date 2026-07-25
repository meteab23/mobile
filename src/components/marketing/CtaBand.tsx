import { FadeIn } from "@/components/marketing/FadeIn";
import { ButtonLink } from "@/components/ui/Button";

export function CtaBand() {
  return (
    <section className="section-pad">
      <div className="shell">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] px-8 py-14 text-white sm:px-12 sm:py-16">
            <div className="absolute inset-0 mesh-panel" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sand/40 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky/40 blur-3xl" />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
                Get started your way. Today.
              </h2>
              <p className="mt-4 text-base text-white/70">
                Launch Account Trade in your checkout, join the waitlist for Pay
                Later and Installments, or connect POS repayments in a single
                conversation with our UAE team.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/demo" variant="light">
                  Book a demo
                </ButtonLink>
                <ButtonLink
                  href="/products/account-trade"
                  variant="ghost"
                  className="!border-white/25 !text-white hover:!bg-white/10"
                >
                  See Account Trade
                </ButtonLink>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
