import Link from "next/link";
import { Logo } from "./Logo";

const groups = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/product" },
      { label: "Checkout demo", href: "/checkout" },
      { label: "Merchant dashboard", href: "/dashboard" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Marketplaces", href: "/product" },
      { label: "Wholesale & distribution", href: "/product" },
      { label: "SaaS & software", href: "/product" },
      { label: "Enterprise", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/product" },
      { label: "Customers", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Press", href: "/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/product" },
      { label: "API reference", href: "/product" },
      { label: "Risk & compliance", href: "/pricing" },
      { label: "Status", href: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-bg">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              B2B Buy Now, Pay Later. Offer business customers flexible net
              terms at checkout — get paid upfront, every time.
            </p>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="text-sm font-semibold text-ink">{g.title}</h4>
              <ul className="mt-4 space-y-3">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[15px] text-ink-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vela Financial, Inc. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/" className="hover:text-ink">
              Terms
            </Link>
            <Link href="/" className="hover:text-ink">
              Security
            </Link>
            <span className="text-ink-muted/70">
              Vela is a financial technology company, not a bank.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
