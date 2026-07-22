"use client";

import { useState } from "react";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Building2,
  Sparkles,
  RotateCcw,
} from "lucide-react";

type Step = 0 | 1 | 2 | 3;

const ITEMS = [
  { name: "Industrial CNC Router X9", qty: 1, price: 9800 },
  { name: "Tooling & bits bundle", qty: 4, price: 320 },
  { name: "Extended service plan", qty: 1, price: 1400 },
];

const TERMS = [
  { id: "net30", label: "Pay in 30 days", meta: "0% for buyer", fee: "€0.00" },
  { id: "net60", label: "Pay in 60 days", meta: "1.5% buyer fee", fee: "€187.20" },
  {
    id: "inst3",
    label: "3 monthly installments",
    meta: "from 0.9%/mo",
    fee: "€112.32",
  },
];

const currency = (n: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(n);

export default function CheckoutDemoPage() {
  const [step, setStep] = useState<Step>(0);
  const [term, setTerm] = useState("net30");
  const [approving, setApproving] = useState(false);

  const subtotal = ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const vat = subtotal * 0.19;
  const total = subtotal + vat;

  const goApprove = () => {
    setApproving(true);
    setStep(2);
    setTimeout(() => {
      setApproving(false);
      setStep(3);
    }, 2200);
  };

  const reset = () => {
    setStep(0);
    setTerm("net30");
    setApproving(false);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[360px] w-[640px] -translate-x-1/2 rounded-full bg-brand-soft blur-[120px] opacity-60" />

      <div className="container-x relative py-14 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3 text-brand">Interactive demo</p>
          <h1 className="display text-[clamp(2rem,4.5vw,3.2rem)] text-ink">
            The Vela B2B checkout
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-muted">
            Walk through how a business buyer gets instant net terms — and how
            you get paid upfront.
          </p>
        </div>

        <Stepper step={step} />

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left — flow */}
          <div className="rounded-[24px] border border-line bg-white p-6 shadow-[var(--shadow-md)] sm:p-8">
            {step === 0 && (
              <TermSelection
                term={term}
                setTerm={setTerm}
                total={total}
                onNext={() => setStep(1)}
              />
            )}
            {step === 1 && (
              <BusinessDetails onBack={() => setStep(0)} onNext={goApprove} />
            )}
            {step === 2 && <Approving loading={approving} />}
            {step === 3 && (
              <Confirmation
                total={total}
                term={TERMS.find((t) => t.id === term)!}
                onReset={reset}
              />
            )}
          </div>

          {/* Right — order summary */}
          <OrderSummary subtotal={subtotal} vat={vat} total={total} />
        </div>
      </div>
    </section>
  );
}

