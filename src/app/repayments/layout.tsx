import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POS & Repayments",
  description:
    "Connect your POS to Yusr and repay as a percentage of each transaction — YouLend-style sales-based repayment for UAE merchants.",
};

export default function RepaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
