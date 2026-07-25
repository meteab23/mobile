export type ProductStatus = "live" | "coming-soon";

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  status: ProductStatus;
  eyebrow: string;
  headline: string;
  summary: string;
  description: string;
  terms: string[];
  highlights: { title: string; body: string }[];
  howItWorks: { step: string; title: string; body: string }[];
  pricing: {
    merchant: string;
    buyer: string;
    notes: string[];
  };
  benefits: string[];
};

export const brand = {
  name: "Yusr",
  legal: "Yusr Payments FZ-LLC",
  tagline: "B2B payments for the UAE",
  description:
    "Yusr is the modern B2B Buy Now, Pay Later platform built for the UAE — flexible trade credit, net terms, and installments that grow merchant sales while protecting cash flow.",
  email: "hello@yusr.ae",
  phone: "+971 4 000 0000",
  location: "Dubai, United Arab Emirates",
};

export const products: Product[] = [
  {
    slug: "account-trade",
    name: "Account Trade",
    shortName: "Trade Account",
    status: "live",
    eyebrow: "Available now",
    headline: "Buy on account. Settle once. Scale trade.",
    summary:
      "A revolving digital trade account with consolidated statements — the B2B payment experience buyers expect, without the credit risk for you.",
    description:
      "Account Trade gives your business customers a purchasing limit and a single monthly statement. You get paid upfront. Yusr underwrites the buyer, takes the risk, and handles collections across the UAE.",
    terms: ["Revolving limit", "Monthly statement", "Net settlement"],
    highlights: [
      {
        title: "Instant purchasing power",
        body: "Approve new and existing buyers in seconds with UAE-aware credit checks.",
      },
      {
        title: "One statement, many orders",
        body: "Buyers consolidate invoices into a clear monthly statement — less friction, larger baskets.",
      },
      {
        title: "You get paid upfront",
        body: "Yusr settles you on agreed payout terms while buyers pay later.",
      },
    ],
    howItWorks: [
      {
        step: "01",
        title: "Offer Account Trade at checkout",
        body: "Add Yusr to online, field sales, or ERP flows. Buyers select Trade Account in one click.",
      },
      {
        step: "02",
        title: "Instant credit decision",
        body: "We underwrite the buyer in real time and assign a revolving purchasing limit in AED.",
      },
      {
        step: "03",
        title: "You ship. We settle.",
        body: "Fulfil the order. Yusr pays you upfront and consolidates the buyer’s purchases into one statement.",
      },
      {
        step: "04",
        title: "Collections handled",
        body: "Buyers settle their statement. Reminders, reconciliation, and collections sit with Yusr.",
      },
    ],
    pricing: {
      merchant: "1.4% – 2.8% MDR",
      buyer: "No buyer fee on standard Trade Account",
      notes: [
        "Exact merchant discount rate depends on industry, average basket, and monthly volume.",
        "Payout timing is flexible: next-day, weekly, or net settlement.",
        "No setup fee for standard API or checkout plugins.",
      ],
    },
    benefits: [
      "Increase average order value with revolving credit",
      "Remove credit & fraud risk from your books",
      "Serve wholesale, marketplace, and repeat B2B buyers",
      "Works across e‑commerce, telesales, and in-person",
    ],
  },
  {
    slug: "pay-later",
    name: "Pay Later",
    shortName: "Pay Later",
    status: "coming-soon",
    eyebrow: "Coming soon",
    headline: "Net 30, 60, or 90 — without chasing invoices.",
    summary:
      "Classic invoice terms your buyers love. You receive funds upfront. Yusr takes the payment risk and runs collections.",
    description:
      "Pay Later brings Billie- and Mondu-style net terms to UAE B2B commerce. Offer Net 30, 60, or 90 at checkout. Buyers preserve working capital. Merchants grow conversion and AOV — risk-free.",
    terms: ["Net 30", "Net 60", "Net 90"],
    highlights: [
      {
        title: "Buyer chooses the term",
        body: "30, 60, or 90 days — selected at checkout with an instant decision.",
      },
      {
        title: "Upfront merchant payout",
        body: "Get the full order value on your payout schedule while buyers pay later.",
      },
      {
        title: "Invoice & direct debit",
        body: "Bank transfer or automated collection — clean reconciliation either way.",
      },
    ],
    howItWorks: [
      {
        step: "01",
        title: "Enable Pay Later",
        body: "Turn on Net 30 / 60 / 90 for eligible buyers in your sales channels.",
      },
      {
        step: "02",
        title: "Buyer picks a term",
        body: "At checkout, the buyer selects how long they need — we approve in real time.",
      },
      {
        step: "03",
        title: "You get paid",
        body: "Ship the goods. Yusr settles you and issues the buyer invoice with clear due dates.",
      },
      {
        step: "04",
        title: "We collect",
        body: "Reminders and collections run automatically so your team stays focused on sales.",
      },
    ],
    pricing: {
      merchant: "1.6% – 3.2% MDR",
      buyer: "Typically free for Net 30; longer terms may include a small buyer service fee",
      notes: [
        "Pricing scales with term length, risk band, and volume.",
        "Coming soon across UAE mainland and free-zone entities.",
        "Join the waitlist to co-design payout preferences with our team.",
      ],
    },
    benefits: [
      "Match the payment terms buyers already expect",
      "Win deals that would otherwise stall on cash timing",
      "Keep DSO low while buyers stretch DPO",
      "Identical experience online and offline",
    ],
  },
  {
    slug: "installments",
    name: "Installments",
    shortName: "Installments",
    status: "coming-soon",
    eyebrow: "Coming soon",
    headline: "Split large B2B purchases into 3, 4, or 6 months.",
    summary:
      "Help buyers finance bigger baskets while you receive the full amount upfront — with Yusr carrying the credit risk.",
    description:
      "Installments unlock larger orders without forcing buyers into a single lump-sum payment. Offer 3, 4, or 6 monthly instalments. Ideal for equipment, wholesale replenishment, and project-based procurement.",
    terms: ["3 months", "4 months", "6 months"],
    highlights: [
      {
        title: "Close bigger deals",
        body: "Spread cost over months so buyers can approve higher-ticket purchases faster.",
      },
      {
        title: "Full amount upfront",
        body: "Merchants receive the full order value. Yusr finances the instalment plan.",
      },
      {
        title: "Automated collections",
        body: "Monthly pulls via bank transfer or direct debit — transparent for finance teams.",
      },
    ],
    howItWorks: [
      {
        step: "01",
        title: "Buyer selects installments",
        body: "Choose 3, 4, or 6 months at checkout with a clear monthly schedule in AED.",
      },
      {
        step: "02",
        title: "Instant underwriting",
        body: "Credit decision and schedule confirmation happen in seconds.",
      },
      {
        step: "03",
        title: "Merchant is paid in full",
        body: "You receive the full amount on your payout terms — no waiting on instalments.",
      },
      {
        step: "04",
        title: "Buyer pays monthly",
        body: "Yusr collects each instalment and handles missed payments end-to-end.",
      },
    ],
    pricing: {
      merchant: "1.8% – 3.5% MDR",
      buyer: "3-month plans often fee-light; 4- and 6-month plans may include a buyer service fee",
      notes: [
        "Final fees depend on plan length, basket size, and buyer risk.",
        "Installments is launching after Pay Later — join the product waitlist.",
        "Early-access partners help shape UAE-specific instalment rules.",
      ],
    },
    benefits: [
      "Grow average order value on capital equipment & wholesale",
      "Offer consumer-grade clarity with B2B-grade controls",
      "No collections workload for your AR team",
      "Transparent schedules buyers can share with finance",
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const repaymentOptions = [
  {
    id: "pct-5",
    label: "5% of each transaction",
    detail: "Gentlest pace — ideal for thinner margins or seasonal trade.",
  },
  {
    id: "pct-10",
    label: "10% of each transaction",
    detail: "Balanced default for most UAE merchants reconnecting cash flow.",
  },
  {
    id: "pct-15",
    label: "15% of each transaction",
    detail: "Faster payoff when sales are strong and predictable.",
  },
  {
    id: "pct-20",
    label: "20% of each transaction",
    detail: "Accelerated repayment for high-velocity POS environments.",
  },
];

export const channels = [
  {
    title: "Online store",
    body: "Embed flexible B2B terms in your webshop checkout in days.",
  },
  {
    title: "Telesales & ERP",
    body: "Create payment links or push orders from your existing tools.",
  },
  {
    title: "In-person & POS",
    body: "Connect your terminals — collect repayments as a share of sales.",
  },
];

export const ambitions = [
  {
    title: "Grow revenues",
    body: "Reach double-digit sales lift by offering the payment terms UAE buyers ask for — risk free.",
  },
  {
    title: "Modernize operations",
    body: "Cut cost from credit checks, invoicing, and collections with one UAE-native platform.",
  },
  {
    title: "Expand footprint",
    body: "Serve mainland and free-zone buyers across emirates without building your own credit stack.",
  },
];

export const stats = [
  { value: "AED-first", label: "Priced and settled for UAE trade" },
  { value: "< 10s", label: "Typical credit decision time" },
  { value: "0", label: "Buyer credit risk left on your books" },
  { value: "3", label: "Products in one B2B payments platform" },
];

export const faqs = [
  {
    q: "Is Yusr only for business customers?",
    a: "Yes. Yusr is built exclusively for B2B transactions between UAE merchants and business buyers — not consumers.",
  },
  {
    q: "Who takes the credit risk?",
    a: "Yusr underwrites each eligible buyer and assumes the credit and fraud risk on approved orders. You get paid regardless of whether the buyer pays on time.",
  },
  {
    q: "How does POS repayment work?",
    a: "Connect your POS or payment gateway. Choose a repayment share — for example 10% of each transaction. On strong sales days you repay more; on quiet days you repay less. No fixed EMI pressure.",
  },
  {
    q: "When will Pay Later and Installments launch?",
    a: "Both products are in active build for the UAE. Account Trade is live today. Join the waitlist on each product page to get early access.",
  },
];
