"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteNav } from "@/components/marketing/SiteNav";

export default function DemoPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <SiteNav />
      <main className="atmosphere noise min-h-screen pt-28 pb-20">
        <div className="container-narrow px-5 md:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold tracking-[0.14em] text-accent uppercase">
                Book a demo
              </p>
              <h1 className="font-display mt-4 text-4xl tracking-[-0.045em] text-ink md:text-5xl text-balance">
                See Stride settle your next B2B order.
              </h1>
              <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-muted">
                We&apos;ll walk through Pay Later, risk cover, and how settlement lands
                in your account—usually within 30 minutes.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-muted">
                {[
                  "Live credit decision demo",
                  "Integration options for your stack",
                  "ROI model for your average order value",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-line bg-surface p-6 shadow-[0_30px_60px_-40px_rgba(11,13,12,0.4)] md:p-8">
              {sent ? (
                <div className="py-10 text-center">
                  <p className="font-display text-2xl tracking-[-0.03em] text-ink">
                    You&apos;re booked.
                  </p>
                  <p className="mt-3 text-muted">
                    We&apos;ll reach out within one business day.
                  </p>
                  <Link href="/dashboard" className="btn-primary mt-8 inline-flex">
                    Preview the platform
                  </Link>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <Field label="Full name" name="name" required />
                  <Field label="Work email" name="email" type="email" required />
                  <Field label="Company" name="company" required />
                  <label className="block">
                    <span className="mb-1.5 block text-sm text-muted">Monthly GMV</span>
                    <select
                      name="gmv"
                      className="w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-sm outline-none focus:border-accent"
                      defaultValue="1-5m"
                    >
                      <option value="<1m">Under €1M</option>
                      <option value="1-5m">€1M – €5M</option>
                      <option value="5-20m">€5M – €20M</option>
                      <option value="20m+">€20M+</option>
                    </select>
                  </label>
                  <button type="submit" className="btn-primary mt-2 w-full">
                    Request demo
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
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
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}
