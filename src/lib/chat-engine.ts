import {
  ACCOUNTS,
  CASHFLOW,
  GOALS,
  HOLDINGS,
  PLAN_PROJECTION,
  SPENDING,
  TRANSACTIONS,
  USER,
  computeTotals,
} from "./demo-data";
import { formatAED, formatPct, uid } from "./format";
import type { ChatMessage, EvidenceBlock, ScenarioResult } from "./types";

function nowIso() {
  return new Date().toISOString();
}

function reply(
  content: string,
  extras?: Partial<Pick<ChatMessage, "evidence" | "scenario">>,
): ChatMessage {
  return {
    id: uid("msg"),
    role: "assistant",
    content,
    timestamp: nowIso(),
    feedback: null,
    ...extras,
  };
}

export function getWelcomeMessages(): ChatMessage[] {
  const { netWorth } = computeTotals();
  return [
    {
      id: "welcome-1",
      role: "assistant",
      content: `Welcome back, ${USER.firstName}. I'm Mizan — your AI personal CFO for life in the UAE.\n\nYour household net worth is **${formatAED(netWorth)}**. I can model scenarios, track cashflow, and keep your plan honest — with math you can audit.`,
      timestamp: nowIso(),
      feedback: null,
    },
  ];
}

export function generateAssistantReply(input: string): ChatMessage {
  const q = input.toLowerCase();
  const totals = computeTotals();

  if (
    q.includes("net worth") ||
    q.includes("how much am i worth") ||
    q.includes("nw")
  ) {
    const evidence: EvidenceBlock[] = [
      {
        title: "Assets",
        detail: "Cash, investments, crypto & Marina property",
        value: formatAED(totals.assets),
      },
      {
        title: "Liabilities",
        detail: "Emirates Islamic home finance + ADCB card",
        value: formatAED(totals.liabilities),
      },
      {
        title: "Net worth",
        detail: "Assets − liabilities",
        value: formatAED(totals.netWorth),
      },
    ];
    return reply(
      `Your net worth is **${formatAED(totals.netWorth)}** as of this morning.\n\nThat breaks down to ${formatAED(totals.assets)} in assets and ${formatAED(totals.liabilities)} in liabilities. The Marina Residence accounts for most of the asset base; liquid net worth (ex-property) is **${formatAED(totals.cash + totals.investments - 12480)}**.`,
      { evidence },
    );
  }

  if (
    q.includes("villa") ||
    q.includes("down payment") ||
    q.includes("arabian ranches") ||
    q.includes("afford")
  ) {
    const goal = GOALS.find((g) => g.id === "goal-villa")!;
    const remaining = goal.target - goal.current;
    const months = 35;
    const needed = remaining / months;
    const scenario: ScenarioResult = {
      title: "Villa down payment by Jun 2029",
      baseline: goal.current,
      projected: goal.target,
      delta: remaining,
      unit: "AED",
      notes: [
        `Gap remaining: ${formatAED(remaining)}`,
        `Required monthly savings: ~${formatAED(needed)}`,
        "Current auto-invest + surplus covers ~AED 8,200/mo",
      ],
    };
    return reply(
      `You're **${Math.round((goal.current / goal.target) * 100)}%** of the way to the Arabian Ranches down payment (${formatAED(goal.current)} of ${formatAED(goal.target)}).\n\nAt your current surplus of ~AED 13–15K/month and Sarwa contributions, you're on track — but only if you keep travel and dining near the Jul baseline. Raising dedicated villa savings by **AED 2,500/month** would give you a 4-month buffer before 2029.`,
      {
        scenario,
        evidence: [
          {
            title: "Current progress",
            detail: goal.name,
            value: formatAED(goal.current),
          },
          {
            title: "Monthly gap to close",
            detail: `${months} months to deadline`,
            value: formatAED(needed),
          },
        ],
      },
    );
  }

  if (
    q.includes("dining") ||
    q.includes("spent") ||
    q.includes("spend") ||
    q.includes("travel") ||
    q.includes("groceries")
  ) {
    const category =
      SPENDING.find((s) => q.includes(s.name.toLowerCase())) ||
      SPENDING.find((s) => s.name === "Dining")!;
    const txs = TRANSACTIONS.filter(
      (t) => t.category.toLowerCase() === category.name.toLowerCase(),
    );
    return reply(
      `In July so far, **${category.name.toLowerCase()}** is **${formatAED(category.amount)}** (${category.pct}% of spending).\n\n${
        txs.length
          ? `Recent ${category.name.toLowerCase()} activity:\n${txs
              .map((t) => `• ${t.merchant} — ${formatAED(t.amount)}`)
              .join("\n")}`
          : "No individual transactions matched in the recent feed."
      }\n\nCompared with your 6-month average, you're ${category.name === "Dining" ? "about 8% above trend — mostly weekend Marina dining." : "roughly in line with plan."}`,
      {
        evidence: [
          {
            title: `${category.name} · July`,
            detail: `${category.pct}% of monthly spend`,
            value: formatAED(category.amount),
          },
          {
            title: "Budget signal",
            detail: "vs. trailing 6-month average",
            value: category.name === "Dining" ? "+8%" : "In line",
          },
        ],
      },
    );
  }

  if (
    q.includes("invest") ||
    q.includes("extra") ||
    q.includes("3000") ||
    q.includes("3,000") ||
    q.includes("what if") ||
    q.includes("scenario")
  ) {
    const extra = 3000;
    const years = 16;
    const rate = 0.075;
    const futureValue =
      extra * ((Math.pow(1 + rate / 12, years * 12) - 1) / (rate / 12));
    const baselineFI = PLAN_PROJECTION[16]?.baseline ?? 6500000;
    const boosted = baselineFI + futureValue;
    const scenario: ScenarioResult = {
      title: `Extra ${formatAED(extra)}/mo invested`,
      baseline: Math.round(baselineFI),
      projected: Math.round(boosted),
      delta: Math.round(futureValue),
      unit: "AED at 2042",
      notes: [
        "Assumes 7.5% expected return (Sarwa growth mix)",
        "Monthly contribution held constant in AED",
        "Does not change mortgage prepayment schedule",
      ],
    };
    return reply(
      `If you invest an extra **${formatAED(extra)}/month** into your Sarwa growth portfolio through 2042, projected net worth rises by roughly **${formatAED(futureValue)}** versus baseline — landing near **${formatAED(boosted)}**.\n\nThat's enough to pull financial independence forward by ~14–18 months, assuming expense growth stays near inflation. You can audit the compounding math in the scenario panel.`,
      { scenario },
    );
  }

  if (
    q.includes("allocation") ||
    q.includes("portfolio") ||
    q.includes("asset")
  ) {
    const lines = HOLDINGS.map(
      (h) => `• ${h.name} — ${h.allocation}% (${formatAED(h.value)}, ${formatPct(h.changePct)} 30d)`,
    ).join("\n");
    return reply(
      `Here's your investable allocation across Sarwa, IB, and Rain:\n\n${lines}\n\nEquities are ~65%, fixed income ~31%, crypto ~6%. For a DIFC salary with a UAE property anchor, this is growth-tilted but not reckless. A 5% shift from US equities into Gulf sukuk would lower expected drawdown by ~1.2 pts.`,
      {
        evidence: HOLDINGS.slice(0, 4).map((h) => ({
          title: h.symbol,
          detail: h.assetClass,
          value: `${h.allocation}%`,
        })),
      },
    );
  }

  if (
    q.includes("financial independence") ||
    q.includes("fi ") ||
    q.includes("retire") ||
    q.includes("on track") ||
    q.includes("plan")
  ) {
    const fi = GOALS.find((g) => g.id === "goal-fi")!;
    const pct = Math.round((fi.current / fi.target) * 100);
    return reply(
      `You're **${pct}%** of the way to your AED 6.5M financial independence target (${formatAED(fi.current)}).\n\nOn the baseline plan (7.5% returns, current savings rate ~33%), you hit the number in **2042**. The at-risk item is the education corpus — increase monthly transfers by AED 800 or the 2034 milestone slips ~11 months.\n\nEmergency fund is already complete. Hajj and villa goals remain on track.`,
      {
        evidence: [
          {
            title: "FI progress",
            detail: "Target AED 6.5M by 2042",
            value: `${pct}%`,
          },
          {
            title: "Savings rate",
            detail: "Last 6 months average",
            value: "33%",
          },
        ],
        scenario: {
          title: "Baseline path to FI",
          baseline: fi.current,
          projected: fi.target,
          delta: fi.target - fi.current,
          unit: "AED",
          notes: [
            "Expected return 7.5% blended",
            "Salary growth 3% nominal",
            "Expense inflation 2.5%",
          ],
        },
      },
    );
  }

  if (q.includes("cashflow") || q.includes("cash flow") || q.includes("salary")) {
    const latest = CASHFLOW[CASHFLOW.length - 1];
    const avgSave =
      CASHFLOW.reduce((s, m) => s + m.savings, 0) / CASHFLOW.length;
    return reply(
      `July cashflow so far: income **${formatAED(latest.income)}**, expenses **${formatAED(latest.expenses)}**, surplus **${formatAED(latest.savings)}**.\n\nYour trailing 6-month average surplus is **${formatAED(avgSave)}**. Housing (mortgage + DEWA) is the largest fixed commitment at ~AED 10.5K. There's room to raise investments without touching lifestyle if you trim dining back to May levels.`,
      {
        evidence: CASHFLOW.slice(-3).map((m) => ({
          title: m.month,
          detail: "Income → surplus",
          value: formatAED(m.savings),
        })),
      },
    );
  }

  if (q.includes("credit") || q.includes("card") || q.includes("debt")) {
    const card = ACCOUNTS.find((a) => a.id === "acc-adcb")!;
    return reply(
      `ADCB Infinite balance is **${formatAED(Math.abs(card.balance))}**. That's within a normal pay-cycle float for your spending — not structural debt.\n\nPay it from Emirates NBD before the statement date to avoid interest. Your mortgage is the only long-term liability (${formatAED(1185000)} outstanding at Emirates Islamic).`,
      {
        evidence: [
          {
            title: "Credit card",
            detail: "ADCB Infinite",
            value: formatAED(Math.abs(card.balance)),
          },
          {
            title: "Home finance",
            detail: "Emirates Islamic",
            value: formatAED(1185000),
          },
        ],
      },
    );
  }

  // Default helpful response
  return reply(
    `I looked across your UAE accounts for “${input.trim()}”.\n\nHere's the snapshot I can act on right now:\n• Net worth **${formatAED(totals.netWorth)}**\n• Liquid cash **${formatAED(totals.cash)}**\n• Investable assets **${formatAED(totals.investments)}**\n\nTry asking about net worth, villa affordability, dining spend, extra investing, allocation, or whether you're on track for FI — I can show the math with evidence.`,
    {
      evidence: [
        {
          title: "Net worth",
          detail: "Household total",
          value: formatAED(totals.netWorth),
        },
        {
          title: "Demo mode",
          detail: "Answers grounded in sample UAE data",
          value: "Live",
        },
      ],
    },
  );
}
