export type PayoutTerm = 30 | 60 | 90;

export interface FeeCalculationInput {
  amount: number;
  payoutTerm: PayoutTerm;
}

export interface FeeCalculationResult {
  amount: number;
  payoutTerm: PayoutTerm;
  feeRate: number;
  feeAmount: number;
  netPayout: number;
  riskScore: number;
  riskLabel: "Low" | "Moderate" | "Elevated";
  cashAvailableInDays: number;
  underwritingStatus: "Approved" | "Review" | "Manual Check";
}

const BASE_FEE_RATE = 0.018;
const TERM_PREMIUM: Record<PayoutTerm, number> = {
  30: 0,
  60: 0.008,
  90: 0.016,
};

export function calculatePaymentTerms(
  input: FeeCalculationInput
): FeeCalculationResult {
  const amount = Math.min(100_000, Math.max(1_000, input.amount));
  const payoutTerm = input.payoutTerm;

  const amountPremium = amount > 50_000 ? 0.004 : amount > 25_000 ? 0.002 : 0;
  const feeRate = BASE_FEE_RATE + TERM_PREMIUM[payoutTerm] + amountPremium;
  const feeAmount = amount * feeRate;
  const netPayout = amount - feeAmount;

  // Higher amount + longer terms slightly elevate risk for demo purposes
  const riskScore = Math.min(
    98,
    Math.round(12 + amount / 2_500 + payoutTerm / 3)
  );

  let riskLabel: FeeCalculationResult["riskLabel"] = "Low";
  let underwritingStatus: FeeCalculationResult["underwritingStatus"] =
    "Approved";

  if (riskScore >= 55) {
    riskLabel = "Elevated";
    underwritingStatus = "Manual Check";
  } else if (riskScore >= 35) {
    riskLabel = "Moderate";
    underwritingStatus = "Review";
  }

  return {
    amount,
    payoutTerm,
    feeRate,
    feeAmount,
    netPayout,
    riskScore,
    riskLabel,
    cashAvailableInDays: 1,
    underwritingStatus,
  };
}
