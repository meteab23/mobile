# Yusr — B2B BNPL for the UAE

Modern Buy Now, Pay Later platform for UAE merchants. Design language blends **Billie** / **Mondu** product clarity with **OpenAI**-style soft gradient surfaces and **YouLend**-style POS repayments.

## Products

| Product | Terms | Status |
| --- | --- | --- |
| **Account Trade** | Revolving trade account + monthly statement | Live |
| **Pay Later** | Net 30 / 60 / 90 | Coming soon |
| **Installments** | 3 / 4 / 6 months | Coming soon |

Each product page covers **how it works** and **pricing** (merchant MDR + buyer fees).

## POS & repayments

Connect terminals / gateways and repay as a share of sales (5–20%, e.g. 10% of each transaction) — interactive modeller on `/repayments`.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 3
- Framer Motion + lucide-react

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Routes

- `/` — homepage with gradient hero art
- `/products` — product index
- `/products/account-trade` · `/pay-later` · `/installments`
- `/repayments` — POS sales-based repayment
- `/pricing` · `/how-it-works` · `/demo`
