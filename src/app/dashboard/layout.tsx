import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const metadata: Metadata = {
  title: "Merchant dashboard",
  description:
    "Track approvals, payouts, buyers and outstanding invoices across your B2B net terms.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 bg-bg">{children}</div>
    </div>
  );
}
