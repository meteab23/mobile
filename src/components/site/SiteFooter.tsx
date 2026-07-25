import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { brand, products } from "@/lib/data";

const columns = [
  {
    title: "Products",
    links: products.map((p) => ({
      href: `/products/${p.slug}`,
      label: p.name,
    })),
  },
  {
    title: "Platform",
    links: [
      { href: "/repayments", label: "POS & Repayments" },
      { href: "/pricing", label: "Pricing" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/demo", label: "Book a demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/demo", label: "Contact" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink text-paper-elev">
      <div className="shell section-pad !py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo inverted />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
              {brand.description}
            </p>
            <p className="mt-6 text-sm text-white/45">
              {brand.location}
              <br />
              {brand.email}
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-display text-sm font-semibold tracking-wide text-white">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.legal}. Built for UAE B2B
            commerce.
          </p>
          <p>Pay later for businesses — Account Trade live today.</p>
        </div>
      </div>
    </footer>
  );
}
