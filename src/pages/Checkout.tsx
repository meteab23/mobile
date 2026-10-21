import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArtSvg } from '../art/FlowerArt'
import { ArrowLeft, ArrowRight, CheckIcon, LockIcon, PaymentLogo } from '../components/Icons'
import { PromoBox } from '../components/PromoBox'
import { getProduct, SIZES } from '../data/products'
import { cardBrand, emailValid, expiryValid, formatCardNumber, formatDate, formatExpiry, luhn, money, moneyExact } from '../lib/format'
import { PAYMENT_METHODS, SHIPPING_OPTIONS, useStore, type Address, type Order, type PaymentId } from '../store/StoreContext'

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Ireland', 'Germany', 'France']
const GIFT_WRAP_PRICE = 6
const DECLINE_CARD = '4000000000000002'

const EMPTY_ADDRESS: Address = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
  country: 'United States',
}

const DEMO_ADDRESS: Address = {
  email: 'amelia.rose@example.com',
  phone: '(415) 555-0134',
  firstName: 'Amelia',
  lastName: 'Rose',
  address: '48 Linden Avenue',
  apartment: 'Apt 3B',
  city: 'San Francisco',
  state: 'CA',
  zip: '94117',
  country: 'United States',
}

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function deliveryDates(offset: number) {
  const out: Date[] = []
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + offset)
  while (out.length < 7) {
    if (d.getDay() !== 0) out.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return out
}

type Errors = Record<string, string>

function Field({ label, error, children, className = '' }: { label: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`field ${error ? 'has-error' : ''} ${className}`}>
      <span className="field-label">{label}</span>
      {children}
      {error && (
        <span className="field-msg err" role="alert">
          {error}
        </span>
      )}
    </label>
  )
}

function Stepper({ step, goTo }: { step: number; goTo: (n: number) => void }) {
  const steps = ['Details', 'Delivery', 'Payment']
  return (
    <ol className="stepper" aria-label="Checkout progress">
      {steps.map((s, i) => (
        <li key={s} className={i === step ? 'current' : i < step ? 'done' : ''}>
          <button disabled={i > step} onClick={() => goTo(i)} aria-current={i === step ? 'step' : undefined}>
            <span className="step-dot">{i < step ? <CheckIcon width={14} height={14} /> : i + 1}</span>
            <span>{s}</span>
          </button>
        </li>
      ))}
    </ol>
  )
}

function SummaryLines() {
  const { state, lineUnit } = useStore()
  return (
    <ul className="sum-lines">
      {state.lines.map((l) => {
        const p = getProduct(l.productId)
        if (!p) return null
        const size = SIZES.find((s) => s.id === l.size)
        return (
          <li key={l.key}>
            <div className="sum-thumb">
              <ArtSvg art={p.art} seed={p.id} showFrame={false} />
              <span className="sum-qty">{l.qty}</span>
            </div>
            <div className="sum-name">
              <strong>{p.name}</strong>
              <span className="muted small">
                {p.sized && size ? size.label : 'Standard'}
                {l.vase ? ' · with vase' : ''}
              </span>
            </div>
            <span>{money(lineUnit(l) * l.qty)}</span>
          </li>
        )
      })}
    </ul>
  )
}

interface TotalsView {
  subtotal: number
  discount: number
  shipping: number
  giftWrap: number
  fee: number
  total: number
  promoCode?: string
}

function TotalsList({ t }: { t: TotalsView }) {
  return (
    <dl className="totals">
      <div>
        <dt>Subtotal</dt>
        <dd>{moneyExact(t.subtotal)}</dd>
      </div>
      {t.discount > 0 && (
        <div className="discount">
          <dt>Discount ({t.promoCode})</dt>
          <dd>−{moneyExact(t.discount)}</dd>
        </div>
      )}
      <div>
        <dt>Delivery</dt>
        <dd>{t.shipping === 0 ? 'Free' : moneyExact(t.shipping)}</dd>
      </div>
      {t.giftWrap > 0 && (
        <div>
          <dt>Gift wrap</dt>
          <dd>{moneyExact(t.giftWrap)}</dd>
        </div>
      )}
      {t.fee > 0 && (
        <div>
          <dt>Cash on delivery fee</dt>
          <dd>{moneyExact(t.fee)}</dd>
        </div>
      )}
      <div className="grand">
        <dt>Total</dt>
        <dd>
          <span className="muted small">USD</span> {moneyExact(t.total)}
        </dd>
      </div>
    </dl>
  )
}

