import { Link, Navigate, useParams } from 'react-router-dom'
import { CheckIcon } from '../components/Icons'
import { BloomLine } from '../components/Logo'
import { formatDate, money, moneyExact } from '../lib/format'
import { useStore } from '../store/StoreContext'

const BANK = {
  name: 'Fleurétern Studio Ltd.',
  bank: 'Northfield Commercial Bank',
  iban: 'US00 NFCB 0000 1234 5678 90',
  swift: 'NFCBUS33',
}

function Petals() {
  const petals = Array.from({ length: 16 }, (_, i) => ({
    left: (i * 6.4 + (i % 3) * 3) % 100,
    delay: (i % 8) * 0.35,
    dur: 5 + (i % 5) * 0.8,
    size: 10 + (i % 4) * 5,
    hue: ['#e7b9b6', '#f3ebdc', '#d9c3d6', '#cbd5bb'][i % 4],
  }))
  return (
    <div className="petals" aria-hidden>
      {petals.map((p, i) => (
        <span key={i} style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, width: p.size, height: p.size * 1.35, background: p.hue }} />
      ))}
    </div>
  )
}

export function Confirmation() {
  const { id } = useParams()
  const { state } = useStore()
  const order = state.orders.find((o) => o.id === id)
  if (!order) return <Navigate to="/" replace />

  const a = order.address
  const bank = order.payment === 'bank'
  const steps = ['Order placed', 'Being arranged', 'On its way', 'Delivered']

  return (
    <div className="page confirm">
      <Petals />
      <div className="container confirm-wrap">
        <div className="confirm-head">
          <span className="confirm-check">
            <CheckIcon width={28} height={28} />
          </span>
          <span className="eyebrow">Order {order.id}</span>
          <h1>Thank you, {a.firstName}.</h1>
          <p className="lead muted">
            {bank ? 'Your order is reserved. Please complete your bank transfer to release it for dispatch.' : 'Your flowers are being gathered and will be on their way shortly.'} A confirmation has been sent to <strong>{a.email}</strong>.
          </p>
        </div>

        <ol className="timeline" aria-label="Order progress">
          {steps.map((s, i) => (
            <li key={s} className={i === 0 ? 'done' : i === 1 && !bank ? 'now' : ''}>
              <span className="tl-dot">{i === 0 ? <CheckIcon width={12} height={12} /> : null}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>

        {bank && (
          <section className="confirm-card bank-card">
            <h2>Bank transfer details</h2>
            <dl className="kv">
              <div>
                <dt>Account name</dt>
                <dd>{BANK.name}</dd>
              </div>
              <div>
                <dt>Bank</dt>
                <dd>{BANK.bank}</dd>
              </div>
              <div>
                <dt>IBAN</dt>
                <dd>{BANK.iban}</dd>
              </div>
              <div>
                <dt>SWIFT / BIC</dt>
                <dd>{BANK.swift}</dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd>{moneyExact(order.total)}</dd>
              </div>
              <div>
                <dt>Payment reference</dt>
                <dd>
                  <strong>{order.id}</strong>
                </dd>
              </div>
            </dl>
            <p className="muted small">Please include the reference exactly so we can match your payment. Items are held for 5 days.</p>
          </section>
        )}

        <div className="confirm-grid">
          <section className="confirm-card">
            <h2>Your order</h2>
            <ul className="sum-lines">
              {order.lines.map((l, i) => (
                <li key={i}>
                  <div className="sum-name">
                    <strong>
                      {l.qty} × {l.name}
                    </strong>
                    <span className="muted small">
                      {l.size}
                      {l.vase ? ' · with vase' : ''}
                    </span>
                  </div>
                  <span>{money(l.unit * l.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{moneyExact(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="discount">
                  <dt>Discount ({order.promo})</dt>
                  <dd>−{moneyExact(order.discount)}</dd>
                </div>
              )}
              <div>
                <dt>Delivery</dt>
                <dd>{order.shipping === 0 ? 'Free' : moneyExact(order.shipping)}</dd>
              </div>
              {order.giftWrap > 0 && (
                <div>
                  <dt>Gift wrap</dt>
                  <dd>{moneyExact(order.giftWrap)}</dd>
                </div>
              )}
              {order.fee > 0 && (
                <div>
                  <dt>Cash on delivery fee</dt>
                  <dd>{moneyExact(order.fee)}</dd>
                </div>
              )}
              <div className="grand">
                <dt>Total</dt>
                <dd>{moneyExact(order.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="confirm-card">
            <h2>Details</h2>
            <dl className="kv stack">
              <div>
                <dt>Delivery</dt>
                <dd>
                  {order.shippingLabel}
                  <br />
                  <strong>{formatDate(new Date(order.deliveryDate))}</strong>
                </dd>
              </div>
              <div>
                <dt>Ship to</dt>
                <dd>
                  {a.firstName} {a.lastName}
                  <br />
                  {a.address}
                  {a.apartment ? `, ${a.apartment}` : ''}
                  <br />
                  {a.city}, {a.state} {a.zip}
                  <br />
                  {a.country}
                </dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>
                  {order.paymentLabel}
                  {order.paymentDetail ? ` · ${order.paymentDetail}` : ''}
                  <br />
                  <span className={`status-pill ${order.status === 'Paid' ? 'ok' : ''}`}>{order.status}</span>
                </dd>
              </div>
              {order.giftMessage || order.recipient ? (
                <div>
                  <dt>Gift card</dt>
                  <dd>
                    {order.recipient && <>For {order.recipient}</>}
                    {order.giftMessage && <q className="gift-q">{order.giftMessage}</q>}
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>
        </div>

        <div className="confirm-actions">
          <Link to="/shop" className="btn btn-primary btn-lg">
            Continue shopping
          </Link>
          <Link to="/" className="btn btn-outline btn-lg">
            Back to home
          </Link>
        </div>
        <BloomLine className="confirm-bloom" />
      </div>
    </div>
  )
}
