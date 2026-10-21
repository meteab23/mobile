import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BloomLine } from '../components/Logo'
import { ArrowRight } from '../components/Icons'

export function Story() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    }
  }, [hash])

  return (
    <div className="page">
      <div className="container prose-wrap">
        <header className="page-head center">
          <BloomLine className="story-bloom sm" />
          <span className="eyebrow">Our story</span>
          <h1>Made to be kept</h1>
          <p className="lead muted">Fleurétern is a small studio making flowers that outlast the season — and the habit of throwing them away.</p>
        </header>

        <article className="prose">
          <p>
            We love the ritual of flowers: the gift, the table, the sill. We do not love the waste. So we study real blooms and rebuild them petal by petal in silk, paper and wire — shaped by hand, tinted in soft, natural palettes, and finished so they catch the light the way living flowers do.
          </p>
          <p>Our packaging is plastic-free, our wraps are recycled, and every piece is checked by a person before it leaves the studio.</p>

          <h2 id="care">Caring for your flowers</h2>
          <p>Dust every few weeks with a soft brush or a hairdryer on its coolest setting. Keep out of long, direct sun. Wired stems can be reshaped gently with your fingers. If a petal ever comes loose, we will repair it for life.</p>

          <h2 id="delivery">Delivery</h2>
          <p>Standard delivery takes 3–5 business days and is free over $75. Express arrives the next business day, and same-day courier is available to selected local addresses when you order before 1pm.</p>

          <h2 id="returns">Returns</h2>
          <p>Not quite right? Return anything in its original packaging within 30 days for a full refund. We will even send a prepaid label.</p>
        </article>

        <div className="center">
          <Link to="/shop" className="btn btn-primary btn-lg">
            Explore the collection <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  )
}
