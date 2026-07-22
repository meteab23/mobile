import { formatDate, formatMoney, invoices } from "@/lib/data";

export default function InvoicesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-[-0.04em] text-ink">Invoices</h1>
          <p className="mt-2 text-muted">
            Every Pay Later, Pay in X, and open-account receivable in one ledger.
          </p>
        </div>
        <button type="button" className="btn-primary !px-4 !py-2.5 text-sm">
          Export CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="hidden grid-cols-[1.1fr_1fr_0.8fr_0.9fr_0.8fr_0.7fr] gap-3 border-b border-line bg-bg px-5 py-3 text-xs tracking-wide text-muted uppercase md:grid">
          <span>Invoice</span>
          <span>Buyer</span>
          <span>Term</span>
          <span>Issued</span>
          <span>Due</span>
          <span className="text-right">Amount</span>
        </div>
        <div className="divide-y divide-line">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="grid gap-2 px-5 py-4 md:grid-cols-[1.1fr_1fr_0.8fr_0.9fr_0.8fr_0.7fr] md:items-center md:gap-3"
            >
              <div>
                <p className="text-sm font-semibold text-ink">{invoice.id}</p>
                <StatusBadge status={invoice.status} />
              </div>
              <p className="text-sm text-ink">{invoice.buyer}</p>
              <p className="text-sm text-muted">{invoice.term}</p>
              <p className="text-sm text-muted">{formatDate(invoice.issuedAt)}</p>
              <p className="text-sm text-muted">{formatDate(invoice.dueDate)}</p>
              <p className="text-sm font-semibold text-ink md:text-right">
                {formatMoney(invoice.amount, invoice.currency)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-accent-soft text-accent",
    pending: "bg-[#f5efe4] text-[#8a5a12]",
    overdue: "bg-[#fdecea] text-[#b42318]",
    approved: "bg-accent-soft text-accent",
  };
  return (
    <span
      className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
        map[status] ?? "bg-bg text-muted"
      }`}
    >
      {status}
    </span>
  );
}
