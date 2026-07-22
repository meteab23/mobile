import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://vela.example"),
  title: {
    default: "Vela — B2B Buy Now, Pay Later",
    template: "%s · Vela",
  },
  description:
    "Vela lets you offer business customers flexible net terms at checkout. You get paid upfront, we take on the risk, collection, and financing.",
  keywords: [
    "B2B BNPL",
    "buy now pay later",
    "net terms",
    "invoice financing",
    "business payments",
    "checkout financing",
  ],
  openGraph: {
    title: "Vela — B2B Buy Now, Pay Later",
    description:
      "Offer business customers flexible net terms at checkout. Get paid upfront.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        {children}
      </body>
    </html>
  );
}
