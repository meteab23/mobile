# Fleurétern — everlasting flowers

A modern, minimal storefront for **Fleurétern**, an artificial flower brand. The visual identity follows the brand mark: warm paper cream, soft charcoal ink, wide-tracked serif capitals, and the oval arch frame with a fine line-art bloom.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview
```

## What's inside

- **Home** — hero, benefits, collections, bestsellers, brand story, reviews, promo banner
- **Shop** — category tabs, colour filter, sort, search (`/shop?category=bouquets&color=Blush&sort=price-asc&q=peony`)
- **Product page** — size options, optional ceramic vase add-on, quantity, wishlist, buy now, details / care / delivery accordions, related products
- **Cart** — slide-out drawer with free-delivery progress, plus a full cart page with promo codes
- **Checkout** — three steps (details, delivery, payment) with inline validation, delivery date picker, gift wrap and card message, live order summary
- **Order confirmation** — order number, timeline, totals, and method-specific details (e.g. bank transfer instructions)
- **Wishlist**, **Our story / care / delivery / returns**, 404

### Payment methods (all simulated — no real charges)

| Method | Behaviour |
| --- | --- |
| Credit / debit card | Number formatting, brand detection, Luhn check, expiry and CVC validation. `4242 4242 4242 4242` succeeds, `4000 0000 0000 0002` is declined |
| PayPal | Opens a mock PayPal login/approve window |
| Apple Pay | Opens a mock payment sheet (Face ID confirmation) |
| Google Pay | Opens a mock payment sheet |
| Pay in 3 | Shows an instalment schedule; first third is charged today |
| Bank transfer | Order is reserved; transfer details and reference are shown on confirmation |
| Cash on delivery | Adds a $3 handling fee |

### Promo codes

`FLEUR10` (10% off), `WELCOME15` (15% off), `FREESHIP` (free standard delivery). Orders over $75 ship free (standard).

## Product imagery

Product visuals are generated in code (`src/art/FlowerArt.tsx`) as fine-line botanical illustrations in the brand's style, so the demo has no external image dependencies. Each product in `src/data/products.ts` is a small composition (blooms, foliage, vase or paper wrap). Swap in photography by replacing `ArtSvg` in `ProductCard` and the product page.

## Stack

Vite, React 19, TypeScript, React Router. State (cart, wishlist, orders) is persisted in `localStorage`. Fonts: Cormorant Garamond and Jost via Fontsource (self-hosted).
