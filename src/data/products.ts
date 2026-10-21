import type { Art } from '../art/FlowerArt'

export type Category = 'bouquets' | 'arrangements' | 'stems' | 'gifts'

export interface Product {
  id: string
  name: string
  category: Category
  price: number
  tagline: string
  description: string
  highlights: string[]
  colors: string[]
  badge?: 'Bestseller' | 'New' | 'Limited'
  rating: number
  reviews: number
  sized: boolean
  vaseAddOn: boolean
  art: Art
}

export const CATEGORIES: { id: Category; label: string; blurb: string }[] = [
  { id: 'bouquets', label: 'Bouquets', blurb: 'Hand-tied and wrapped, ready to gift.' },
  { id: 'arrangements', label: 'Arrangements', blurb: 'Styled in a vessel for tables, shelves and sills.' },
  { id: 'stems', label: 'Single Stems', blurb: 'Build your own, one bloom at a time.' },
  { id: 'gifts', label: 'Gift Sets', blurb: 'Boxed, ribboned, and quietly generous.' },
]

export const COLOR_FILTERS: { name: string; swatch: string }[] = [
  { name: 'Blush', swatch: '#e8bdbb' },
  { name: 'Ivory', swatch: '#f1e9da' },
  { name: 'Sage', swatch: '#a3b295' },
  { name: 'Lavender', swatch: '#b9aacb' },
  { name: 'Terracotta', swatch: '#c98a6d' },
  { name: 'Burgundy', swatch: '#8c3f4b' },
  { name: 'Butter', swatch: '#ead493' },
]

export const SIZES = [
  { id: 'petite', label: 'Petite', note: 'Approx. 9 stems', mult: 0.8 },
  { id: 'classic', label: 'Classic', note: 'Approx. 15 stems', mult: 1 },
  { id: 'grand', label: 'Grand', note: 'Approx. 24 stems', mult: 1.45 },
] as const

export type SizeId = (typeof SIZES)[number]['id']

export const VASE_PRICE = 28

const BLUSH = '#e7b9b6'
const IVORY = '#f3ebdc'
const SAGE = '#a3b295'
const LAV = '#b9aacb'
const TERRA = '#cb8b6e'
const BURG = '#93404d'
const BUTTER = '#ecd596'
const BLUE = '#a9b6d6'
const CORAL = '#e69a86'

const bgCream = '#efe6d8'
const bgRose = '#f1dcd8'
const bgSage = '#dfe4d3'
const bgLav = '#e4dded'
const bgSand = '#eadfce'
const bgClay = '#efd9cb'
const bgButter = '#f2e8c9'
const bgBlue = '#dde3ee'

const kraft = '#f1e7d6'

