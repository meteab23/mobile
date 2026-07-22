import Link from "next/link";

export function Logo({
  className = "",
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Vela home"
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <span
        className="grid h-8 w-8 place-items-center rounded-[10px]"
        style={{
          background: invert
            ? "#fff"
            : "linear-gradient(140deg, var(--brand) 0%, #8b6bff 100%)",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M4 5l8 14L20 5"
            stroke={invert ? "var(--brand)" : "#fff"}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={`text-[19px] font-semibold tracking-tight ${
          invert ? "text-white" : "text-ink"
        }`}
      >
        Vela
      </span>
    </Link>
  );
}
