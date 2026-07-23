import type {
  Account,
  CashflowMonth,
  Goal,
  Holding,
  NetWorthPoint,
  PlanMilestone,
  SpendingCategory,
  Transaction,
} from "./types";

export const USER = {
  name: "Omar Al Mazrouei",
  firstName: "Omar",
  email: "omar.almazrouei@demo.ae",
  city: "Dubai",
  emirate: "Dubai",
  household: "Al Mazrouei Household",
  occupation: "Product Lead · DIFC",
  monthlyIncome: 42000,
  avatarInitials: "OA",
};

export const ACCOUNTS: Account[] = [
  {
    id: "acc-enbd",
    name: "Current Account",
    institution: "Emirates NBD",
    type: "checking",
    balance: 86420,
    currency: "AED",
    lastSynced: "2026-07-23T09:12:00Z",
    mask: "•••• 4821",
    color: "#0B3D2E",
    change30d: 4.2,
  },
  {
    id: "acc-fab",
    name: "Savings Plus",
    institution: "FAB",
    type: "savings",
    balance: 215800,
    currency: "AED",
    lastSynced: "2026-07-23T09:10:00Z",
    mask: "•••• 9910",
    color: "#1A5F7A",
    change30d: 1.1,
  },
  {
    id: "acc-adcb",
    name: "Infinite Credit",
    institution: "ADCB",
    type: "credit",
    balance: -12480,
    currency: "AED",
    lastSynced: "2026-07-23T08:55:00Z",
    mask: "•••• 3304",
    color: "#8B4513",
    change30d: -8.4,
  },
  {
    id: "acc-sarwa",
    name: "Growth Portfolio",
    institution: "Sarwa",
    type: "investment",
    balance: 487650,
    currency: "AED",
    lastSynced: "2026-07-23T09:00:00Z",
    mask: "INV-2041",
    color: "#2D6A4F",
    change30d: 3.8,
  },
  {
    id: "acc-ibonds",
    name: "US Treasuries",
    institution: "Interactive Brokers",
    type: "investment",
    balance: 128400,
    currency: "AED",
    lastSynced: "2026-07-23T09:00:00Z",
    mask: "IB-7782",
    color: "#40916C",
    change30d: 0.6,
  },
  {
    id: "acc-crypto",
    name: "Digital Assets",
    institution: "Rain",
    type: "crypto",
    balance: 42300,
    currency: "AED",
    lastSynced: "2026-07-23T09:05:00Z",
    mask: "RAIN-11",
    color: "#52796F",
    change30d: 11.2,
  },
  {
    id: "acc-mortgage",
    name: "Home Finance",
    institution: "Emirates Islamic",
    type: "loan",
    balance: -1185000,
    currency: "AED",
    lastSynced: "2026-07-22T18:00:00Z",
    mask: "MTG-552",
    color: "#BC6C25",
  },
  {
    id: "acc-property",
    name: "Marina Residence",
    institution: "Property",
    type: "property",
    balance: 2100000,
    currency: "AED",
    lastSynced: "2026-07-01T00:00:00Z",
    mask: "DXB-MR",
    color: "#6B705C",
    change30d: 0.4,
  },
];

export const HOLDINGS: Holding[] = [
  {
    symbol: "VUAG",
    name: "Vanguard S&P 500 UCITS",
    value: 186400,
    allocation: 28.3,
    changePct: 4.1,
    assetClass: "US Equities",
  },
  {
    symbol: "VWRA",
    name: "FTSE All-World",
    value: 142200,
    allocation: 21.6,
    changePct: 3.2,
    assetClass: "Global Equities",
  },
  {
    symbol: "AEDM",
    name: "UAE Equity Basket",
    value: 98400,
    allocation: 14.9,
    changePct: 2.4,
    assetClass: "MENA Equities",
  },
  {
    symbol: "SUKUK",
    name: "Gulf Sukuk Fund",
    value: 78650,
    allocation: 11.9,
    changePct: 0.8,
    assetClass: "Fixed Income",
  },
  {
    symbol: "UST",
    name: "US Treasuries Ladder",
    value: 128400,
    allocation: 19.5,
    changePct: 0.6,
    assetClass: "Fixed Income",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    value: 28100,
    allocation: 4.3,
    changePct: 9.8,
    assetClass: "Crypto",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    value: 14200,
    allocation: 2.2,
    changePct: 14.1,
    assetClass: "Crypto",
  },
];

