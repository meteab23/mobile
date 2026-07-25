import Link from "next/link";

export function Logo({
  className = "",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="Yusr home"
    >
      <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-ink text-paper-elev">
        <span className="absolute inset-0 opacity-80 mesh-panel" />
        <span className="relative font-display text-sm font-bold tracking-tight">
          Y
        </span>
      </span>
      <span
        className={`font-display text-xl font-semibold tracking-tight ${
          inverted ? "text-paper-elev" : "text-ink"
        }`}
      >
        Yusr
      </span>
    </Link>
  );
}
