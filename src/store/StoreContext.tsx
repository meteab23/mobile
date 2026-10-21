import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { getProduct, priceFor, type SizeId } from '../data/products'

export interface CartLine {
  key: string
  productId: string
  size: SizeId
  vase: boolean
  qty: number
}

export interface Promo {
  code: string
  label: string
  kind: 'percent' | 'shipping'
  value: number
}

export const PROMOS: Record<string, Promo> = {
  FLEUR10: { code: 'FLEUR10', label: '10% off your order', kind: 'percent', value: 10 },
  WELCOME15: { code: 'WELCOME15', label: '15% off your first order', kind: 'percent', value: 15 },
  FREESHIP: { code: 'FREESHIP', label: 'Free standard delivery', kind: 'shipping', value: 0 },
}

export const FREE_SHIPPING_THRESHOLD = 75

export interface ShippingOption {
  id: 'standard' | 'express' | 'sameday'
  label: string
  note: string
  price: number
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'standard', label: 'Standard delivery', note: '3–5 business days', price: 8 },
  { id: 'express', label: 'Express delivery', note: 'Next business day', price: 16 },
  { id: 'sameday', label: 'Same-day courier', note: 'Order before 1pm, local addresses', price: 24 },
]

export type PaymentId = 'card' | 'paypal' | 'applepay' | 'googlepay' | 'klarna' | 'bank' | 'cod'

export const PAYMENT_METHODS: { id: PaymentId; label: string; note: string; fee?: number }[] = [
  { id: 'card', label: 'Credit or debit card', note: 'Visa, Mastercard, Amex, Discover' },
  { id: 'paypal', label: 'PayPal', note: 'Pay with your PayPal balance or linked account' },
  { id: 'applepay', label: 'Apple Pay', note: 'Confirm with Face ID or Touch ID' },
  { id: 'googlepay', label: 'Google Pay', note: 'Use a card saved to your Google account' },
  { id: 'klarna', label: 'Pay in 3', note: 'Three interest-free instalments, 0% interest' },
  { id: 'bank', label: 'Bank transfer', note: 'We ship once your transfer arrives' },
  { id: 'cod', label: 'Cash on delivery', note: 'Pay the courier on arrival', fee: 3 },
]

export interface Address {
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  apartment: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Order {
  id: string
  createdAt: string
  lines: { name: string; size: string; vase: boolean; qty: number; unit: number; productId: string }[]
  subtotal: number
  discount: number
  shipping: number
  fee: number
  giftWrap: number
  total: number
  promo?: string
  shippingLabel: string
  deliveryDate: string
  address: Address
  recipient?: string
  giftMessage?: string
  payment: PaymentId
  paymentLabel: string
  paymentDetail?: string
  status: string
}

interface State {
  lines: CartLine[]
  wishlist: string[]
  promo: string | null
  orders: Order[]
}

type Action =
  | { type: 'add'; line: Omit<CartLine, 'key'> }
  | { type: 'qty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }
  | { type: 'wish'; id: string }
  | { type: 'promo'; code: string | null }
  | { type: 'order'; order: Order }

const STORAGE_KEY = 'fleuretern-store-v1'

const lineKey = (l: Omit<CartLine, 'key'>) => `${l.productId}:${l.size}:${l.vase ? 'v' : 'n'}`

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case 'add': {
      const key = lineKey(a.line)
      const existing = state.lines.find((l) => l.key === key)
      if (existing) {
        return { ...state, lines: state.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(20, l.qty + a.line.qty) } : l)) }
      }
      return { ...state, lines: [...state.lines, { ...a.line, key }] }
    }
    case 'qty':
      return {
        ...state,
        lines: state.lines.map((l) => (l.key === a.key ? { ...l, qty: Math.max(1, Math.min(20, a.qty)) } : l)),
      }
    case 'remove':
      return { ...state, lines: state.lines.filter((l) => l.key !== a.key) }
    case 'clear':
      return { ...state, lines: [], promo: null }
    case 'wish':
      return {
        ...state,
        wishlist: state.wishlist.includes(a.id) ? state.wishlist.filter((w) => w !== a.id) : [...state.wishlist, a.id],
      }
    case 'promo':
      return { ...state, promo: a.code }
    case 'order':
      return { ...state, orders: [a.order, ...state.orders], lines: [], promo: null }
  }
}

