# Vela — B2B Buy Now, Pay Later

A modern, production-style marketing site and product experience for a B2B
**Buy Now, Pay Later** (net terms) platform. The design language blends
[Billie.io](https://www.billie.io)'s confident B2B fintech energy with the calm,
editorial minimalism of [OpenAI](https://openai.com): warm paper-white surfaces,
a signature electric-violet brand accent, big fluid display type, and generous
whitespace.

## What's inside

| Route         | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| `/`           | Marketing landing page — hero, logo strip, value props, how-it-works, feature showcase, stats, testimonials, CTA |
| `/product`    | Product overview — capabilities, use cases, developer integration + code sample |
| `/pricing`    | Transaction-based pricing tiers and an FAQ                                    |
| `/checkout`   | Interactive B2B BNPL checkout demo (choose terms → business details → instant approval → confirmation) |
| `/dashboard`  | Merchant dashboard — KPIs, volume chart, approval funnel, transactions table, payouts |

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme` tokens in `src/app/globals.css`)
- **lucide-react** for icons
- Zero runtime data dependencies — all demo data is local, so every page
  prerenders as static content.

## Design system

Design tokens (colors, radii, shadows, fonts) live in
[`src/app/globals.css`](src/app/globals.css) and are exposed to Tailwind through
`@theme`. Reusable building blocks live under `src/components/`:

- `ui/` — `Button` / `ButtonLink`
- `site/` — `Navbar`, `Footer`, `Logo`
- `marketing/` — landing-page sections + `Reveal` scroll animation
- `dashboard/` — dashboard `Sidebar`

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

### Other scripts

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

> Vela is a fictional product built for demonstration. It is not a real
> financial service.
