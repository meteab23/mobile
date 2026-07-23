"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  calculatePaymentTerms,
  type FeeCalculationResult,
  type PayoutTerm,
} from "@/lib/calculations";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

const PAYOUT_TERMS: PayoutTerm[] = [30, 60, 90];

interface InteractiveTerminalProps {
  className?: string;
}

export function InteractiveTerminal({ className }: InteractiveTerminalProps) {
  const [amount, setAmount] = React.useState(25000);
  const [payoutTerm, setPayoutTerm] = React.useState<PayoutTerm>(60);
  const [promptIndex, setPromptIndex] = React.useState(0);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const result = React.useMemo(
    () => calculatePaymentTerms({ amount, payoutTerm }),
    [amount, payoutTerm]
  );

  const prompts = React.useMemo(
    () => [
      `Assess credit risk for a ${formatCurrency(amount)} B2B order…`,
      `Optimize payout for Net-${payoutTerm} trade terms…`,
      `Run instant underwriting & fee calculation…`,
    ],
    [amount, payoutTerm]
  );

  React.useEffect(() => {
    setIsAnalyzing(true);
    const analyzeTimer = window.setTimeout(() => setIsAnalyzing(false), 650);
    return () => window.clearTimeout(analyzeTimer);
  }, [amount, payoutTerm]);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setPromptIndex((i) => (i + 1) % prompts.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [prompts.length]);

  const animatedAmount = useMotionValue(amount);
  const springAmount = useSpring(animatedAmount, { stiffness: 120, damping: 20 });
  const displayAmount = useTransform(springAmount, (v) =>
    formatCurrency(Math.round(v))
  );

  React.useEffect(() => {
    animatedAmount.set(amount);
  }, [amount, animatedAmount]);

  return (
    <div
      id="terminal"
      className={cn(
        "relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-[#09090B] text-white shadow-2xl shadow-black/20 dark:border-neutral-800",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-violet-500/5 to-transparent" />

      <div className="relative border-b border-white/10 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <Wallet className="h-4 w-4 text-emerald-400" />
            </span>
            <div>
              <p className="text-sm font-medium tracking-tight">
                B2B Payment Terminal
              </p>
              <p className="text-xs text-white/50">AI risk & cash-flow preview</p>
            </div>
          </div>
          <Badge
            variant="success"
            className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          >
            Live
          </Badge>
        </div>
      </div>

      <div className="relative grid gap-0 lg:grid-cols-2">
        <div className="space-y-6 border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs text-white/50">
              <Bot className="h-3.5 w-3.5 text-emerald-400" />
              <span>AI prompt interface</span>
            </div>
            <div className="flex min-h-[52px] items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
              <AnimatePrompt text={prompts[promptIndex]} analyzing={isAnalyzing} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <Label className="text-white/70">Transaction amount</Label>
              <motion.span className="font-mono text-lg font-semibold tracking-tight text-white">
                {displayAmount}
              </motion.span>
            </div>
            <Slider
              min={1000}
              max={100000}
              step={1000}
              value={[amount]}
              onValueChange={(value) => setAmount(value[0] ?? 1000)}
              aria-label="Transaction amount"
            />
            <div className="flex justify-between text-xs text-white/40">
              <span>$1,000</span>
              <span>$100,000</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-white/70">Payout terms</Label>
            <div className="grid grid-cols-3 gap-2">
              {PAYOUT_TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setPayoutTerm(term)}
                  className={cn(
                    "rounded-full border px-3 py-2.5 text-sm font-medium transition-all",
                    payoutTerm === term
                      ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  )}
                >
                  Net {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <ResultPanel result={result} analyzing={isAnalyzing} />
        </div>
      </div>
    </div>
  );
}

interface AnimatePromptProps {
  text: string;
  analyzing: boolean;
}

function AnimatePrompt({ text, analyzing }: AnimatePromptProps) {
  return (
    <div>
      <motion.p
        key={text}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm leading-relaxed text-white/85"
      >
        {text}
      </motion.p>
      <p className="mt-2 text-xs text-white/40">
        {analyzing ? "Analyzing buyer risk…" : "Ready · decision in < 1s"}
      </p>
    </div>
  );
}

interface ResultPanelProps {
  result: FeeCalculationResult;
  analyzing: boolean;
}

function ResultPanel({ result, analyzing }: ResultPanelProps) {
  const riskVariant =
    result.riskLabel === "Low"
      ? "success"
      : result.riskLabel === "Moderate"
        ? "warning"
        : "warning";

  return (
    <motion.div
      layout
      className="flex h-full flex-col justify-between gap-5"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium tracking-tight text-white/80">
            Instant calculation
          </p>
          <Badge
            variant={riskVariant}
            className={
              result.riskLabel === "Low"
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                : "border-amber-400/20 bg-amber-400/10 text-amber-200"
            }
          >
            {result.riskLabel} risk · {result.riskScore}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricTile
            label="Fee rate"
            value={formatPercent(result.feeRate * 100)}
            analyzing={analyzing}
          />
          <MetricTile
            label="Processing fee"
            value={formatCurrency(result.feeAmount, "USD", 2)}
            analyzing={analyzing}
          />
          <MetricTile
            label="Net payout"
            value={formatCurrency(result.netPayout, "USD", 2)}
            highlight
            analyzing={analyzing}
          />
          <MetricTile
            label="Cash available"
            value={`${result.cashAvailableInDays} day`}
            analyzing={analyzing}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <div className="flex-1">
            <p className="text-sm font-medium tracking-tight">
              Underwriting: {result.underwritingStatus}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/50">
              AI credit check complete for Net-{result.payoutTerm}. Buyer
              receives flexible terms; you get paid tomorrow.
            </p>
          </div>
        </div>
        <Button
          variant="accent"
          className="mt-4 w-full"
          onClick={() => {
            document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <TrendingUp className="h-4 w-4" />
          Unlock this for your checkout
        </Button>
      </div>
    </motion.div>
  );
}

interface MetricTileProps {
  label: string;
  value: string;
  highlight?: boolean;
  analyzing?: boolean;
}

function MetricTile({ label, value, highlight, analyzing }: MetricTileProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-3.5 transition-colors",
        highlight
          ? "border-emerald-400/25 bg-emerald-400/10"
          : "border-white/10 bg-white/[0.03]"
      )}
    >
      <p className="text-[11px] uppercase tracking-wider text-white/40">
        {label}
      </p>
      <motion.p
        key={`${label}-${value}`}
        initial={{ opacity: 0.4, y: 4 }}
        animate={{ opacity: analyzing ? 0.55 : 1, y: 0 }}
        className={cn(
          "mt-1 font-mono text-base font-semibold tracking-tight sm:text-lg",
          highlight ? "text-emerald-300" : "text-white"
        )}
      >
        {value}
      </motion.p>
    </div>
  );
}
