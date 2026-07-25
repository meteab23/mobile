import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { brand } from "@/lib/data";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — B2B BNPL for the UAE`,
    template: `%s · ${brand.name}`,
  },
  description: brand.description,
  openGraph: {
    title: `${brand.name} — B2B BNPL for the UAE`,
    description: brand.description,
    locale: "en_AE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AE">
      <body className={`${display.variable} ${body.variable} font-sans antialiased`}>
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