function PaymentSheet({ method, amount, email, onApprove, onCancel }: { method: PaymentId; amount: number; email: string; onApprove: () => void; onCancel: () => void }) {
  const [paypalEmail, setPaypalEmail] = useState(email)
  const [pass, setPass] = useState('')
  const [busy, setBusy] = useState(false)

  const approve = () => {
    setBusy(true)
    setTimeout(onApprove, 1100)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onCancel])

  return (
    <div className="sheet-backdrop" role="dialog" aria-modal="true" aria-label={`${method} payment`}>
      {method === 'paypal' && (
        <div className="sheet sheet-paypal">
          <div className="sheet-brand paypal-brand">
            Pay<span>Pal</span>
          </div>
          <p className="sheet-amount">
            Pay <strong>{moneyExact(amount)}</strong> to Fleurétern
          </p>
          <div className="field-stack">
            <label className="field">
              <span className="field-label">Email</span>
              <input type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} autoComplete="email" />
            </label>
            <label className="field">
              <span className="field-label">Password</span>
              <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Any password works in this demo" autoComplete="off" />
            </label>
          </div>
          <button className="btn btn-paypal btn-block" onClick={approve} disabled={busy || !emailValid(paypalEmail)}>
            {busy ? 'Authorising…' : 'Log in and approve'}
          </button>
          <button className="btn btn-ghost btn-block" onClick={onCancel} disabled={busy}>
            Cancel and return to Fleurétern
          </button>
          <p className="sheet-foot">Demo PayPal window — no account is contacted.</p>
        </div>
      )}
      {method === 'applepay' && (
        <div className="sheet sheet-apple">
          <div className="sheet-handle" />
          <div className="apple-head">
            <span className="apple-logo">Pay</span>
            <button onClick={onCancel} disabled={busy} className="link-btn">
              Cancel
            </button>
          </div>
          <dl className="sheet-rows">
            <div>
              <dt>Card</dt>
              <dd>Apple Card ···· 4242</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{email || 'you@example.com'}</dd>
            </div>
            <div>
              <dt>Pay</dt>
              <dd>Fleurétern · {moneyExact(amount)}</dd>
            </div>
          </dl>
          <button className="btn btn-apple btn-block" onClick={approve} disabled={busy}>
            {busy ? 'Confirming…' : 'Pay with Face ID'}
          </button>
        </div>
      )}
      {method === 'googlepay' && (
        <div className="sheet sheet-google">
          <div className="sheet-brand google-brand">
            <span>G</span> Pay
          </div>
          <dl className="sheet-rows">
            <div>
              <dt>Total</dt>
              <dd>{moneyExact(amount)}</dd>
            </div>
            <div>
              <dt>Payment method</dt>
              <dd>Visa ···· 4242</dd>
            </div>
            <div>
              <dt>Account</dt>
              <dd>{email || 'you@gmail.com'}</dd>
            </div>
          </dl>
          <button className="btn btn-google btn-block" onClick={approve} disabled={busy}>
            {busy ? 'Processing…' : `Continue · ${moneyExact(amount)}`}
          </button>
          <button className="btn btn-ghost btn-block" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export function Checkout() {
  const { state, totals, promo, placeOrder, lineUnit } = useStore()
  const navigate = useNavigate()
  const [completing, setCompleting] = useState(false)

  const [step, setStep] = useState(0)
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS)
  const [errors, setErrors] = useState<Errors>({})
  const [shipId, setShipId] = useState<'standard' | 'express' | 'sameday'>('standard')
  const [dateIso, setDateIso] = useState('')
  const [gift, setGift] = useState(false)
  const [giftTo, setGiftTo] = useState('')
  const [giftMsg, setGiftMsg] = useState('')
  const [payment, setPayment] = useState<PaymentId>('card')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '' })
  const [agree, setAgree] = useState(false)
  const [sheet, setSheet] = useState<PaymentId | null>(null)
  const [processing, setProcessing] = useState(false)
  const [payError, setPayError] = useState('')

  const shipOpt = SHIPPING_OPTIONS.find((s) => s.id === shipId)!
  const dates = useMemo(() => deliveryDates(shipId === 'standard' ? 3 : shipId === 'express' ? 1 : 0), [shipId])
  const selectedDate = dates.find((d) => iso(d) === dateIso) ?? dates[0]

  const freeStandard = totals.qualifiesFreeShipping || promo?.kind === 'shipping'
  const shipping = shipId === 'standard' && freeStandard ? 0 : shipOpt.price
  const giftWrap = gift ? GIFT_WRAP_PRICE : 0
  const fee = PAYMENT_METHODS.find((p) => p.id === payment)?.fee ?? 0
  const total = Math.round((totals.subtotal - totals.discount + shipping + giftWrap + fee) * 100) / 100

  const view: TotalsView = {
    subtotal: totals.subtotal,
    discount: totals.discount,
    shipping,
    giftWrap,
    fee,
    total,
    promoCode: promo?.code,
  }

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [step])

  if (state.lines.length === 0 && !completing) return <Navigate to="/cart" replace />

  const setA = (k: keyof Address, v: string) => {
    setAddress((a) => ({ ...a, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }
  const setC = (k: keyof typeof card, v: string) => {
    setCard((c) => ({ ...c, [k]: v }))
    if (errors[`card.${k}`]) setErrors((e) => ({ ...e, [`card.${k}`]: '' }))
    setPayError('')
  }

  const validateDetails = () => {
    const e: Errors = {}
    if (!emailValid(address.email)) e.email = 'Enter a valid email address, e.g. name@example.com'
    if (address.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a phone number the courier can reach'
    if (!address.firstName.trim()) e.firstName = 'First name is required'
    if (!address.lastName.trim()) e.lastName = 'Last name is required'
    if (address.address.trim().length < 4) e.address = 'Enter your street address'
    if (!address.city.trim()) e.city = 'City is required'
    if (!address.state.trim()) e.state = 'State / region is required'
    if (address.zip.trim().length < 3) e.zip = 'Enter a valid postal code'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateDelivery = () => {
    const e: Errors = {}
    if (gift && giftMsg.length > 220) e.giftMsg = 'Please keep your message under 220 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateCard = () => {
    const e: Errors = {}
    if (!luhn(card.number)) e['card.number'] = 'Enter a valid card number'
    if (card.name.trim().length < 2) e['card.name'] = 'Enter the name on the card'
    if (!expiryValid(card.expiry)) e['card.expiry'] = 'Enter a valid, future expiry date (MM / YY)'
    const cvcLen = cardBrand(card.number) === 'amex' ? 4 : 3
    if (card.cvc.replace(/\D/g, '').length !== cvcLen) e['card.cvc'] = `Enter the ${cvcLen}-digit security code`
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 0 && validateDetails()) setStep(1)
    else if (step === 1 && validateDelivery()) setStep(2)
  }

  const goTo = (n: number) => {
    setErrors({})
    setStep(n)
  }

  const finalize = (paymentLabel: string, status: string, detail?: string) => {
    const id = `FL-${Math.floor(100000 + Math.random() * 900000)}`
    const order: Order = {
      id,
      createdAt: new Date().toISOString(),
      lines: state.lines.map((l) => {
        const p = getProduct(l.productId)!
        const size = SIZES.find((s) => s.id === l.size)
        return { productId: p.id, name: p.name, size: p.sized && size ? size.label : 'Standard', vase: l.vase, qty: l.qty, unit: lineUnit(l) }
      }),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping,
      fee,
      giftWrap,
      total,
      promo: promo?.code,
      shippingLabel: shipOpt.label,
      deliveryDate: selectedDate.toISOString(),
      address,
      recipient: gift ? giftTo : undefined,
      giftMessage: gift ? giftMsg : undefined,
      payment,
      paymentLabel,
      paymentDetail: detail,
      status,
    }
    setCompleting(true)
    placeOrder(order)
    navigate(`/order/${id}`, { replace: true })
  }

  const completePayment = () => {
    const brand = cardBrand(card.number)
    switch (payment) {
      case 'card': {
        const label = `${brand === 'unknown' ? 'Card' : brand[0].toUpperCase() + brand.slice(1)} ending ${card.number.replace(/\D/g, '').slice(-4)}`
        finalize(label, 'Paid')
        break
      }
      case 'paypal':
        finalize('PayPal', 'Paid')
        break
      case 'applepay':
        finalize('Apple Pay', 'Paid')
        break
      case 'googlepay':
        finalize('Google Pay', 'Paid')
        break
      case 'klarna':
        finalize('Pay in 3', 'First instalment paid', `3 × ${moneyExact(total / 3)}`)
        break
      case 'bank':
        finalize('Bank transfer', 'Awaiting your transfer')
        break
      case 'cod':
        finalize('Cash on delivery', 'Pay the courier on arrival')
        break
    }
  }

  const placeNow = () => {
    setPayError('')
    if (payment === 'card' && !validateCard()) return
    if (!agree) {
      setErrors((e) => ({ ...e, agree: 'Please accept the terms to place your order' }))
      return
    }
    setErrors({})
    if (payment === 'paypal' || payment === 'applepay' || payment === 'googlepay') {
      setSheet(payment)
      return
    }
    setProcessing(true)
    setTimeout(() => {
      if (payment === 'card' && card.number.replace(/\D/g, '') === DECLINE_CARD) {
        setProcessing(false)
        setPayError('Your card was declined by the issuer. Please try a different card or payment method.')
        return
      }
      completePayment()
    }, 1700)
  }

  const instalment = Math.round((total / 3) * 100) / 100
  const brand = cardBrand(card.number)
  const placeLabel =
    payment === 'bank' ? 'Place order · pay by transfer' : payment === 'cod' ? `Place order · ${moneyExact(total)} on delivery` : payment === 'klarna' ? `Pay ${moneyExact(instalment)} today` : `Pay ${moneyExact(total)}`

  const addrSummary = `${address.firstName} ${address.lastName} · ${address.address}${address.apartment ? ', ' + address.apartment : ''}, ${address.city}, ${address.state} ${address.zip}`

  return (
    <div className="page checkout">
      <div className="container">
        <Stepper step={step} goTo={goTo} />

        <details className="summary-mobile">
          <summary>
            <span>Show order summary</span>
            <strong>{moneyExact(total)}</strong>
          </summary>
          <SummaryLines />
          <PromoBox />
          <TotalsList t={view} />
        </details>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Step 1 */}
            <section className={`co-card ${step === 0 ? 'open' : ''}`}>
              <header className="co-head">
                <h2>
                  <span className="co-num">{step > 0 ? <CheckIcon width={14} height={14} /> : 1}</span> Contact & address
                </h2>
                {step > 0 && (
                  <button className="link-btn" onClick={() => goTo(0)}>
                    Edit
                  </button>
                )}
              </header>
              {step > 0 && (
                <p className="co-summary">
                  {address.email}
                  <br />
                  {addrSummary}
                </p>
              )}
              {step === 0 && (
                <form
                  className="co-body"
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault()
                    next()
                  }}
                >
                  <div className="co-tools">
                    <span className="muted small">Already shopped with us? Details are never stored on a server in this demo.</span>
                    <button type="button" className="link-btn" onClick={() => { setAddress(DEMO_ADDRESS); setErrors({}) }}>
                      Fill demo details
                    </button>
                  </div>
                  <div className="form-grid">
                    <Field label="Email" error={errors.email} className="span-2">
                      <input type="email" inputMode="email" autoComplete="email" value={address.email} onChange={(e) => setA('email', e.target.value)} placeholder="name@example.com" />
                    </Field>
                    <Field label="First name" error={errors.firstName}>
                      <input autoComplete="given-name" value={address.firstName} onChange={(e) => setA('firstName', e.target.value)} />
                    </Field>
                    <Field label="Last name" error={errors.lastName}>
                      <input autoComplete="family-name" value={address.lastName} onChange={(e) => setA('lastName', e.target.value)} />
                    </Field>
                    <Field label="Address" error={errors.address} className="span-2">
                      <input autoComplete="address-line1" value={address.address} onChange={(e) => setA('address', e.target.value)} placeholder="Street and house number" />
                    </Field>
                    <Field label="Apartment, suite (optional)" className="span-2">
                      <input autoComplete="address-line2" value={address.apartment} onChange={(e) => setA('apartment', e.target.value)} />
                    </Field>
                    <Field label="City" error={errors.city}>
                      <input autoComplete="address-level2" value={address.city} onChange={(e) => setA('city', e.target.value)} />
                    </Field>
                    <Field label="State / region" error={errors.state}>
                      <input autoComplete="address-level1" value={address.state} onChange={(e) => setA('state', e.target.value)} />
                    </Field>
                    <Field label="Postal code" error={errors.zip}>
                      <input autoComplete="postal-code" value={address.zip} onChange={(e) => setA('zip', e.target.value)} />
                    </Field>
                    <Field label="Country">
                      <select autoComplete="country-name" value={address.country} onChange={(e) => setA('country', e.target.value)}>
                        {COUNTRIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Phone" error={errors.phone} className="span-2">
                      <input type="tel" inputMode="tel" autoComplete="tel" value={address.phone} onChange={(e) => setA('phone', e.target.value)} placeholder="For the courier only" />
                    </Field>
                  </div>
                  <div className="co-actions">
                    <Link to="/cart" className="link-btn">
                      <ArrowLeft /> Back to cart
                    </Link>
                    <button className="btn btn-primary btn-lg" type="submit">
                      Continue to delivery <ArrowRight />
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* Step 2 */}
            <section className={`co-card ${step === 1 ? 'open' : ''} ${step < 1 ? 'locked' : ''}`}>
              <header className="co-head">
                <h2>
                  <span className="co-num">{step > 1 ? <CheckIcon width={14} height={14} /> : 2}</span> Delivery
                </h2>
                {step > 1 && (
                  <button className="link-btn" onClick={() => goTo(1)}>
                    Edit
                  </button>
                )}
              </header>
              {step > 1 && (
                <p className="co-summary">
                  {shipOpt.label} · {formatDate(selectedDate)}
                  {gift && (
                    <>
                      <br />
                      Gift wrapped{giftTo ? ` for ${giftTo}` : ''}
                    </>
                  )}
                </p>
              )}
              {step === 1 && (
                <div className="co-body">
                  <div className="radio-list" role="radiogroup" aria-label="Delivery method">
                    {SHIPPING_OPTIONS.map((s) => {
                      const price = s.id === 'standard' && freeStandard ? 0 : s.price
                      return (
                        <label key={s.id} className={`radio-card ${shipId === s.id ? 'on' : ''}`}>
                          <input type="radio" name="ship" checked={shipId === s.id} onChange={() => { setShipId(s.id); setDateIso('') }} />
                          <span className="radio-dot" />
                          <span className="radio-text">
                            <strong>{s.label}</strong>
                            <span className="muted small">{s.note}</span>
                          </span>
                          <span className="price">{price === 0 ? 'Free' : money(price)}</span>
                        </label>
                      )
                    })}
                  </div>

                  <h3 className="co-sub">Choose your delivery date</h3>
                  <div className="date-row" role="radiogroup" aria-label="Delivery date">
                    {dates.map((d) => {
                      const on = iso(d) === iso(selectedDate)
                      return (
                        <button key={iso(d)} type="button" role="radio" aria-checked={on} className={`date-chip ${on ? 'on' : ''}`} onClick={() => setDateIso(iso(d))}>
                          <span>{formatDate(d, { weekday: 'short' })}</span>
                          <strong>{formatDate(d, { day: 'numeric' })}</strong>
                          <span>{formatDate(d, { month: 'short' })}</span>
                        </button>
                      )
                    })}
                  </div>

                  <label className={`addon ${gift ? 'on' : ''}`}>
                    <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} />
                    <span className="addon-box">{gift && <CheckIcon width={14} height={14} />}</span>
                    <span className="addon-text">
                      <strong>This is a gift</strong>
                      <span className="muted small">Linen ribbon, tissue and a handwritten card. Prices hidden on the packing slip.</span>
                    </span>
                    <span className="price">+{money(GIFT_WRAP_PRICE)}</span>
                  </label>

                  {gift && (
                    <div className="form-grid gift-fields">
                      <Field label="Recipient name (optional)" className="span-2">
                        <input value={giftTo} onChange={(e) => setGiftTo(e.target.value)} placeholder="Who is it for?" />
                      </Field>
                      <Field label={`Card message (${giftMsg.length}/220)`} error={errors.giftMsg} className="span-2">
                        <textarea rows={3} value={giftMsg} onChange={(e) => setGiftMsg(e.target.value)} placeholder="Write something kind…" />
                      </Field>
                    </div>
                  )}

                  <div className="co-actions">
                    <button className="link-btn" onClick={() => goTo(0)}>
                      <ArrowLeft /> Back
                    </button>
                    <button className="btn btn-primary btn-lg" onClick={next}>
                      Continue to payment <ArrowRight />
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Step 3 */}
            <section className={`co-card ${step === 2 ? 'open' : ''} ${step < 2 ? 'locked' : ''}`}>
              <header className="co-head">
                <h2>
                  <span className="co-num">3</span> Payment
                </h2>
                <span className="secure-pill">
                  <LockIcon /> Encrypted
                </span>
              </header>
              {step === 2 && (
                <div className="co-body">
                  <p className="demo-banner">Demo store: no real payment is taken. Use any valid-looking details — or the test card below.</p>
                  <div className="radio-list pay-list" role="radiogroup" aria-label="Payment method">
                    {PAYMENT_METHODS.map((m) => (
                      <div key={m.id} className={`pay-option ${payment === m.id ? 'on' : ''}`}>
                        <label className="radio-card">
                          <input type="radio" name="pay" checked={payment === m.id} onChange={() => { setPayment(m.id); setPayError(''); setErrors({}) }} />
                          <span className="radio-dot" />
                          <span className="pay-logo">
                            <PaymentLogo id={m.id} />
                          </span>
                          <span className="radio-text">
                            <strong>{m.label}</strong>
                            <span className="muted small">{m.note}</span>
                          </span>
                          {m.fee ? <span className="price small">+{money(m.fee)}</span> : null}
                        </label>

                        {payment === m.id && (
                          <div className="pay-panel">
                            {m.id === 'card' && (
                              <div className="form-grid">
                                <Field label="Card number" error={errors['card.number']} className="span-2">
                                  <div className="card-input">
                                    <input
                                      inputMode="numeric"
                                      autoComplete="cc-number"
                                      value={card.number}
                                      onChange={(e) => setC('number', formatCardNumber(e.target.value))}
                                      placeholder="1234 1234 1234 1234"
                                      maxLength={23}
                                    />
                                    <span className={`brand-pill ${brand}`}>{brand === 'unknown' ? '' : brand}</span>
                                  </div>
                                </Field>
                                <Field label="Name on card" error={errors['card.name']} className="span-2">
                                  <input autoComplete="cc-name" value={card.name} onChange={(e) => setC('name', e.target.value)} />
                                </Field>
                                <Field label="Expiry" error={errors['card.expiry']}>
                                  <input inputMode="numeric" autoComplete="cc-exp" value={card.expiry} onChange={(e) => setC('expiry', formatExpiry(e.target.value))} placeholder="MM / YY" maxLength={7} />
                                </Field>
                                <Field label="Security code" error={errors['card.cvc']}>
                                  <input inputMode="numeric" autoComplete="cc-csc" value={card.cvc} onChange={(e) => setC('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="CVC" maxLength={4} />
                                </Field>
                                <div className="span-2 test-card">
                                  <span className="muted small">
                                    Test cards: <code>4242 4242 4242 4242</code> succeeds · <code>4000 0000 0000 0002</code> is declined
                                  </span>
                                  <button type="button" className="link-btn" onClick={() => setCard({ number: '4242 4242 4242 4242', name: `${address.firstName} ${address.lastName}`.trim() || 'Amelia Rose', expiry: '12 / 31', cvc: '123' })}>
                                    Use test card
                                  </button>
                                </div>
                              </div>
                            )}
                            {m.id === 'paypal' && <p className="pay-note">You’ll confirm in a secure PayPal window after clicking the button below. Your PayPal balance, bank or cards can fund the payment.</p>}
                            {m.id === 'applepay' && <p className="pay-note">A payment sheet will open so you can confirm with Face ID or Touch ID. Your shipping details from this page are used.</p>}
                            {m.id === 'googlepay' && <p className="pay-note">Pick any card saved in your Google account in the next step. Fast, and no typing.</p>}
                            {m.id === 'klarna' && (
                              <div>
                                <p className="pay-note">Split your total into three payments with no interest and no fees. The first instalment is charged today.</p>
                                <ol className="instalments">
                                  {[0, 14, 28].map((d, i) => {
                                    const when = new Date()
                                    when.setDate(when.getDate() + d)
                                    return (
                                      <li key={d}>
                                        <span className="inst-dot">{i + 1}</span>
                                        <span>{i === 0 ? 'Today' : formatDate(when, { month: 'short', day: 'numeric' })}</span>
                                        <strong>{moneyExact(i === 2 ? Math.round((total - instalment * 2) * 100) / 100 : instalment)}</strong>
                                      </li>
                                    )
                                  })}
                                </ol>
                              </div>
                            )}
                            {m.id === 'bank' && (
                              <div>
                                <p className="pay-note">After you place your order we’ll show our bank details and a unique reference. We reserve your items for 5 days and ship the moment your transfer lands.</p>
                              </div>
                            )}
                            {m.id === 'cod' && <p className="pay-note">Pay the courier in cash or by card when your flowers arrive. A small {money(3)} handling fee applies. Please have the exact amount ready if possible.</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <label className={`check-line ${errors.agree ? 'has-error' : ''}`}>
                    <input type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked); setErrors((x) => ({ ...x, agree: '' })) }} />
                    <span>I agree to the terms of sale and understand returns are accepted within 30 days.</span>
                  </label>
                  {errors.agree && (
                    <p className="field-msg err" role="alert">
                      {errors.agree}
                    </p>
                  )}
                  {payError && (
                    <div className="alert-error" role="alert">
                      {payError}
                    </div>
                  )}

                  <div className="co-actions">
                    <button className="link-btn" onClick={() => goTo(1)}>
                      <ArrowLeft /> Back
                    </button>
                    <button className="btn btn-primary btn-lg place-btn" onClick={placeNow} disabled={processing}>
                      <LockIcon /> {placeLabel}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="summary summary-desktop" aria-label="Order summary">
            <h2>Order summary</h2>
            <SummaryLines />
            <PromoBox />
            <TotalsList t={view} />
            <p className="secure-note">
              <LockIcon /> Payments are secured with 256-bit encryption
            </p>
          </aside>
        </div>
      </div>

      {sheet && (
        <PaymentSheet
          method={sheet}
          amount={total}
          email={address.email}
          onCancel={() => setSheet(null)}
          onApprove={() => {
            setSheet(null)
            setProcessing(true)
            setTimeout(completePayment, 600)
          }}
        />
      )}

      {processing && (
        <div className="processing" role="status" aria-live="assertive">
          <div className="spinner" />
          <p>Securing your payment…</p>
          <span className="muted small">Please don’t close this window</span>
        </div>
      )}
    </div>
  )
}
