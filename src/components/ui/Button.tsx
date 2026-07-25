import Link from "next/link";
import { type ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants = {
  primary:
    "bg-ink text-paper-elev hover:bg-ink-soft shadow-soft px-6 py-3 text-sm",
  accent:
    "bg-accent text-white hover:bg-accent-deep shadow-soft px-6 py-3 text-sm",
  ghost:
    "bg-transparent text-ink hover:bg-paper-elev/70 border border-line px-6 py-3 text-sm",
  light:
    "bg-paper-elev text-ink hover:bg-white shadow-soft px-6 py-3 text-sm",
} as const;

type Variant = keyof typeof variants;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
