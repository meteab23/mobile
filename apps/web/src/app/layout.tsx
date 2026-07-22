import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { MacroBar } from "@/components/simple/MacroBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "US Stocks — Scalp & Trade",
  description: "Simple US stock screener with wishlist, technicals, news, and 2-5% scalp targets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-950 text-zinc-100 antialiased`}
      >
        <DisclaimerBanner />
        <MacroBar />
        {children}
      </body>
    </html>
  );
}
