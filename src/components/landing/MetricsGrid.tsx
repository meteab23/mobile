"use client";

import * as React from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface MetricItem {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description: string;
}

const METRICS: MetricItem[] = [
  {
    label: "Approval rate",
    value: 94,
    suffix: "%",
    description: "Eligible B2B buyers approved instantly",
  },
  {
    label: "Avg. payout speed",
    value: 1,
    suffix: " day",
    description: "Funds settled to merchants after capture",
  },
  {
    label: "GMV financed",
    value: 2.4,
    prefix: "$",
    suffix: "B+",
    description: "Processed across enterprise partners",
  },
  {
    label: "Fraud loss rate",
    value: 0.12,
    suffix: "%",
    description: "AI underwriting keeps losses near zero",
  },
];

export function MetricsGrid() {
  return (
    <section id="metrics" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[420px] -translate-y-1/2 bg-gradient-to-tr from-emerald-500/10 via-violet-500/5 to-transparent blur-2xl" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-tight text-emerald-700 dark:text-emerald-400">
            Performance
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Numbers that earn trust
          </h2>
          <p className="mt-3 text-muted-foreground">
            A high-trust fintech stack designed for conversion, liquidity, and
            controlled risk.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric, index) => (
            <MetricCard key={metric.label} metric={metric} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface MetricCardProps {
  metric: MetricItem;
  index: number;
}

function MetricCard({ metric, index }: MetricCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white/80 p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5 dark:border-neutral-800 dark:bg-neutral-950/80"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl" />
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {metric.label}
      </p>
      <p className="mt-3 font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
        {metric.prefix}
        <AnimatedNumber
          value={metric.value}
          active={inView}
          decimals={metric.value % 1 !== 0 ? 2 : 0}
        />
        {metric.suffix}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {metric.description}
      </p>
    </motion.div>
  );
}

interface AnimatedNumberProps {
  value: number;
  active: boolean;
  decimals?: number;
}

function AnimatedNumber({ value, active, decimals = 0 }: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 70, damping: 18 });
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    if (active) motionValue.set(value);
  }, [active, motionValue, value]);

  React.useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(latest.toFixed(decimals));
    });
    return () => unsubscribe();
  }, [spring, decimals]);

  return <span>{display}</span>;
}
