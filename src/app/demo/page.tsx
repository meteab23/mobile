"use client";

import { FormEvent, useState } from "react";
import { FadeIn } from "@/components/marketing/FadeIn";
import { Button } from "@/components/ui/Button";

export default function DemoPage() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="section-pad mesh-soft">
      <div className="shell grid gap-12 lg:grid-cols-2 lg:items-start">
        <FadeIn>
          <p className="font-display text-sm font-semibold tracking-[0.16em] text-accent uppercase">
            Book a demo
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl text-balance">
            See Yusr on your checkout and POS
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            Tell us about your sales channels. We’ll show Account Trade live,
            preview Pay Later & Installments, and model POS repayment shares
            for your volume.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ink-muted">
            <li>· 30-minute session with our UAE solutions team</li>
            <li>· Tailored pricing sketch in AED</li>
            <li>· Integration options for your stack</li>
          </ul>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-[1.75rem] border border-line bg-paper-elev p-6 shadow-soft sm:p-8">
            {submitted ? (
              <div className="py-10 text-center">
                <p className="font-display text-2xl font-semibold text-ink">
                  Thanks — we received your request.
                </p>
                <p className="mt-3 text-sm text-ink-muted">
                  A Yusr specialist will reach out shortly at the email you
                  provided.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <Field label="Company name" name="company" required />
                <Field label="Work email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" />
                <label className="block text-sm text-ink-soft">
                  Monthly B2B volume (AED)
                  <select
                    name="volume"
                    className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-accent"
                    defaultValue="1-5m"
                  >
                    <option value="<1m">Under 1M</option>
                    <option value="1-5m">1M – 5M</option>
                    <option value="5-20m">5M – 20M</option>
                    <option value="20m+">20M+</option>
                  </select>
                </label>
                <label className="block text-sm text-ink-soft">
                  Interested in
                  <select
                    name="interest"
                    className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-accent"
                    defaultValue="account-trade"
                  >
                    <option value="account-trade">Account Trade</option>
                    <option value="pay-later">Pay Later waitlist</option>
                    <option value="installments">Installments waitlist</option>
                    <option value="pos">POS repayments</option>
                    <option value="all">Full platform</option>
                  </select>
                </label>
                <label className="block text-sm text-ink-soft">
                  Message
                  <textarea
                    name="message"
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-accent"
                    placeholder="Channels, ERP, POS provider…"
                  />
                </label>
                <Button type="submit" variant="accent" className="w-full">
                  Request demo
                </Button>
                <p className="text-xs text-ink-muted">
                  By submitting, you agree to be contacted about Yusr products.
                  No spam — unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm text-ink-soft">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-accent"
      />
    </label>
  );
}
