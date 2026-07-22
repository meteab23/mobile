export type InvoiceStatus = "pending" | "paid" | "overdue" | "approved";

export type Invoice = {
  id: string;
  buyer: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: InvoiceStatus;
  term: string;
  issuedAt: string;
};

export type Buyer = {
  id: string;
  name: string;
  industry: string;
  limit: number;
  used: number;
  country: string;
  risk: "low" | "medium" | "high";
};

export const invoices: Invoice[] = [
  {
    id: "INV-24081",
    buyer: "Nordic Supply Co.",
    amount: 18450,
    currency: "EUR",
    dueDate: "2026-08-18",
    status: "pending",
    term: "Net 30",
    issuedAt: "2026-07-19",
  },
  {
    id: "INV-24074",
    buyer: "Helix Materials",
    amount: 9200,
    currency: "EUR",
    dueDate: "2026-07-28",
    status: "overdue",
    term: "Pay in 3",
    issuedAt: "2026-06-28",
  },
  {
    id: "INV-24069",
    buyer: "Atlas Retail Group",
    amount: 41200,
    currency: "EUR",
    dueDate: "2026-08-02",
    status: "approved",
    term: "Net 60",
    issuedAt: "2026-07-03",
  },
  {
    id: "INV-24061",
    buyer: "Cedar Logistics",
    amount: 6750,
    currency: "EUR",
    dueDate: "2026-07-12",
    status: "paid",
    term: "Net 14",
    issuedAt: "2026-06-28",
  },
  {
    id: "INV-24055",
    buyer: "Orbit Studio GmbH",
    amount: 15890,
    currency: "EUR",
    dueDate: "2026-08-25",
    status: "pending",
    term: "Pay in 3",
    issuedAt: "2026-07-15",
  },
];

export const buyers: Buyer[] = [
  {
    id: "BYR-101",
    name: "Nordic Supply Co.",
    industry: "Wholesale",
    limit: 75000,
    used: 31200,
    country: "SE",
    risk: "low",
  },
  {
    id: "BYR-094",
    name: "Helix Materials",
    industry: "Manufacturing",
    limit: 40000,
    used: 28900,
    country: "DE",
    risk: "medium",
  },
  {
    id: "BYR-088",
    name: "Atlas Retail Group",
    industry: "Retail",
    limit: 120000,
    used: 54200,
    country: "NL",
    risk: "low",
  },
  {
    id: "BYR-076",
    name: "Cedar Logistics",
    industry: "Logistics",
    limit: 25000,
    used: 6750,
    country: "FR",
    risk: "low",
  },
  {
    id: "BYR-071",
    name: "Orbit Studio GmbH",
    industry: "Creative",
    limit: 35000,
    used: 15890,
    country: "AT",
    risk: "medium",
  },
];

export const metrics = [
  { label: "Gross merchandise volume", value: "€2.4M", change: "+18%" },
  { label: "Active buyers", value: "1,284", change: "+9%" },
  { label: "Approval rate", value: "94.2%", change: "+1.4%" },
  { label: "Avg. days to pay", value: "27", change: "-3d" },
];

export const products = [
  {
    slug: "pay-later",
    title: "Pay Later",
    summary: "Get paid upfront while buyers choose flexible repayment terms.",
    detail:
      "Instant credit decisions, automatic collections, and full risk cover—so your sales team can close without chasing invoices.",
  },
  {
    slug: "pay-in-x",
    title: "Pay in 3 / 6",
    summary: "Split larger B2B purchases into clear, interest-free installments.",
    detail:
      "Ideal for higher-ticket orders. Buyers get breathing room; you keep cash flow predictable.",
  },
  {
    slug: "pay-on-account",
    title: "Pay on Account",
    summary: "Modern open-account terms with live credit limits and monitoring.",
    detail:
      "Replace manual trade credit with continuous underwriting and automated reconciliation.",
  },
];

export function formatMoney(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