export const PRODUCTS: Product[] = [
  {
    id: 'blush-peony-bouquet',
    name: 'Blush Peony Bouquet',
    category: 'bouquets',
    price: 68,
    tagline: 'Full-bodied peonies, softly wrapped',
    description:
      'Our best-loved bouquet. Lush blush peonies are tucked between silvery eucalyptus and a veil of gypsophila, then hand-wrapped in textured paper with a silk ribbon. Every petal is individually shaped so it catches the light like a freshly cut bloom.',
    highlights: ['Hand-shaped silk petals', 'Wired stems — gently posable', 'Wrapped in recycled paper', 'Ships in a protective box'],
    colors: ['Blush', 'Sage'],
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 312,
    sized: true,
    vaseAddOn: true,
    art: {
      bg: bgRose,
      wrap: { color: kraft, ribbon: BLUSH },
      foliage: [
        { kind: 'eucalyptus', len: 270, rot: -22, color: SAGE, ox: -10 },
        { kind: 'eucalyptus', len: 250, rot: 24, color: SAGE, ox: 10 },
        { kind: 'gypsophila', len: 250, rot: 8, color: '#f6efe6' },
        { kind: 'gypsophila', len: 220, rot: -36, color: '#f6efe6' },
      ],
      blooms: [
        { kind: 'peony', x: 200, y: 190, r: 62, color: BLUSH },
        { kind: 'peony', x: 128, y: 255, r: 52, color: mixHex(BLUSH, '#ffffff'), ox: -8, rot: -20 },
        { kind: 'peony', x: 276, y: 258, r: 50, color: BLUSH, ox: 8, rot: 18 },
        { kind: 'ranunculus', x: 202, y: 300, r: 34, color: IVORY, rot: 10 },
      ],
    },
  },
  {
    id: 'garden-rose-reverie',
    name: 'Garden Rose Reverie',
    category: 'bouquets',
    price: 74,
    tagline: 'Romantic roses with a trailing fern',
    description:
      'Layered garden roses in cream and dusty pink, finished with delicate fern fronds. A timeless, romantic bouquet that looks as good in year three as it did on day one.',
    highlights: ['Realistic touch-feel petals', 'UV-resistant colour', 'Fragrance-free (add our Linen mist)', 'Gift note included'],
    colors: ['Blush', 'Ivory', 'Sage'],
    badge: 'Bestseller',
    rating: 4.8,
    reviews: 204,
    sized: true,
    vaseAddOn: true,
    art: {
      bg: bgCream,
      wrap: { color: '#f4ecdf', ribbon: SAGE },
      foliage: [
        { kind: 'fern', len: 260, rot: -30, color: SAGE },
        { kind: 'fern', len: 250, rot: 30, color: SAGE },
        { kind: 'fern', len: 280, rot: 0, color: SAGE, ox: 4 },
      ],
      blooms: [
        { kind: 'rose', x: 200, y: 200, r: 54, color: IVORY },
        { kind: 'rose', x: 138, y: 258, r: 48, color: BLUSH, rot: -15 },
        { kind: 'rose', x: 266, y: 262, r: 48, color: '#e2a9a8', rot: 15 },
        { kind: 'rose', x: 200, y: 304, r: 40, color: BLUSH },
      ],
    },
  },
  {
    id: 'wildflower-meadow',
    name: 'Wildflower Meadow',
    category: 'bouquets',
    price: 62,
    tagline: 'Cosmos, anemones and lavender',
    description:
      'An undone, just-picked-from-the-field bouquet. Soft cosmos and inky-centred anemones sit among lavender spires and feathery pampas for a relaxed, painterly feel.',
    highlights: ['Mixed-texture stems', 'Lightweight and easy to post', 'Pairs beautifully with the Cylinder vase', 'Wrapped in recycled paper'],
    colors: ['Lavender', 'Blush', 'Ivory'],
    rating: 4.7,
    reviews: 118,
    sized: true,
    vaseAddOn: true,
    art: {
      bg: bgLav,
      wrap: { color: kraft, ribbon: LAV },
      foliage: [
        { kind: 'lavender', len: 290, rot: -30, color: LAV, ox: -12 },
        { kind: 'lavender', len: 300, rot: 28, color: LAV, ox: 12 },
        { kind: 'lavender', len: 270, rot: 6, color: '#a898c0' },
        { kind: 'pampas', len: 250, rot: -14, color: '#e8d9bf' },
      ],
      blooms: [
        { kind: 'anemone', x: 196, y: 228, r: 40, color: IVORY },
        { kind: 'cosmos', x: 132, y: 272, r: 38, color: BLUSH, rot: 10 },
        { kind: 'cosmos', x: 270, y: 262, r: 36, color: '#f1d6d3', rot: -8 },
        { kind: 'anemone', x: 208, y: 306, r: 30, color: LAV, rot: 15 },
      ],
    },
  },
  {
    id: 'tulip-morning',
    name: 'Tulip Morning',
    category: 'bouquets',
    price: 52,
    tagline: 'Spring in butter, blush and coral',
    description:
      'A bright cluster of tulips in butter yellow, blush pink and warm coral. Slender curved stems give it that gently drooping, freshly-arranged look.',
    highlights: ['Soft-touch petals', 'Curved, posable stems', 'Arrives wrapped and ribboned', 'Cheerful all year round'],
    colors: ['Butter', 'Blush'],
    badge: 'New',
    rating: 4.8,
    reviews: 76,
    sized: true,
    vaseAddOn: true,
    art: {
      bg: bgButter,
      wrap: { color: '#f6efe0', ribbon: CORAL },
      foliage: [{ kind: 'fern', len: 230, rot: -34, color: SAGE }, { kind: 'fern', len: 230, rot: 34, color: SAGE }],
      blooms: [
        { kind: 'tulip', x: 200, y: 250, r: 44, color: BUTTER },
        { kind: 'tulip', x: 136, y: 280, r: 40, color: BLUSH, rot: -14 },
        { kind: 'tulip', x: 266, y: 282, r: 40, color: CORAL, rot: 14 },
        { kind: 'tulip', x: 168, y: 214, r: 36, color: '#f3c6bd', rot: -8, ox: -6 },
        { kind: 'tulip', x: 236, y: 218, r: 36, color: '#f5df9f', rot: 8, ox: 6 },
      ],
    },
  },
  {
    id: 'burgundy-poppy-romance',
    name: 'Burgundy Poppy Romance',
    category: 'bouquets',
    price: 66,
    tagline: 'Deep, moody and quietly dramatic',
    description:
      'Velvety burgundy poppies and dark-centred anemones with sprigs of eucalyptus. A rich, evening-light palette for those who like their flowers with a little drama.',
    highlights: ['Velvet-finish petals', 'Deep wine tones that do not fade', 'Wrapped with sage ribbon', 'Great for autumn styling'],
    colors: ['Burgundy', 'Sage'],
    badge: 'Limited',
    rating: 4.9,
    reviews: 58,
    sized: true,
    vaseAddOn: true,
    art: {
      bg: '#e9d6d3',
      wrap: { color: '#efe4d3', ribbon: BURG },
      foliage: [{ kind: 'eucalyptus', len: 280, rot: -26, color: '#8fa08a' }, { kind: 'eucalyptus', len: 260, rot: 26, color: '#8fa08a' }],
      blooms: [
        { kind: 'poppy', x: 198, y: 214, r: 50, color: BURG },
        { kind: 'poppy', x: 132, y: 270, r: 42, color: '#a84d5a', rot: 25 },
        { kind: 'anemone', x: 270, y: 268, r: 38, color: '#e9c6c6' },
        { kind: 'ranunculus', x: 204, y: 308, r: 30, color: '#b86672' },
      ],
    },
  },
  {
    id: 'ivory-ranunculus-cylinder',
    name: 'Ivory Ranunculus Cylinder',
    category: 'arrangements',
    price: 84,
    tagline: 'Layered ranunculus in a ceramic cylinder',
    description:
      'Densely layered ivory and butter ranunculus arranged in a matte stone-glazed ceramic cylinder. A calm, sculptural centrepiece that needs nothing from you — no water, no trimming.',
    highlights: ['Matte stone ceramic vase', 'Arranged and fixed in place', 'Ready to display on arrival', 'Dust with a soft brush'],
    colors: ['Ivory', 'Butter'],
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 267,
    sized: true,
    vaseAddOn: false,
    art: {
      bg: bgCream,
      vase: { kind: 'cylinder', color: '#ece3d3' },
      foliage: [{ kind: 'eucalyptus', len: 190, rot: -38, color: SAGE }, { kind: 'eucalyptus', len: 200, rot: 40, color: SAGE }],
      blooms: [
        { kind: 'ranunculus', x: 200, y: 200, r: 52, color: IVORY },
        { kind: 'ranunculus', x: 138, y: 262, r: 46, color: '#f5e6bf', rot: 10, ox: -14 },
        { kind: 'ranunculus', x: 264, y: 262, r: 46, color: IVORY, rot: -10, ox: 14 },
        { kind: 'ranunculus', x: 200, y: 296, r: 36, color: '#f0dcb0' },
      ],
    },
  },
  {
    id: 'hydrangea-cloud',
    name: 'Hydrangea Cloud',
    category: 'arrangements',
    price: 92,
    tagline: 'Pillowy blue-lilac hydrangea in a round vase',
    description:
      'Clustered hydrangea in washed blue and lilac, nestled in a round, hand-glazed vessel. Generous, soft and endlessly photogenic.',
    highlights: ['Hundreds of tiny florets per head', 'Hand-glazed round vase', 'Anchored with weighted foam', 'Statement size'],
    colors: ['Lavender'],
    rating: 4.8,
    reviews: 143,
    sized: true,
    vaseAddOn: false,
    art: {
      bg: bgBlue,
      vase: { kind: 'round', color: '#efe8da' },
      foliage: [{ kind: 'eucalyptus', len: 150, rot: -52, color: SAGE }, { kind: 'eucalyptus', len: 150, rot: 52, color: SAGE }],
      blooms: [
        { kind: 'hydrangea', x: 200, y: 230, r: 82, color: BLUE },
        { kind: 'hydrangea', x: 128, y: 300, r: 58, color: LAV, ox: -20 },
        { kind: 'hydrangea', x: 274, y: 300, r: 58, color: '#b5c3dd', ox: 20 },
      ],
    },
  },
  {
    id: 'cherry-blossom-branch',
    name: 'Cherry Blossom Branches',
    category: 'arrangements',
    price: 79,
    tagline: 'Three sculptural branches in a bud vase',
    description:
      'Three tall, airy branches covered in blush blossom and tiny buds. A graceful nod to spring that holds its shape year-round.',
    highlights: ['Over 120 hand-assembled blossoms', 'Bendable wired branches', 'Hand-poured bud vase', 'About 70cm tall'],
    colors: ['Blush'],
    badge: 'New',
    rating: 4.7,
    reviews: 91,
    sized: false,
    vaseAddOn: false,
    art: {
      bg: bgRose,
      vase: { kind: 'bud', color: '#ede4d4' },
      blooms: [],
      foliage: [
        { kind: 'blossom', len: 310, rot: -22, color: BLUSH, ox: -6 },
        { kind: 'blossom', len: 330, rot: 14, color: '#f0cbc7', ox: 6 },
        { kind: 'blossom', len: 270, rot: 40, color: BLUSH },
      ],
    },
  },
  {
    id: 'pampas-lavender-table-piece',
    name: 'Pampas & Lavender Table Piece',
    category: 'arrangements',
    price: 72,
    tagline: 'Neutral plumes with a breath of purple',
    description:
      'Feathery pampas plumes and lavender spires in a low stone bowl. Textural, warm and effortlessly modern — made for dining tables and consoles.',
    highlights: ['Shed-free plumes', 'Low profile for dining tables', 'Weighted stone bowl', 'Neutral colour story'],
    colors: ['Ivory', 'Lavender'],
    rating: 4.6,
    reviews: 64,
    sized: true,
    vaseAddOn: false,
    art: {
      bg: bgSand,
      vase: { kind: 'bowl', color: '#e5d9c6' },
      blooms: [],
      foliage: [
        { kind: 'pampas', len: 290, rot: -16, color: '#e6d5b8', ox: -20 },
        { kind: 'pampas', len: 300, rot: 15, color: '#ecdcc0', ox: 20 },
        { kind: 'pampas', len: 280, rot: -4, color: '#e2cfb0' },
        { kind: 'lavender', len: 230, rot: -34, color: LAV, ox: -34 },
        { kind: 'lavender', len: 240, rot: 36, color: LAV, ox: 34 },
      ],
    },
  },
  {
    id: 'terracotta-anemone-bowl',
    name: 'Terracotta Anemone Bowl',
    category: 'arrangements',
    price: 88,
    tagline: 'Warm clay tones with inky centres',
    description:
      'Terracotta and cream anemones with deep indigo centres, arranged in a low glazed bowl. A warm, grounded piece for earthy interiors.',
    highlights: ['Hand-painted petal edges', 'Low glazed bowl', 'Fixed arrangement', 'Terracotta, cream and sage'],
    colors: ['Terracotta', 'Ivory'],
    rating: 4.8,
    reviews: 83,
    sized: true,
    vaseAddOn: false,
    art: {
      bg: bgClay,
      vase: { kind: 'bowl', color: '#e9d2c1' },
      foliage: [{ kind: 'fern', len: 140, rot: -42, color: SAGE, ox: -30 }, { kind: 'fern', len: 140, rot: 42, color: SAGE, ox: 30 }],
      blooms: [
        { kind: 'anemone', x: 200, y: 290, r: 50, color: TERRA },
        { kind: 'anemone', x: 130, y: 330, r: 42, color: IVORY, ox: -28, rot: 12 },
        { kind: 'anemone', x: 272, y: 328, r: 42, color: '#d9a183', ox: 28, rot: -8 },
        { kind: 'cosmos', x: 168, y: 248, r: 34, color: '#e7c6b4', ox: -10, rot: 15 },
        { kind: 'cosmos', x: 236, y: 244, r: 34, color: IVORY, ox: 10, rot: -10 },
      ],
    },
  },
  {
    id: 'sage-gypsophila-bud-trio',
    name: 'Sage & Gypsophila Bud Vase',
    category: 'arrangements',
    price: 44,
    tagline: 'A small gesture in a little vase',
    description:
      'Airy gypsophila and sage eucalyptus with a single blush ranunculus, in a hand-poured bud vase. The simplest way to make a shelf feel considered.',
    highlights: ['Perfect for desks and bedside tables', 'Hand-poured bud vase', 'Under 30cm tall', 'Easy gifting'],
    colors: ['Sage', 'Ivory'],
    rating: 4.7,
    reviews: 189,
    sized: false,
    vaseAddOn: false,
    art: {
      bg: bgSage,
      vase: { kind: 'bud', color: '#eee6d6' },
      foliage: [
        { kind: 'gypsophila', len: 230, rot: -20, color: '#f7f0e4' },
        { kind: 'gypsophila', len: 250, rot: 20, color: '#f7f0e4' },
        { kind: 'eucalyptus', len: 220, rot: -4, color: SAGE },
      ],
      blooms: [{ kind: 'ranunculus', x: 200, y: 232, r: 40, color: BLUSH }],
    },
  },
  {
    id: 'peony-stem',
    name: 'Peony Stem',
    category: 'stems',
    price: 14,
    tagline: 'A single, generous bloom',
    description: 'One full peony on a wired stem with two leaves, around 60cm tall. Choose a colour and mix freely.',
    highlights: ['60cm wired stem', 'Silk-touch petals', 'Mix and match', 'Sold individually'],
    colors: ['Blush', 'Ivory'],
    rating: 4.9,
    reviews: 421,
    sized: false,
    vaseAddOn: false,
    art: { bg: bgRose, blooms: [{ kind: 'peony', x: 200, y: 190, r: 78, color: BLUSH }] },
  },
  {
    id: 'garden-rose-stem',
    name: 'Garden Rose Stem',
    category: 'stems',
    price: 12,
    tagline: 'Classic, layered, unfussy',
    description: 'A single open garden rose with a velvety finish on a 55cm wired stem.',
    highlights: ['55cm wired stem', 'Layered petals', 'Sold individually'],
    colors: ['Blush', 'Burgundy', 'Ivory'],
    rating: 4.8,
    reviews: 355,
    sized: false,
    vaseAddOn: false,
    art: { bg: '#ecdadb', blooms: [{ kind: 'rose', x: 200, y: 200, r: 70, color: '#c06471' }] },
  },
  {
    id: 'eucalyptus-bundle',
    name: 'Silver Dollar Eucalyptus',
    category: 'stems',
    price: 18,
    tagline: 'Three silvery stems with rounded leaves',
    description: 'A bundle of three eucalyptus stems with softly rounded, silver-green leaves. Beautiful on their own or as a base for any arrangement.',
    highlights: ['Bundle of 3', 'Around 70cm', 'Bendable wire core'],
    colors: ['Sage'],
    rating: 4.7,
    reviews: 238,
    sized: false,
    vaseAddOn: false,
    art: {
      bg: bgSage,
      blooms: [],
      foliage: [
        { kind: 'eucalyptus', len: 360, rot: -18, color: SAGE, ox: -8 },
        { kind: 'eucalyptus', len: 380, rot: 4, color: '#98a98b' },
        { kind: 'eucalyptus', len: 340, rot: 22, color: SAGE, ox: 8 },
      ],
    },
  },
  {
    id: 'lavender-bundle',
    name: 'Provence Lavender Bundle',
    category: 'stems',
    price: 20,
    tagline: 'Slim spires in dusty purple',
    description: 'A bundle of five lavender stems, tied with raffia. Sits easily in a bud vase or hangs to dress a doorway.',
    highlights: ['Bundle of 5', 'Raffia tie', 'Sheds nothing'],
    colors: ['Lavender'],
    rating: 4.6,
    reviews: 147,
    sized: false,
    vaseAddOn: false,
    art: {
      bg: bgLav,
      blooms: [],
      foliage: [
        { kind: 'lavender', len: 380, rot: -20, color: LAV, ox: -12 },
        { kind: 'lavender', len: 400, rot: -6, color: '#a898c0' },
        { kind: 'lavender', len: 370, rot: 8, color: LAV },
        { kind: 'lavender', len: 390, rot: 22, color: '#b3a3c8', ox: 12 },
      ],
    },
  },
  {
    id: 'pampas-plume-stems',
    name: 'Pampas Plume Stems',
    category: 'stems',
    price: 22,
    tagline: 'Soft, golden and weightless',
    description: 'Three tall pampas plumes in natural champagne. Lightly sealed so they stay fluffy without shedding.',
    highlights: ['Bundle of 3', 'Around 90cm', 'Shed-free finish'],
    colors: ['Ivory', 'Butter'],
    rating: 4.5,
    reviews: 96,
    sized: false,
    vaseAddOn: false,
    art: {
      bg: bgSand,
      blooms: [],
      foliage: [
        { kind: 'pampas', len: 320, rot: -18, color: '#e4d2b4', ox: -10 },
        { kind: 'pampas', len: 340, rot: 6, color: '#ead9bd' },
        { kind: 'pampas', len: 305, rot: 24, color: '#e1ceae', ox: 10 },
      ],
    },
  },
  {
    id: 'tulip-stems',
    name: 'Tulip Stems, Set of 3',
    category: 'stems',
    price: 24,
    tagline: 'Slim, curved, a little bit playful',
    description: 'Three tulips in your choice of colour, with bendy stems so you can make them lean and droop just so.',
    highlights: ['Set of 3', '45cm stems', 'Posable'],
    colors: ['Butter', 'Blush'],
    rating: 4.8,
    reviews: 132,
    sized: false,
    vaseAddOn: false,
    art: {
      bg: bgButter,
      blooms: [
        { kind: 'tulip', x: 156, y: 220, r: 42, color: BUTTER, rot: -10, ox: -14 },
        { kind: 'tulip', x: 202, y: 170, r: 46, color: '#f3d98f' },
        { kind: 'tulip', x: 250, y: 228, r: 42, color: '#f0d27f', rot: 12, ox: 14 },
      ],
    },
  },
  {
    id: 'signature-gift-box',
    name: 'The Signature Gift Set',
    category: 'gifts',
    price: 120,
    tagline: 'Peonies, a ceramic vase and a handwritten note',
    description:
      'Our most thoughtful gift: blush peonies and eucalyptus arranged in a stone-glazed bud vase, boxed with a linen ribbon, a handwritten card and a Fleurétern linen mist.',
    highlights: ['Peony and eucalyptus arrangement', 'Ceramic bud vase', 'Handwritten card included', 'Presented in a keepsake box'],
    colors: ['Blush', 'Sage'],
    badge: 'Bestseller',
    rating: 5,
    reviews: 174,
    sized: false,
    vaseAddOn: false,
    art: {
      bg: bgRose,
      vase: { kind: 'bud', color: '#ece3d3' },
      foliage: [{ kind: 'eucalyptus', len: 230, rot: -30, color: SAGE }, { kind: 'eucalyptus', len: 230, rot: 32, color: SAGE }],
      blooms: [
        { kind: 'peony', x: 200, y: 215, r: 58, color: BLUSH },
        { kind: 'peony', x: 140, y: 275, r: 42, color: '#f0cdca', ox: -8, rot: -25 },
        { kind: 'peony', x: 262, y: 278, r: 42, color: BLUSH, ox: 8, rot: 25 },
      ],
    },
  },
  {
    id: 'celebration-table-set',
    name: 'Celebration Table Set',
    category: 'gifts',
    price: 280,
    tagline: 'Six coordinated pieces for a long table',
    description:
      'A set of six matching table arrangements: two statement pieces and four bud vases. Designed for weddings, dinners and celebrations that deserve a calm, floral backdrop.',
    highlights: ['2 statement + 4 bud vases', 'Coordinated palette', 'Reusable for every occasion', 'Free delivery'],
    colors: ['Ivory', 'Blush', 'Sage'],
    badge: 'New',
    rating: 4.9,
    reviews: 41,
    sized: false,
    vaseAddOn: false,
    art: {
      bg: bgCream,
      vase: { kind: 'cylinder', color: '#efe7d8' },
      foliage: [
        { kind: 'gypsophila', len: 230, rot: -28, color: '#f7f0e4', ox: -30 },
        { kind: 'gypsophila', len: 240, rot: 30, color: '#f7f0e4', ox: 30 },
        { kind: 'eucalyptus', len: 200, rot: 0, color: SAGE },
      ],
      blooms: [
        { kind: 'rose', x: 200, y: 214, r: 50, color: IVORY },
        { kind: 'peony', x: 140, y: 276, r: 44, color: BLUSH, ox: -16, rot: -20 },
        { kind: 'ranunculus', x: 262, y: 274, r: 40, color: '#f4e5be', ox: 16, rot: 10 },
        { kind: 'cosmos', x: 200, y: 310, r: 30, color: '#f1d6d3' },
      ],
    },
  },
]

function mixHex(a: string, b: string) {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (s: number) => Math.round(((pa >> s) & 255) * 0.7 + ((pb >> s) & 255) * 0.3)
  return '#' + [16, 8, 0].map((s) => ch(s).toString(16).padStart(2, '0')).join('')
}

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id)
}

export function priceFor(p: Product, size: SizeId, vase: boolean) {
  const mult = p.sized ? (SIZES.find((s) => s.id === size)?.mult ?? 1) : 1
  return Math.round(p.price * mult) + (vase && p.vaseAddOn ? VASE_PRICE : 0)
}
