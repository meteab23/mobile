import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArtSvg } from '../art/FlowerArt'
import { ArrowRight, CheckIcon, ChevronDown, HeartIcon, MinusIcon, PlusIcon, RefreshIcon, TruckIcon } from '../components/Icons'
import { ProductCard, Stars } from '../components/ProductCard'
import { CATEGORIES, getProduct, priceFor, PRODUCTS, SIZES, VASE_PRICE, type SizeId } from '../data/products'
import { money } from '../lib/format'
import { useStore } from '../store/StoreContext'
import { NotFound } from './NotFound'

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`acc ${open ? 'open' : ''}`}>
      <button onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}</span>
        <ChevronDown />
      </button>
      {open && <div className="acc-body">{children}</div>}
    </div>
  )
}

export function ProductPage() {
  const { id } = useParams()
  const product = getProduct(id ?? '')
  const { addToCart, state, toggleWish } = useStore()
  const navigate = useNavigate()
  const [size, setSize] = useState<SizeId>('classic')
  const [vase, setVase] = useState(false)
  const [qty, setQty] = useState(1)

  if (!product) return <NotFound />

  const unit = priceFor(product, size, vase)
  const wished = state.wishlist.includes(product.id)
  const cat = CATEGORIES.find((c) => c.id === product.category)
  const related = PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.colors.some((c) => product.colors.includes(c)))).slice(0, 4)

  const add = () => addToCart({ productId: product.id, size: product.sized ? size : 'classic', vase: product.vaseAddOn && vase, qty })

  return (
    <div className="page">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`}>{cat?.label}</Link>
          <span>/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="pdp">
          <div className="pdp-gallery">
            <div className="pdp-stage">
              <ArtSvg art={product.art} seed={product.id} className="pdp-art" title={product.name} />
              {product.badge && <span className={`badge badge-${product.badge.toLowerCase()}`}>{product.badge}</span>}
            </div>
            <p className="pdp-caption">Illustrated by hand — your piece is photographed and checked before it ships.</p>
          </div>

          <div className="pdp-info">
            <span className="eyebrow">{cat?.label}</span>
            <h1>{product.name}</h1>
            <p className="pdp-tagline">{product.tagline}</p>
            <div className="pdp-rating">
              <Stars rating={product.rating} count={product.reviews} />
              <span className="muted small">· {product.colors.join(', ')}</span>
            </div>
            <div className="pdp-price">
              <span className="price price-lg">{money(unit)}</span>
              <span className="muted small">Tax included · free delivery over $75</span>
            </div>

            <p className="pdp-desc">{product.description}</p>

            {product.sized && (
              <fieldset className="opt">
                <legend>
                  Size <span className="muted">— {SIZES.find((s) => s.id === size)?.note}</span>
                </legend>
                <div className="size-grid">
                  {SIZES.map((s) => (
                    <label key={s.id} className={`size-card ${size === s.id ? 'on' : ''}`}>
                      <input type="radio" name="size" checked={size === s.id} onChange={() => setSize(s.id)} />
                      <strong>{s.label}</strong>
                      <span>{money(priceFor(product, s.id, vase))}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {product.vaseAddOn && (
              <label className={`addon ${vase ? 'on' : ''}`}>
                <input type="checkbox" checked={vase} onChange={(e) => setVase(e.target.checked)} />
                <span className="addon-box">{vase && <CheckIcon width={14} height={14} />}</span>
                <span className="addon-text">
                  <strong>Add a ceramic vase</strong>
                  <span className="muted small">Matte stone glaze, hand-poured</span>
                </span>
                <span className="price">+{money(VASE_PRICE)}</span>
              </label>
            )}

            <div className="buy-row">
              <div className="qty">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
                  <MinusIcon />
                </button>
                <span aria-live="polite">{qty}</span>
                <button onClick={() => setQty(Math.min(20, qty + 1))} aria-label="Increase quantity">
                  <PlusIcon />
                </button>
              </div>
              <button className="btn btn-primary btn-lg grow" onClick={add}>
                Add to cart · {money(unit * qty)}
              </button>
              <button className={`btn btn-icon ${wished ? 'on' : ''}`} onClick={() => toggleWish(product.id)} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={wished}>
                <HeartIcon filled={wished} />
              </button>
            </div>
            <button
              className="btn btn-outline btn-block"
              onClick={() => {
                add()
                navigate('/checkout')
              }}
            >
              Buy now <ArrowRight />
            </button>

            <ul className="perks">
              <li>
                <TruckIcon width={20} height={20} /> Dispatched within 1–2 business days
              </li>
              <li>
                <RefreshIcon width={20} height={20} /> 30-day returns, no questions asked
              </li>
            </ul>

            <div className="accs">
              <Accordion title="Details" defaultOpen>
                <ul className="tick-list">
                  {product.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Care">
                <p>Dust gently with a soft brush or a hairdryer on a cool setting. Keep out of prolonged direct sun to keep colours at their best. Reshape wired stems with your fingers.</p>
              </Accordion>
              <Accordion title="Delivery & returns">
                <p>Standard delivery takes 3–5 business days, express is next business day. Not in love? Return within 30 days in original packaging for a full refund.</p>
              </Accordion>
            </div>
          </div>
        </div>

        <section className="section-sm">
          <div className="section-head section-head-row">
            <div>
              <span className="eyebrow">Pairs well with</span>
              <h2>You may also love</h2>
            </div>
          </div>
          <div className="grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
