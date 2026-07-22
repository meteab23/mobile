import { NextResponse } from "next/server";

export const POPULAR_US_STOCKS = [
  { ticker: "AAPL", name: "Apple" },
  { ticker: "MSFT", name: "Microsoft" },
  { ticker: "NVDA", name: "NVIDIA" },
  { ticker: "AMZN", name: "Amazon" },
  { ticker: "GOOGL", name: "Alphabet" },
  { ticker: "META", name: "Meta" },
  { ticker: "TSLA", name: "Tesla" },
  { ticker: "AMD", name: "AMD" },
  { ticker: "AVGO", name: "Broadcom" },
  { ticker: "JPM", name: "JPMorgan" },
  { ticker: "V", name: "Visa" },
  { ticker: "MA", name: "Mastercard" },
  { ticker: "NFLX", name: "Netflix" },
  { ticker: "CRM", name: "Salesforce" },
  { ticker: "COIN", name: "Coinbase" },
  { ticker: "PLTR", name: "Palantir" },
  { ticker: "SOFI", name: "SoFi" },
  { ticker: "BAC", name: "Bank of America" },
  { ticker: "DIS", name: "Disney" },
  { ticker: "PYPL", name: "PayPal" },
];

export async function GET() {
  return NextResponse.json({ stocks: POPULAR_US_STOCKS });
}