function load(): State {
  const empty: State = { lines: [], wishlist: [], promo: null, orders: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as State
    return {
      ...empty,
      ...parsed,
      lines: (parsed.lines ?? []).filter((l) => getProduct(l.productId)),
    }
  } catch {
    return empty
  }
}

export interface Totals {
  count: number
  subtotal: number
  discount: number
  qualifiesFreeShipping: boolean
  remainingForFree: number
}

interface Toast {
  id: number
  message: string
}

interface Ctx {
  state: State
  totals: Totals
  promo: Promo | null
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  addToCart: (line: Omit<CartLine, 'key'>, opts?: { open?: boolean }) => void
  setQty: (key: string, qty: number) => void
  removeLine: (key: string) => void
  toggleWish: (id: string) => void
  applyPromo: (code: string) => { ok: boolean; message: string }
  clearPromo: () => void
  placeOrder: (o: Order) => void
  clearCart: () => void
  lineUnit: (l: CartLine) => number
  toasts: Toast[]
  notify: (message: string) => void
}

const StoreCtx = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [cartOpen, setCartOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable */
    }
  }, [state])

  const notify = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  const lineUnit = useCallback((l: CartLine) => {
    const p = getProduct(l.productId)
    return p ? priceFor(p, l.size, l.vase) : 0
  }, [])

  const promo = state.promo ? (PROMOS[state.promo] ?? null) : null

  const totals = useMemo<Totals>(() => {
    const subtotal = state.lines.reduce((s, l) => s + lineUnit(l) * l.qty, 0)
    const count = state.lines.reduce((s, l) => s + l.qty, 0)
    const discount = promo?.kind === 'percent' ? Math.round(subtotal * promo.value) / 100 : 0
    const after = subtotal - discount
    return {
      count,
      subtotal,
      discount,
      qualifiesFreeShipping: after >= FREE_SHIPPING_THRESHOLD,
      remainingForFree: Math.max(0, FREE_SHIPPING_THRESHOLD - after),
    }
  }, [state.lines, promo, lineUnit])

  const value = useMemo<Ctx>(
    () => ({
      state,
      totals,
      promo,
      cartOpen,
      setCartOpen,
      addToCart: (line, opts) => {
        dispatch({ type: 'add', line })
        const p = getProduct(line.productId)
        notify(`${p?.name ?? 'Item'} added to your cart`)
        if (opts?.open !== false) setCartOpen(true)
      },
      setQty: (key, qty) => dispatch({ type: 'qty', key, qty }),
      removeLine: (key) => dispatch({ type: 'remove', key }),
      toggleWish: (id) => {
        const adding = !state.wishlist.includes(id)
        dispatch({ type: 'wish', id })
        notify(adding ? 'Saved to your wishlist' : 'Removed from your wishlist')
      },
      applyPromo: (code) => {
        const c = code.trim().toUpperCase()
        if (!c) return { ok: false, message: 'Enter a code to apply.' }
        const p = PROMOS[c]
        if (!p) return { ok: false, message: 'That code is not valid. Try FLEUR10.' }
        dispatch({ type: 'promo', code: c })
        return { ok: true, message: `${p.code} applied — ${p.label}` }
      },
      clearPromo: () => dispatch({ type: 'promo', code: null }),
      placeOrder: (order) => dispatch({ type: 'order', order }),
      clearCart: () => dispatch({ type: 'clear' }),
      lineUnit,
      toasts,
      notify,
    }),
    [state, totals, promo, cartOpen, toasts, notify, lineUnit],
  )

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const c = useContext(StoreCtx)
  if (!c) throw new Error('useStore must be used within StoreProvider')
  return c
}