export const GOALS: Goal[] = [
  {
    id: "goal-ef",
    name: "Emergency Fund",
    target: 180000,
    current: 215800,
    deadline: "2026-12-31",
    icon: "shield",
    color: "#2D6A4F",
  },
  {
    id: "goal-villa",
    name: "Villa Down Payment · Arabian Ranches",
    target: 800000,
    current: 312000,
    deadline: "2029-06-01",
    icon: "home",
    color: "#1A5F7A",
  },
  {
    id: "goal-hajj",
    name: "Hajj Fund",
    target: 45000,
    current: 28400,
    deadline: "2027-05-01",
    icon: "landmark",
    color: "#BC6C25",
  },
  {
    id: "goal-edu",
    name: "Kids Education",
    target: 350000,
    current: 96400,
    deadline: "2034-09-01",
    icon: "graduation",
    color: "#6B705C",
  },
  {
    id: "goal-fi",
    name: "Financial Independence",
    target: 6500000,
    current: 1853170,
    deadline: "2042-01-01",
    icon: "spark",
    color: "#40916C",
  },
];

function buildNetWorthHistory(): NetWorthPoint[] {
  const points: NetWorthPoint[] = [];
  const start = new Date("2024-01-01");
  let net = 980000;
  for (let i = 0; i < 31; i++) {
    const d = new Date(start);
    d.setMonth(start.getMonth() + i);
    const drift = 18000 + Math.sin(i / 3) * 8000 + (i > 20 ? 12000 : 0);
    net += drift;
    const liabilities = 1280000 - i * 3200;
    const assets = net + liabilities;
    points.push({
      date: d.toISOString().slice(0, 10),
      netWorth: Math.round(net),
      assets: Math.round(assets),
      liabilities: Math.round(liabilities),
    });
  }
  // Align last point to current computed net worth
  const assets = ACCOUNTS.filter((a) => a.balance > 0).reduce(
    (s, a) => s + a.balance,
    0,
  );
  const liabilities = Math.abs(
    ACCOUNTS.filter((a) => a.balance < 0).reduce((s, a) => s + a.balance, 0),
  );
  points[points.length - 1] = {
    date: "2026-07-01",
    netWorth: assets - liabilities,
    assets,
    liabilities,
  };
  return points;
}

export const NET_WORTH_HISTORY = buildNetWorthHistory();

export const PLAN_MILESTONES: PlanMilestone[] = [
  {
    id: "m1",
    year: 2026,
    label: "Emergency fund complete",
    status: "completed",
    amount: 180000,
  },
  {
    id: "m2",
    year: 2027,
    label: "Hajj trip funded",
    status: "on-track",
    amount: 45000,
  },
  {
    id: "m3",
    year: 2029,
    label: "Arabian Ranches down payment",
    status: "on-track",
    amount: 800000,
  },
  {
    id: "m4",
    year: 2034,
    label: "Education corpus halfway",
    status: "at-risk",
    amount: 175000,
  },
  {
    id: "m5",
    year: 2042,
    label: "Financial independence",
    status: "on-track",
    amount: 6500000,
  },
];

export const PLAN_PROJECTION = Array.from({ length: 20 }, (_, i) => {
  const year = 2026 + i;
  const baseline = 1853170 * Math.pow(1.075, i) + i * 95000;
  const aggressive = 1853170 * Math.pow(1.095, i) + i * 140000;
  const conservative = 1853170 * Math.pow(1.055, i) + i * 70000;
  return {
    year,
    baseline: Math.round(baseline),
    aggressive: Math.round(aggressive),
    conservative: Math.round(conservative),
  };
});

export const CASHFLOW: CashflowMonth[] = [
  { month: "Feb", income: 42000, expenses: 26800, savings: 15200 },
  { month: "Mar", income: 42000, expenses: 29100, savings: 12900 },
  { month: "Apr", income: 45500, expenses: 27400, savings: 18100 },
  { month: "May", income: 42000, expenses: 31200, savings: 10800 },
  { month: "Jun", income: 42000, expenses: 28650, savings: 13350 },
  { month: "Jul", income: 42000, expenses: 27840, savings: 14160 },
];

