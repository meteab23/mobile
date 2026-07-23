# Billie — Intelligent B2B Payments

Production-grade B2B fintech landing page fusing **Billie.io** high-trust layout patterns with **OpenAI**-inspired minimalism, dark surfaces, and micro-interactions.

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS + Radix UI primitives
- Framer Motion
- Lucide React
- Zod-validated API routes

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
  app/                  # App Router pages & API routes
  components/
    landing/            # Navbar, Hero, FeatureTabs, Metrics, Footer
    widgets/            # InteractiveTerminal
    ui/                 # Shared primitives
    providers/          # Theme provider
  lib/                  # Utils, calculations, Zod schemas
```

## API routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/calculate` | POST | Fee & risk calculation (`amount`, `payoutTerm`) |
| `/api/newsletter` | POST | Lead capture newsletter subscription |
| `/api/demo` | POST | Demo request intake |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint
