export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-[-0.04em] text-ink">Settings</h1>
        <p className="mt-2 text-muted">
          Configure settlement, branding, and how Pay Later appears at checkout.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SettingCard
          title="Settlement account"
          copy="Payouts land in your EUR IBAN within one business day of capture."
          value="DE89 ···· 3000"
        />
        <SettingCard
          title="Default term"
          copy="Shown first to eligible buyers when multiple products are enabled."
          value="Net 30"
        />
        <SettingCard
          title="Checkout branding"
          copy="Logo and accent color used on hosted Stride checkout."
          value="Meridian Goods"
        />
        <SettingCard
          title="Webhook endpoint"
          copy="Receive invoice.paid, credit.decision, and settlement events."
          value="api.meridian.eu/hooks/stride"
        />
      </div>
    </div>
  );
}

function SettingCard({
  title,
  copy,
  value,
}: {
  title: string;
  copy: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-display text-lg tracking-[-0.03em] text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{copy}</p>
      <p className="mt-5 rounded-xl bg-bg px-3.5 py-3 text-sm font-semibold text-ink">
        {value}
      </p>
    </div>
  );
}
