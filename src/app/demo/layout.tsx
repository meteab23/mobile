import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "Book a Yusr demo — Account Trade, Pay Later waitlist, Installments, and POS repayments for UAE B2B merchants.",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
