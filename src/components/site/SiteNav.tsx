"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { ButtonLink } from "@/components/ui/Button";

const links = [
  { href: "/products", label: "Products" },
  { href: "/repayments", label: "POS & Repayments" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/80 backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between px-5 sm:px-8 lg:px-10">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted transition hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/demo"
            className="text-sm text-ink-muted transition hover:text-ink"
          >
            Log in
          </Link>
          <ButtonLink href="/demo" variant="accent" className="!py-2.5 !text-sm">
            Book a demo
          </ButtonLink>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-paper px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-base text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink href="/demo" variant="accent" className="mt-2 w-full">
              Book a demo
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