export const SPENDING: SpendingCategory[] = [
  { name: "Housing", amount: 9800, pct: 35.2, color: "#1A5F7A" },
  { name: "Groceries", amount: 3200, pct: 11.5, color: "#2D6A4F" },
  { name: "Transport", amount: 2100, pct: 7.5, color: "#40916C" },
  { name: "Dining", amount: 3450, pct: 12.4, color: "#BC6C25" },
  { name: "Schooling", amount: 4200, pct: 15.1, color: "#6B705C" },
  { name: "Travel", amount: 2800, pct: 10.1, color: "#52796F" },
  { name: "Other", amount: 2290, pct: 8.2, color: "#A3B18A" },
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    accountId: "acc-adcb",
    merchant: "Waitrose · Dubai Marina",
    category: "Groceries",
    amount: -342.5,
    date: "2026-07-22",
  },
  {
    id: "tx2",
    accountId: "acc-enbd",
    merchant: "Salary · Acme Digital FZE",
    category: "Income",
    amount: 42000,
    date: "2026-07-25",
    pending: true,
  },
  {
    id: "tx3",
    accountId: "acc-adcb",
    merchant: "Emirates · DXB → LHR",
    category: "Travel",
    amount: -2180,
    date: "2026-07-18",
  },
  {
    id: "tx4",
    accountId: "acc-enbd",
    merchant: "DEWA",
    category: "Utilities",
    amount: -680,
    date: "2026-07-15",
  },
  {
    id: "tx5",
    accountId: "acc-adcb",
    merchant: "Carrefour City Centre",
    category: "Groceries",
    amount: -512.8,
    date: "2026-07-14",
  },
  {
    id: "tx6",
    accountId: "acc-enbd",
    merchant: "Sarwa Auto-Invest",
    category: "Investments",
    amount: -5000,
    date: "2026-07-12",
  },
  {
    id: "tx7",
    accountId: "acc-adcb",
    merchant: "The Cheesecake Factory",
    category: "Dining",
    amount: -286,
    date: "2026-07-11",
  },
  {
    id: "tx8",
    accountId: "acc-enbd",
    merchant: "Emirates Islamic Mortgage",
    category: "Housing",
    amount: -9800,
    date: "2026-07-05",
  },
  {
    id: "tx9",
    accountId: "acc-adcb",
    merchant: "ENOC · Sheikh Zayed Rd",
    category: "Transport",
    amount: -210,
    date: "2026-07-09",
  },
  {
    id: "tx10",
    accountId: "acc-adcb",
    merchant: "Dubai Mall · Zara",
    category: "Shopping",
    amount: -640,
    date: "2026-07-08",
  },
  {
    id: "tx11",
    accountId: "acc-fab",
    merchant: "Interest Credit",
    category: "Income",
    amount: 412,
    date: "2026-07-01",
  },
  {
    id: "tx12",
    accountId: "acc-adcb",
    merchant: "Careem",
    category: "Transport",
    amount: -68,
    date: "2026-07-20",
  },
];

export const UAE_BANKS = [
  { name: "Emirates NBD", type: "Bank" },
  { name: "First Abu Dhabi Bank", type: "Bank" },
  { name: "ADCB", type: "Bank" },
  { name: "Mashreq", type: "Bank" },
  { name: "Dubai Islamic Bank", type: "Bank" },
  { name: "Emirates Islamic", type: "Bank" },
  { name: "HSBC UAE", type: "Bank" },
  { name: "Sarwa", type: "Investments" },
  { name: "AUS Commercial Brokers", type: "Investments" },
  { name: "Rain", type: "Crypto" },
  { name: "Tabby", type: "BNPL" },
  { name: "Tamara", type: "BNPL" },
];

export function computeTotals() {
  const assets = ACCOUNTS.filter((a) => a.balance > 0).reduce(
    (s, a) => s + a.balance,
    0,
  );
  const liabilities = Math.abs(
    ACCOUNTS.filter((a) => a.balance < 0).reduce((s, a) => s + a.balance, 0),
  );
  const investments = ACCOUNTS.filter(
    (a) => a.type === "investment" || a.type === "crypto",
  ).reduce((s, a) => s + a.balance, 0);
  const cash = ACCOUNTS.filter(
    (a) => a.type === "checking" || a.type === "savings",
  ).reduce((s, a) => s + a.balance, 0);
  return {
    assets,
    liabilities,
    netWorth: assets - liabilities,
    investments,
    cash,
  };
}

export const SUGGESTED_PROMPTS = [
  "What's my net worth right now?",
  "Can I afford a villa down payment by 2029?",
  "How much did I spend on dining last month?",
  "What if I invest an extra AED 3,000/month?",
  "Show my asset allocation",
  "Am I on track for financial independence?",
];
