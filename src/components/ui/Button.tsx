import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "lime" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 whitespace-nowrap select-none disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-strong shadow-[0_1px_2px_rgba(11,11,13,0.08)] hover:shadow-[0_8px_24px_rgba(91,52,239,0.28)]",
  secondary:
    "bg-white text-ink border border-line-strong hover:border-ink/40 hover:bg-white",
  ghost: "text-ink hover:bg-black/5",
  lime: "bg-lime text-ink hover:brightness-95 shadow-sm",
  dark: "bg-ink text-white hover:bg-ink/90",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 h-9",
  md: "text-[15px] px-5 h-11",
  lg: "text-base px-7 h-13",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
