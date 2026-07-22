import { Check, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "./Reveal";

const bullets = [
  "Real-time approvals with dynamic credit limits per buyer",
  "Automated invoicing, reminders and reconciliation",
  "Multi-currency payouts across 30+ markets",
  "Drop-in checkout, hosted page, or full API",
];

export function FeatureShowcase() {
  return (
    <section className="container-x py-24">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <div>
            <p className="eyebrow mb-4 text-brand">One platform</p>
            <h2 className="display text-[clamp(1.9rem,4vw,3rem)] text-ink">
              A control center for every B2B payment
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              Track approvals, payouts and outstanding invoices in one place.
              Vela replaces the spreadsheets, credit checks, and chasing that
              come with offering trade credit.
            </p>
            <ul className="mt-8 space-y-3.5">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-brand-soft">
                    <Check size={12} className="text-brand" />
                  </span>
                  <span className="text-[15px] text-ink-soft">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <ButtonLink href="/dashboard" variant="dark">
                Explore the dashboard
                <ArrowUpRight size={18} />
              </ButtonLink>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <DashboardPreview />
        </Reveal>
      </div>
    </section>
  );
}

function DashboardPreview() {
  const bars = [42, 58, 47, 66, 74, 63, 88, 79, 96];
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[32px] bg-brand-soft/50 blur-2xl" />
      <div className="rounded-[24px] border border-line bg-white p-6 shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-muted">Net volume · this month</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">
              € 1,284,900
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2.5 py-1 text-xs font-medium text-pos">
            <ArrowUpRight size={12} /> +18.2%
          </span>
        </div>

        <div className="mt-8 flex h-40 items-end gap-2.5">
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col justify-end">
              <div
                className="w-full rounded-t-md"
                style={{
                  height: `${h}%`,
                  background:
                    i === bars.length - 1
                      ? "var(--brand)"
                      : "color-mix(in srgb, var(--brand) 22%, white)",
                }}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-6">
          {[
            { k: "Approval rate", v: "94.6%" },
            { k: "Avg. order", v: "€ 8,410" },
            { k: "Outstanding", v: "€ 312k" },
          ].map((s) => (
            <div key={s.k}>
              <p className="text-xs text-ink-muted">{s.k}</p>
              <p className="mt-1 text-lg font-semibold text-ink">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
