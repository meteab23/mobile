import { buyers, formatMoney } from "@/lib/data";

export default function BuyersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-[-0.04em] text-ink">Buyers</h1>
        <p className="mt-2 text-muted">
          Live credit limits, utilization, and risk for every business customer.
        </p>
      </div>

      <div className="grid gap-4">
        {buyers.map((buyer) => {
          const pct = Math.round((buyer.used / buyer.limit) * 100);
          return (
            <div
              key={buyer.id}
              className="rounded-2xl border border-line bg-surface p-5 md:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-display text-xl tracking-[-0.03em] text-ink">
                    {buyer.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {buyer.industry} · {buyer.country} · {buyer.id}
                  </p>
                </div>
                <RiskBadge risk={buyer.risk} />
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted">Credit used</span>
                  <span className="font-semibold text-ink">
                    {formatMoney(buyer.used)} / {formatMoney(buyer.limit)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-bg">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted">{pct}% utilized</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: "low" | "medium" | "high" }) {
  const styles = {
    low: "bg-accent-soft text-accent",
    medium: "bg-[#f5efe4] text-[#8a5a12]",
    high: "bg-[#fdecea] text-[#b42318]",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[risk]}`}>
      {risk} risk
    </span>
  );
}
