"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { Logo } from "./Logo";
import { ButtonLink } from "@/components/ui/Button";

const links = [
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/checkout", label: "Checkout demo" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <div className="flex items-center gap-10">
          <Logo />
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-[15px] text-ink-soft transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/dashboard"
            className="rounded-full px-4 py-2 text-[15px] text-ink-soft transition-colors hover:text-ink"
          >
            Sign in
          </Link>
          <ButtonLink href="/product" size="sm">
            Get started
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full text-ink md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-x-0 top-16 z-40 h-[calc(100dvh-4rem)] bg-bg md:hidden">
          <div className="container-x flex flex-col gap-1 py-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-line py-4 text-lg font-medium"
              >
                {l.label}
                <ChevronRight size={18} className="text-ink-muted" />
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <ButtonLink
                href="/dashboard"
                variant="secondary"
                size="lg"
                onClick={() => setOpen(false)}
              >
                Sign in
              </ButtonLink>
              <ButtonLink
                href="/product"
                size="lg"
                onClick={() => setOpen(false)}
              >
                Get started
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
