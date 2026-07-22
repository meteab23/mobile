import type { ReactNode } from "react";

export function Pill({
  children,
  tone = "brand",
  className = "",
}: {
  children: ReactNode;
  tone?: "brand" | "neutral" | "lime";
  className?: string;
}) {
  const tones = {
    brand: "bg-brand-soft text-brand-ink",
    neutral: "bg-black/[0.04] text-ink-soft",
    lime: "bg-lime/70 text-ink",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = false,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${center ? "mx-auto text-center" : ""} max-w-2xl ${className}`}
    >
      {eyebrow && <p className="eyebrow mb-4 text-brand">{eyebrow}</p>}
      <h2 className="display text-[clamp(1.9rem,4vw,3rem)] text-ink">{title}</h2>
      {subtitle && (
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}
