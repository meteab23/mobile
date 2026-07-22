import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate, formatMoney, invoices, metrics } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-[-0.04em] text-ink">Overview</h1>
        <p className="mt-2 text-muted">
          Settlement, approvals, and buyer health—updated in real time.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <p className="text-sm text-muted">{metric.label}</p>
            <p className="font-display mt-3 text-3xl tracking-[-0.04em] text-ink">
              {metric.value}
            </p>
            <p className="mt-2 text-sm text-accent">{metric.change} this month</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-2xl border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-lg tracking-[-0.03em]">Recent invoices</h2>
            <Link
              href="/dashboard/invoices"
              className="inline-flex items-center gap-1 text-sm text-accent hover:text-ink"
            >
              View all
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-line">
            {invoices.slice(0, 4).map((invoice) => (
              <div
                key={invoice.id}
                className="grid grid-cols-[1fr_auto] gap-3 px-5 py-4 md:grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr]"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{invoice.buyer}</p>
                  <p className="mt-0.5 text-xs text-muted">{invoice.id}</p>
                </div>
                <p className="hidden text-sm text-muted md:block">{invoice.term}</p>
                <p className="hidden text-sm text-muted md:block">
                  Due {formatDate(invoice.dueDate)}
                </p>
                <div className="text-right">
                  <p className="text-sm font-semibold text-ink">
                    {formatMoney(invoice.amount, invoice.currency)}
                  </p>
                  <StatusPill status={invoice.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-ink p-6 text-white">
          <p className="text-sm text-white/55">Cash available today</p>
          <p className="font-display mt-2 text-4xl tracking-[-0.04em]">€128,440</p>
          <p className="mt-3 text-sm text-accent-bright">
            24 invoices settled · risk fully covered
          </p>
          <div className="mt-8 space-y-3">
            {[
              { label: "Pending approval", value: "€27,640" },
              { label: "In collection", value: "€9,200" },
              { label: "Buyer credit unused", value: "€412k" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-xl bg-white/5 px-3.5 py-3"
              >
                <span className="text-sm text-white/60">{row.label}</span>
                <span className="text-sm font-semibold">{row.value}</span>
              </div>
            ))}
          </div>
          <Link href="/demo" className="btn-accent mt-8 w-full">
            Increase credit limits
          </Link>
        </section>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "text-accent",
    pending: "text-[#8a5a12]",
    overdue: "text-[#b42318]",
    approved: "text-accent",
  };
  return (
    <p className={`mt-0.5 text-xs capitalize ${styles[status] ?? "text-muted"}`}>
      {status}
    </p>
  );
}