function Stepper({ step }: { step: Step }) {
  const labels = ["Choose terms", "Business details", "Approval", "Done"];
  return (
    <div className="mx-auto mt-12 flex max-w-xl items-center justify-between">
      {labels.map((l, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={l} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full text-sm font-medium transition-colors ${
                  done
                    ? "bg-pos text-white"
                    : active
                      ? "bg-brand text-white"
                      : "border border-line bg-white text-ink-muted"
                }`}
              >
                {done ? <Check size={16} /> : i + 1}
              </span>
              <span
                className={`hidden text-xs sm:block ${
                  active ? "text-ink" : "text-ink-muted"
                }`}
              >
                {l}
              </span>
            </div>
            {i < labels.length - 1 && (
              <span
                className={`mx-2 h-px flex-1 ${
                  done ? "bg-pos" : "bg-line"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TermSelection({
  term,
  setTerm,
  total,
  onNext,
}: {
  term: string;
  setTerm: (t: string) => void;
  total: number;
  onNext: () => void;
}) {
  return (
    <div className="animate-rise">
      <div className="flex items-center gap-2 text-sm font-medium text-ink-muted">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-ink text-white">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 5l8 14L20 5"
              stroke="#fff"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        Pay with Vela
      </div>

      <h2 className="mt-5 text-xl font-semibold text-ink">
        Choose how you&apos;d like to pay
      </h2>
      <p className="mt-1 text-[15px] text-ink-muted">
        Order total {currency(total)} · select your terms
      </p>

      <div className="mt-6 space-y-3">
        {TERMS.map((t) => {
          const active = t.id === term;
          return (
            <button
              key={t.id}
              onClick={() => setTerm(t.id)}
              className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors ${
                active
                  ? "border-brand bg-brand-soft/50"
                  : "border-line bg-white hover:border-line-strong"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full border ${
                    active
                      ? "border-brand bg-brand"
                      : "border-line-strong bg-white"
                  }`}
                >
                  {active && <Check size={12} className="text-white" />}
                </span>
                <div>
                  <p className="font-medium text-ink">{t.label}</p>
                  <p className="text-sm text-ink-muted">{t.meta}</p>
                </div>
              </div>
              <span className="text-sm text-ink-muted">Buyer fee {t.fee}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand font-medium text-white transition-colors hover:bg-brand-strong"
      >
        Continue
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

function BusinessDetails({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <form
      className="animate-rise"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="flex items-center gap-2 text-brand">
        <Building2 size={18} />
        <span className="text-sm font-medium">Business details</span>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-ink">
        Tell us about your business
      </h2>
      <p className="mt-1 text-[15px] text-ink-muted">
        We use this for an instant credit decision — no documents needed.
      </p>

      <div className="mt-6 grid gap-4">
        <Field label="Company name" placeholder="Meridian Supply GmbH" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="VAT / Tax ID" placeholder="DE123456789" />
          <Field label="Country" placeholder="Germany" />
        </div>
        <Field label="Work email" type="email" placeholder="ap@meridian.com" />
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl bg-bg px-4 py-3 text-sm text-ink-muted">
        <ShieldCheck size={16} className="flex-none text-pos" />
        Bank-grade encryption · a soft check that never affects your credit
        score.
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-line-strong px-5 font-medium text-ink transition-colors hover:bg-black/5"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button
          type="submit"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand font-medium text-white transition-colors hover:bg-brand-strong"
        >
          Get instant decision
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}

function Approving({ loading }: { loading: boolean }) {
  return (
    <div className="animate-rise flex min-h-[380px] flex-col items-center justify-center text-center">
      {loading ? (
        <>
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-soft">
            <Loader2 size={30} className="animate-spin text-brand" />
          </span>
          <h2 className="mt-6 text-xl font-semibold text-ink">
            Underwriting in real time…
          </h2>
          <p className="mt-2 max-w-xs text-[15px] text-ink-muted">
            Checking thousands of B2B signals to make an instant credit
            decision.
          </p>
          <div className="mt-6 space-y-2 text-left text-sm text-ink-muted">
            <CheckLine>Verifying business identity</CheckLine>
            <CheckLine>Assessing creditworthiness</CheckLine>
            <CheckLine>Setting credit limit</CheckLine>
          </div>
        </>
      ) : null}
    </div>
  );
}

function CheckLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2">
      <Check size={15} className="text-pos" />
      {children}
    </p>
  );
}

function Confirmation({
  total,
  term,
  onReset,
}: {
  total: number;
  term: (typeof TERMS)[number];
  onReset: () => void;
}) {
  return (
    <div className="animate-rise text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint">
        <Check size={32} className="text-pos" />
      </span>
      <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand-ink">
        <Sparkles size={13} /> Approved instantly
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-ink">Order confirmed</h2>
      <p className="mt-2 text-[15px] text-ink-muted">
        Paid on <strong className="text-ink">{term.label.toLowerCase()}</strong>{" "}
        — the seller receives {currency(total)} upfront.
      </p>

      <div className="mt-7 grid gap-3 text-left sm:grid-cols-2">
        <InfoTile k="Seller paid today" v={currency(total)} tint="var(--mint)" />
        <InfoTile
          k="Buyer pays"
          v={term.label.replace("Pay in ", "In ").replace("Pay ", "")}
          tint="var(--sky)"
        />
        <InfoTile k="Credit limit granted" v="€ 50,000" tint="var(--peach)" />
        <InfoTile k="Risk carried by seller" v="€ 0" tint="var(--brand-soft)" />
      </div>

      <button
        onClick={onReset}
        className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line-strong px-5 font-medium text-ink transition-colors hover:bg-black/5"
      >
        <RotateCcw size={16} />
        Run the demo again
      </button>
    </div>
  );
}

function InfoTile({ k, v, tint }: { k: string; v: string; tint: string }) {
  return (
    <div className="rounded-2xl border border-line p-4">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: tint }}
        />
        <p className="text-sm text-ink-muted">{k}</p>
      </div>
      <p className="mt-1.5 text-lg font-semibold text-ink">{v}</p>
    </div>
  );
}

function OrderSummary({
  subtotal,
  vat,
  total,
}: {
  subtotal: number;
  vat: number;
  total: number;
}) {
  return (
    <aside className="h-fit rounded-[24px] border border-line bg-bg p-6 sm:p-7">
      <h3 className="text-sm font-semibold text-ink">Order summary</h3>
      <div className="mt-5 space-y-4">
        {ITEMS.map((it) => (
          <div key={it.name} className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-line bg-white text-xs font-medium text-ink-muted">
                {it.qty}×
              </span>
              <p className="text-[15px] leading-snug text-ink">{it.name}</p>
            </div>
            <p className="whitespace-nowrap text-[15px] text-ink">
              {currency(it.price * it.qty)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-line pt-5 text-[15px]">
        <Row k="Subtotal" v={currency(subtotal)} />
        <Row k="VAT (19%)" v={currency(vat)} />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="font-semibold text-ink">Total</span>
        <span className="text-xl font-semibold text-ink">
          {currency(total)}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm text-ink-muted">
        <ShieldCheck size={16} className="flex-none text-pos" />
        Seller is paid upfront and protected against non-payment.
      </div>
    </aside>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-ink-muted">
      <span>{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}
