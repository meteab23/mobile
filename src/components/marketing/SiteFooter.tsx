import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/#products", label: "Pay Later" },
      { href: "/#products", label: "Pay in X" },
      { href: "/#products", label: "Pay on Account" },
      { href: "/dashboard", label: "Merchant platform" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/#solutions", label: "Ecommerce" },
      { href: "/#solutions", label: "Marketplaces" },
      { href: "/#solutions", label: "Platforms" },
      { href: "/#channels", label: "Omnichannel" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/demo", label: "Book a demo" },
      { href: "/checkout/demo", label: "Buyer checkout" },
      { href: "/dashboard", label: "Sign in" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg-elevated">
      <div className="container-wide px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-display text-2xl font-bold tracking-[-0.04em]">
              Stride<span className="text-accent">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-muted">
              The modern payment layer for B2B commerce. Flexible terms for buyers.
              Instant settlement for merchants.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold tracking-wide text-ink">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[0.92rem] text-muted hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Stride Payments. Built for modern B2B.</p>
          <p>Designed with clarity—Billie structure, OpenAI restraint.</p>
        </div>
      </div>
    </footer>
  );
}
