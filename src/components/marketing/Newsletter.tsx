"use client";

import { FormEvent, useState } from "react";
import { FadeIn } from "./FadeIn";

export function Newsletter() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section className="section-pad">
      <div className="container-narrow">
        <FadeIn>
          <div className="rounded-[1.75rem] border border-line bg-surface px-6 py-10 md:px-12 md:py-14">
            <p className="text-sm font-semibold tracking-[0.14em] text-accent uppercase">
              Stay up to date
            </p>
            <h2 className="font-display mt-4 max-w-xl text-3xl tracking-[-0.04em] text-ink md:text-4xl text-balance">
              Interested in learning more about Stride?
            </h2>
            <p className="mt-3 max-w-lg text-muted">
              Product updates and B2B payment insights—straight to your inbox.
            </p>

            {sent ? (
              <p className="mt-8 text-accent">Thanks—you&apos;re on the list.</p>
            ) : (
              <form
                onSubmit={onSubmit}
                className="mt-8 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
              >
                <input
                  required
                  name="company"
                  placeholder="Company name"
                  className="rounded-full border border-line bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Work email"
                  className="rounded-full border border-line bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
                />
                <button type="submit" className="btn-accent">
                  Submit
                </button>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
