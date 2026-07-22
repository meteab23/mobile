import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CheckCircle2,
  Clock,
  Users,
  Download,
  ChevronDown,
} from "lucide-react";

const currency = (n: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

const kpis = [
  {
    icon: Wallet,
    label: "Net volume",
    value: "€1,284,900",
    delta: "+18.2%",
    up: true,
    tint: "var(--mint)",
  },
  {
    icon: CheckCircle2,
    label: "Approval rate",
    value: "94.6%",
    delta: "+2.1%",
    up: true,
    tint: "var(--sky)",
  },
  {
    icon: Clock,
    label: "Outstanding",
    value: "€312,400",
    delta: "-4.3%",
    up: false,
    tint: "var(--peach)",
  },
  {
    icon: Users,
    label: "Active buyers",
    value: "1,847",
    delta: "+9.6%",
    up: true,
    tint: "var(--brand-soft)",
  },
];

const chart = [
  32, 40, 36, 52, 48, 61, 58, 72, 66, 78, 74, 88, 82, 94, 90, 100,
];

const transactions = [
  { buyer: "Meridian Supply GmbH", id: "#VL-90241", amount: 12480, terms: "Net 30", status: "Approved" },
  { buyer: "Foundry Co.", id: "#VL-90238", amount: 8410, terms: "Net 60", status: "Paid out" },
  { buyer: "Brightwell Ltd", id: "#VL-90235", amount: 24900, terms: "3× monthly", status: "Approved" },
  { buyer: "Northwind Traders", id: "#VL-90230", amount: 3200, terms: "Net 30", status: "Pending" },
  { buyer: "Vantage Labs", id: "#VL-90228", amount: 56100, terms: "Net 90", status: "Paid out" },
  { buyer: "Hanseatic BV", id: "#VL-90224", amount: 1890, terms: "Net 30", status: "Overdue" },
];

const statusStyles: Record<string, string> = {
  Approved: "bg-brand-soft text-brand-ink",
  "Paid out": "bg-mint text-pos",
  Pending: "bg-black/[0.05] text-ink-soft",
  Overdue: "bg-[#fde2e2] text-neg",
};

const payouts = [
  { date: "Jul 22", amount: 84200, status: "In transit" },
  { date: "Jul 21", amount: 61080, status: "Completed" },
  { date: "Jul 20", amount: 47350, status: "Completed" },
  { date: "Jul 19", amount: 92400, status: "Completed" },
];

export default function DashboardPage() {
  return (
    <div className="scroll-slim">
      {/* Topbar */}
      <header className="sticky top-0 z-10 border-b border-line bg-bg/80 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink">
              Overview
            </h1>
            <p className="text-sm text-ink-muted">
              Welcome back, Meridian — here&apos;s your last 30 days.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden h-10 items-center gap-2 rounded-full border border-line-strong bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-black/[0.03] sm:inline-flex">
              Last 30 days
              <ChevronDown size={15} className="text-ink-muted" />
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-ink/90">
              <Download size={15} />
              Export
            </button>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-semibold text-white">
              MS
            </span>
          </div>
        </div>
      </header>

      <div className="space-y-6 px-5 py-6 sm:px-8">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-[20px] border border-line bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <span
                  className="grid h-10 w-10 place-items-center rounded-xl"
                  style={{ background: k.tint }}
                >
                  <k.icon size={19} className="text-ink" />
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-sm font-medium ${
                    k.up ? "text-pos" : "text-neg"
                  }`}
                >
                  {k.up ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {k.delta}
                </span>
              </div>
              <p className="mt-4 text-sm text-ink-muted">{k.label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">
                {k.value}
              </p>
            </div>
          ))}
        </div>

        {/* Chart + approval */}
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[20px] border border-line bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-ink-muted">Volume processed</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">
                  {currency(1284900)}
                </p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 text-ink-muted">
                  <span className="h-2 w-2 rounded-full bg-brand" /> Approved
                </span>
              </div>
            </div>
            <AreaChart data={chart} />
          </div>

          <div className="rounded-[20px] border border-line bg-white p-6">
            <p className="text-sm font-medium text-ink">Approval funnel</p>
            <div className="mt-5 space-y-4">
              <FunnelRow label="Checkout started" value={2410} pct={100} />
              <FunnelRow label="Credit requested" value={2088} pct={87} />
              <FunnelRow label="Approved" value={1975} pct={82} />
              <FunnelRow label="Completed" value={1902} pct={79} />
            </div>
            <div className="mt-6 rounded-xl bg-bg p-4">
              <p className="text-sm text-ink-muted">Avg. decision time</p>
              <p className="mt-1 text-xl font-semibold text-ink">2.4s</p>
            </div>
          </div>
        </div>

        {/* Transactions + payouts */}
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[20px] border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <p className="text-sm font-medium text-ink">Recent transactions</p>
              <button className="text-sm font-medium text-brand hover:underline">
                View all
              </button>
            </div>
            <div className="scroll-slim overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-ink-muted">
                    <th className="px-6 py-3 font-medium">Buyer</th>
                    <th className="px-6 py-3 font-medium">Terms</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {transactions.map((t) => (
                    <tr key={t.id} className="text-[15px]">
                      <td className="px-6 py-4">
                        <p className="font-medium text-ink">{t.buyer}</p>
                        <p className="font-mono text-xs text-ink-muted">
                          {t.id}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-ink-soft">{t.terms}</td>
                      <td className="px-6 py-4 font-medium text-ink">
                        {currency(t.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[t.status]}`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[20px] border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">Upcoming payouts</p>
              <Wallet size={16} className="text-ink-muted" />
            </div>
            <div className="mt-5 space-y-3">
              {payouts.map((p) => (
                <div
                  key={p.date}
                  className="flex items-center justify-between rounded-xl border border-line px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-ink">{currency(p.amount)}</p>
                    <p className="text-xs text-ink-muted">{p.date}</p>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      p.status === "In transit" ? "text-brand" : "text-pos"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-ink p-4 text-white">
              <p className="text-sm text-white/60">Next settlement</p>
              <p className="mt-1 text-xl font-semibold">{currency(84200)}</p>
              <p className="mt-1 text-xs text-white/50">
                Arriving tomorrow · Business account ••4821
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AreaChart({ data }: { data: number[] }) {
  const w = 640;
  const h = 200;
  const max = Math.max(...data);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (d / max) * (h - 20) - 10;
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-6 h-48 w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#fill)" />
      <path
        d={line}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {pts.length > 0 && (
        <circle
          cx={pts[pts.length - 1][0]}
          cy={pts[pts.length - 1][1]}
          r="4"
          fill="var(--brand)"
        />
      )}
    </svg>
  );
}

function FunnelRow({
  label,
  value,
  pct,
}: {
  label: string;
  value: number;
  pct: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-soft">{label}</span>
        <span className="font-medium text-ink">{value.toLocaleString()}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-bg">
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
