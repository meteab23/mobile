import type { Metadata } from "next";
import { FadeIn } from "@/components/marketing/FadeIn";
import { CtaBand } from "@/components/marketing/CtaBand";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Yusr delivers B2B BNPL for UAE merchants — from checkout to payout to POS repayment.",
};

const pillars = [
  {
    step: "01",
    title: "Integrate once",
    body: "Add Yusr via API, plugin, or payment-link for online, telesales, and in-person orders.",
  },
  {
    step: "02",
    title: "Buyers choose flexibility",
    body: "Offer Account Trade today; Pay Later (30/60/90) and Installments (3/4/6) follow shortly.",
  },
  {
    step: "03",
    title: "Instant underwriting",
    body: "UAE-aware credit and fraud checks return a decision in seconds — no paperwork pile.",
  },
  {
    step: "04",
    title: "You get paid upfront",
    body: "Ship with confidence. Yusr settles you on the payout schedule you agree.",
  },
  {
    step: "05",
    title: "We collect — or you repay via POS",
    body: "Buyers settle statements with Yusr. Optionally connect POS and repay balances as a % of sales.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="section-pad mesh-soft">
        <div className="shell max-w-3xl">
          <FadeIn>
            <p className="font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
              How it works
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl text-balance">
              B2B payments as simple as modern checkout
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              Inspired by Billie and Mondu’s merchant journeys — localized for
              UAE trade, free zones, and AED settlement.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad !pt-0">
        <div className="shell space-y-0">
          {pillars.map((item, i) => (
            <FadeIn key={item.step} delay={i * 0.05}>
              <div className="grid gap-4 border-t border-line py-10 md:grid-cols-[6rem_1fr] md:gap-10">
                <p className="font-display text-sm font-semibold text-accent">
                  {item.step}
                </p>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    {item.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        <div className="shell mt-4">
          <ButtonLink href="/demo" variant="accent">
            Book a walkthrough
          </ButtonLink>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
