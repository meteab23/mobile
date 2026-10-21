import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArtSvg } from '../art/FlowerArt'
import { getProduct, SIZES } from '../data/products'
import { money } from '../lib/format'
import { FREE_SHIPPING_THRESHOLD, useStore } from '../store/StoreContext'
import { ArrowRight, BagIcon, CloseIcon, HeartIcon, InstagramIcon, MailIcon, MenuIcon, MinusIcon, PinterestIcon, PlusIcon, SearchIcon, TrashIcon } from './Icons'
import { LogoMark } from './Logo'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Announcement() {
  return (
    <div className="announce">
      <span>Free delivery on orders over {money(FREE_SHIPPING_THRESHOLD)}</span>
      <span className="dot" aria-hidden>
        ·
      </span>
      <span className="hide-sm">Flowers that never fade — use code FLEUR10 for 10% off</span>
    </div>
  )
}

const NAV = [
  { to: '/shop', label: 'Shop all', end: true },
  { to: '/shop?category=bouquets', label: 'Bouquets' },
  { to: '/shop?category=arrangements', label: 'Arrangements' },
  { to: '/shop?category=stems', label: 'Stems' },
  { to: '/shop?category=gifts', label: 'Gifts' },
  { to: '/story', label: 'Our story' },
]

function Header() {
  const { totals, state, setCartOpen } = useStore()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const { pathname, search: qs } = useLocation()

  useEffect(() => {
    setMenu(false)
    setSearch(false)
  }, [pathname, qs])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/shop?q=${encodeURIComponent(q.trim())}`)
    setQ('')
  }

  const isActive = (to: string, end?: boolean) => {
    const [path, query] = to.split('?')
    if (pathname !== path) return false
    if (query) return qs === `?${query}`
    return end ? qs === '' : true
  }

  return (
    <header className="header">
      <div className="header-inner">
        <button className="icon-btn menu-btn" onClick={() => setMenu(true)} aria-label="Open menu">
          <MenuIcon />
        </button>
        <nav className="nav nav-left" aria-label="Primary">
          {NAV.slice(0, 3).map((n) => (
            <NavLink key={n.to} to={n.to} className={isActive(n.to, n.end) ? 'active' : ''}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="brand" aria-label="Fleurétern home">
          <LogoMark className="brand-mark" />
          <span className="wordmark">Fleurétern</span>
        </Link>
        <nav className="nav nav-right" aria-label="Secondary">
          {NAV.slice(3).map((n) => (
            <NavLink key={n.to} to={n.to} className={isActive(n.to, n.end) ? 'active' : ''}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setSearch((s) => !s)} aria-label="Search">
            <SearchIcon />
          </button>
          <Link to="/wishlist" className="icon-btn hide-sm" aria-label={`Wishlist, ${state.wishlist.length} items`}>
            <HeartIcon />
            {state.wishlist.length > 0 && <span className="count count-soft">{state.wishlist.length}</span>}
          </Link>
          <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${totals.count} items`}>
            <BagIcon />
            {totals.count > 0 && <span className="count">{totals.count}</span>}
          </button>
        </div>
      </div>

      {search && (
        <form className="search-bar" onSubmit={submit} role="search">
          <SearchIcon width={18} height={18} />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search peonies, bouquets, lavender…" aria-label="Search products" />
          <button type="button" className="icon-btn" onClick={() => setSearch(false)} aria-label="Close search">
            <CloseIcon width={18} height={18} />
          </button>
        </form>
      )}

      <div className={`drawer-backdrop ${menu ? 'open' : ''}`} onClick={() => setMenu(false)} />
      <aside className={`mobile-menu ${menu ? 'open' : ''}`} aria-hidden={!menu}>
        <div className="mobile-menu-head">
          <span className="wordmark">Fleurétern</span>
          <button className="icon-btn" onClick={() => setMenu(false)} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>
        <nav>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to}>
              {n.label}
            </Link>
          ))}
          <Link to="/wishlist">Wishlist ({state.wishlist.length})</Link>
        </nav>
      </aside>
    </header>
  )
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, state, totals, setQty, removeLine, lineUnit } = useStore()
  const navigate = useNavigate()
  const progress = Math.min(100, ((totals.subtotal - totals.discount) / FREE_SHIPPING_THRESHOLD) * 100)

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cartOpen, setCartOpen])

  const go = (to: string) => {
    setCartOpen(false)
    navigate(to)
  }

  return (
    <>
      <div className={`drawer-backdrop ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen} aria-label="Shopping cart">
        <div className="drawer-head">
          <h2>Your cart {totals.count > 0 && <span className="muted">({totals.count})</span>}</h2>
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        {state.lines.length === 0 ? (
          <div className="drawer-empty">
            <LogoMark className="empty-mark" />
            <h3>Your cart is empty</h3>
            <p>Find something that will bloom forever.</p>
            <button className="btn btn-primary" onClick={() => go('/shop')}>
              Explore the shop
            </button>
          </div>
        ) : (
          <>
            <div className="ship-progress">
              <p>
                {totals.qualifiesFreeShipping ? (
                  <>
                    You’ve unlocked <strong>free delivery</strong>.
                  </>
                ) : (
                  <>
                    You’re <strong>{money(totals.remainingForFree)}</strong> away from free delivery.
                  </>
                )}
              </p>
              <div className="bar">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="drawer-lines">
              {state.lines.map((l) => {
                const p = getProduct(l.productId)
                if (!p) return null
                const size = SIZES.find((s) => s.id === l.size)
                return (
                  <li key={l.key} className="line">
                    <Link to={`/product/${p.id}`} onClick={() => setCartOpen(false)} className="line-art">
                      <ArtSvg art={p.art} seed={p.id} showFrame={false} />
                    </Link>
                    <div className="line-info">
                      <Link to={`/product/${p.id}`} onClick={() => setCartOpen(false)} className="line-name">
                        {p.name}
                      </Link>
                      <span className="muted small">
                        {p.sized && size ? size.label : 'Standard'}
                        {l.vase ? ' · with vase' : ''}
                      </span>
                      <div className="line-row">
                        <div className="qty qty-sm">
                          <button onClick={() => (l.qty > 1 ? setQty(l.key, l.qty - 1) : removeLine(l.key))} aria-label="Decrease quantity">
                            <MinusIcon />
                          </button>
                          <span aria-live="polite">{l.qty}</span>
                          <button onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase quantity">
                            <PlusIcon />
                          </button>
                        </div>
                        <span className="price">{money(lineUnit(l) * l.qty)}</span>
                      </div>
                    </div>
                    <button className="icon-btn line-remove" onClick={() => removeLine(l.key)} aria-label={`Remove ${p.name}`}>
                      <TrashIcon />
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="drawer-foot">
              <div className="row">
                <span>Subtotal</span>
                <strong>{money(totals.subtotal)}</strong>
              </div>
              <p className="muted small">Delivery and promo codes are calculated at checkout.</p>
              <button className="btn btn-primary btn-block" onClick={() => go('/checkout')}>
                Checkout <ArrowRight />
              </button>
              <button className="btn btn-ghost btn-block" onClick={() => go('/cart')}>
                View full cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <LogoMark className="footer-mark" />
          <span className="wordmark">Fleurétern</span>
          <p>Everlasting flowers, hand-finished to look and feel botanical. Made to be kept.</p>
          <div className="socials">
            <a href="#top" aria-label="Instagram" onClick={(e) => e.preventDefault()}>
              <InstagramIcon />
            </a>
            <a href="#top" aria-label="Pinterest" onClick={(e) => e.preventDefault()}>
              <PinterestIcon />
            </a>
            <a href="#top" aria-label="Email" onClick={(e) => e.preventDefault()}>
              <MailIcon />
            </a>
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/shop?category=bouquets">Bouquets</Link>
          <Link to="/shop?category=arrangements">Arrangements</Link>
          <Link to="/shop?category=stems">Single stems</Link>
          <Link to="/shop?category=gifts">Gift sets</Link>
        </div>
        <div>
          <h4>Care</h4>
          <Link to="/story#care">Caring for your flowers</Link>
          <Link to="/story#delivery">Delivery</Link>
          <Link to="/story#returns">Returns</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>
        <div className="footer-news">
          <h4>Letters from the studio</h4>
          <p>Styling notes and early access to new collections. Never more than twice a month.</p>
          {done ? (
            <p className="news-done">Thank you — a welcome letter is on its way.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setDone(true)
              }}
            >
              <input type="email" required placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" />
              <button className="btn btn-primary" type="submit">
                Join
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} Fleurétern. A demo storefront — no real payments are processed.</span>
        <span>Made with care.</span>
      </div>
    </footer>
  )
}

function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.message}
        </div>
      ))}
    </div>
  )
}

export function Layout() {
  const { pathname } = useLocation()
  const minimal = pathname.startsWith('/checkout') || pathname.startsWith('/order/')
  return (
    <div id="top">
      <ScrollToTop />
      {minimal ? <MinimalHeader /> : (
        <>
          <Announcement />
          <Header />
        </>
      )}
      <main>
        <Outlet />
      </main>
      {!minimal && <Footer />}
      <CartDrawer />
      <Toasts />
    </div>
  )
}

function MinimalHeader() {
  return (
    <header className="header header-min">
      <div className="header-inner header-inner-min">
        <Link to="/shop" className="back-link">
          ← <span className="hide-sm">Continue </span>shopping
        </Link>
        <Link to="/" className="brand" aria-label="Fleurétern home">
          <LogoMark className="brand-mark" />
          <span className="wordmark">Fleurétern</span>
        </Link>
        <span className="secure">Secure checkout</span>
      </div>
    </header>
  )
}

