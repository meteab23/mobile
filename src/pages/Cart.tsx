import { Link, useNavigate } from 'react-router-dom'
import { ArtSvg } from '../art/FlowerArt'
import { ArrowRight, LockIcon, MinusIcon, PlusIcon, TrashIcon } from '../components/Icons'
import { LogoMark } from '../components/Logo'
import { ProductCard } from '../components/ProductCard'
import { PromoBox } from '../components/PromoBox'
import { getProduct, PRODUCTS, SIZES } from '../data/products'
import { money, moneyExact } from '../lib/format'
import { FREE_SHIPPING_THRESHOLD, useStore } from '../store/StoreContext'

export function CartPage() {
  const { state, totals, setQty, removeLine, lineUnit, promo } = useStore()
  const navigate = useNavigate()
  const progress = Math.min(100, ((totals.subtotal - totals.discount) / FREE_SHIPPING_THRESHOLD) * 100)
  const inCart = new Set(state.lines.map((l) => l.productId))
  const suggestions = PRODUCTS.filter((p) => !inCart.has(p.id) && (p.category === 'stems' || p.price < 50)).slice(0, 4)

  if (state.lines.length === 0) {
    return (
      <div className="page">
        <div className="container empty-state big">
          <LogoMark className="empty-mark" />
          <h1>Your cart is empty</h1>
          <p className="muted">Nothing here yet. Let’s find something that blooms forever.</p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            Explore the shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <span className="eyebrow">Step 1 of 3</span>
          <h1>Your cart</h1>
        </header>

        <div className="cart-layout">
          <section aria-label="Cart items">
            <div className="ship-progress ship-progress-card">
              <p>
                {totals.qualifiesFreeShipping ? (
                  <>
                    You’ve unlocked <strong>free standard delivery</strong>.
                  </>
                ) : (
                  <>
                    Add <strong>{money(totals.remainingForFree)}</strong> more for free standard delivery.
                  </>
                )}
              </p>
              <div className="bar">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="cart-lines">
              {state.lines.map((l) => {
                const p = getProduct(l.productId)
                if (!p) return null
                const size = SIZES.find((s) => s.id === l.size)
                return (
                  <li key={l.key} className="cart-line">
                    <Link to={`/product/${p.id}`} className="cart-line-art">
                      <ArtSvg art={p.art} seed={p.id} showFrame={false} />
                    </Link>
                    <div className="cart-line-main">
                      <Link to={`/product/${p.id}`} className="line-name">
                        {p.name}
                      </Link>
                      <span className="muted small">
                        {p.sized && size ? `${size.label} · ${size.note}` : p.tagline}
                        {l.vase ? ' · with ceramic vase' : ''}
                      </span>
                      <span className="muted small">{money(lineUnit(l))} each</span>
                      <button className="link-btn" onClick={() => removeLine(l.key)}>
                        <TrashIcon width={15} height={15} /> Remove
                      </button>
                    </div>
                    <div className="qty">
                      <button onClick={() => (l.qty > 1 ? setQty(l.key, l.qty - 1) : removeLine(l.key))} aria-label="Decrease quantity">
                        <MinusIcon />
                      </button>
                      <span>{l.qty}</span>
                      <button onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase quantity">
                        <PlusIcon />
                      </button>
                    </div>
                    <span className="price cart-line-total">{money(lineUnit(l) * l.qty)}</span>
                  </li>
                )
              })}
            </ul>
          </section>

          <aside className="summary" aria-label="Order summary">
            <h2>Summary</h2>
            <PromoBox />
            <dl className="totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{moneyExact(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && promo && (
                <div className="discount">
                  <dt>Discount ({promo.code})</dt>
                  <dd>−{moneyExact(totals.discount)}</dd>
                </div>
              )}
              <div>
                <dt>Delivery</dt>
                <dd>{totals.qualifiesFreeShipping || promo?.kind === 'shipping' ? 'Free' : 'From $8.00'}</dd>
              </div>
            </dl>
            <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate('/checkout')}>
              Continue to checkout <ArrowRight />
            </button>
            <p className="secure-note">
              <LockIcon /> Secure checkout · 30-day returns
            </p>
            <div className="pay-icons" aria-label="Accepted payment methods">
              {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay', 'Pay in 3'].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </aside>
        </div>

        {suggestions.length > 0 && (
          <section className="section-sm">
            <div className="section-head">
              <span className="eyebrow">Complete the set</span>
              <h2>Little additions</h2>
            </div>
            <div className="grid">
              {suggestions.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
