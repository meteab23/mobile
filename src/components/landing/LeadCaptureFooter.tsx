"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Online Checkout", href: "#features" },
      { label: "Telesales", href: "#features" },
      { label: "In-Person B2B", href: "#features" },
      { label: "AI Terminal", href: "#terminal" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#cta" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Status", href: "#" },
      { label: "Security", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
];

export function LeadCaptureFooter() {
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = React.useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company: company || undefined }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      setStatus("success");
      setMessage(data.message ?? "You're on the list.");
      setEmail("");
      setCompany("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Unable to subscribe right now"
      );
    }
  }

  return (
    <footer id="cta" className="relative pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200/80 bg-[#09090B] px-6 py-10 text-white shadow-2xl shadow-black/10 sm:px-10 sm:py-14 dark:border-neutral-800">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-emerald-500/15 via-violet-500/10 to-transparent" />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Product updates & playbooks
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Get the B2B payments briefing
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
                Subscribe for underwriting insights, checkout benchmarks, and
                early access to Billie platform releases.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="newsletter-email" className="text-white/70">
                  Work email
                </Label>
                <Input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-emerald-400/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter-company" className="text-white/70">
                  Company <span className="text-white/35">(optional)</span>
                </Label>
                <Input
                  id="newsletter-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Commerce"
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-emerald-400/30"
                />
              </div>
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subscribing…
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
              {message && (
                <p
                  className={`flex items-center gap-2 text-sm ${
                    status === "success" ? "text-emerald-300" : "text-amber-200"
                  }`}
                >
                  {status === "success" && (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  )}
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-neutral-200/80 pb-10 pt-12 dark:border-neutral-800 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold tracking-tight">Billie</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The intelligent B2B payments platform for high-trust checkout,
              trade credit, and AI-native underwriting.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-semibold tracking-tight">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-200/80 py-6 text-xs text-muted-foreground dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Billie. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
