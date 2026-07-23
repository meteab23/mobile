export type ViewId =
  | "chat"
  | "plan"
  | "portfolio"
  | "accounts"
  | "cashflow"
  | "goals"
  | "settings";

export type AccountType =
  | "checking"
  | "savings"
  | "credit"
  | "investment"
  | "loan"
  | "property"
  | "crypto";

export interface Account {
  id: string;
  name: string;
  institution: string;
  type: AccountType;
  balance: number;
  currency: "AED" | "USD";
  lastSynced: string;
  mask: string;
  color: string;
  change30d?: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  pending?: boolean;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  icon: string;
  color: string;
}

export interface Holding {
  symbol: string;
  name: string;
  value: number;
  allocation: number;
  changePct: number;
  assetClass: string;
}

export interface NetWorthPoint {
  date: string;
  netWorth: number;
  assets: number;
  liabilities: number;
}

export interface PlanMilestone {
  id: string;
  year: number;
  label: string;
  amount?: number;
  status: "on-track" | "at-risk" | "completed";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  evidence?: EvidenceBlock[];
  scenario?: ScenarioResult;
  feedback?: "up" | "down" | null;
}

export interface EvidenceBlock {
  title: string;
  detail: string;
  value?: string;
}

export interface ScenarioResult {
  title: string;
  baseline: number;
  projected: number;
  delta: number;
  unit: string;
  notes: string[];
}

export interface CashflowMonth {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface SpendingCategory {
  name: string;
  amount: number;
  pct: number;
  color: string;
}
