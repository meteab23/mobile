import { Link } from 'react-router-dom'
import { ArtSvg } from '../art/FlowerArt'
import { ArrowRight, GiftIcon, LeafIcon, RefreshIcon, StarIcon, SunIcon, TruckIcon } from '../components/Icons'
import { BloomLine } from '../components/Logo'
import { ProductCard } from '../components/ProductCard'
import { CATEGORIES, getProduct, PRODUCTS } from '../data/products'
import { useReveal } from '../lib/useReveal'

const FEATURES = [
  { icon: <SunIcon />, title: 'Never wilts', body: 'UV-stable pigments keep colour true on a bright windowsill.' },
  { icon: <LeafIcon />, title: 'Hand-finished', body: 'Every petal is shaped, tinted and wired by hand in our studio.' },
  { icon: <RefreshIcon />, title: 'Zero upkeep', body: 'No water, no trimming, no allergies. Just a soft dust now and then.' },
  { icon: <TruckIcon />, title: 'Free over $75', body: 'Carefully boxed and shipped in recycled, plastic-free packaging.' },
]

const REVIEWS = [
  { quote: 'I keep catching guests touching the peonies to check if they are real. They have been on my dining table for two years.', name: 'Amelia R.', place: 'Brooklyn, NY' },
  { quote: 'The packaging alone felt like a gift. The bouquet arrived perfect, wrapped, and ready to display. My mum cried.', name: 'Sofia M.', place: 'Austin, TX' },
  { quote: 'Allergies mean I can never have fresh flowers at home. Fleurétern changed that — the Hydrangea Cloud is gorgeous.', name: 'Daniel K.', place: 'Seattle, WA' },
]

export function Home() {
  const ref = useReveal()
  const best = PRODUCTS.filter((p) => p.badge === 'Bestseller').slice(0, 4)
  const feature = getProduct('blush-peony-bouquet')!
  const feature2 = getProduct('hydrangea-cloud')!
  const feature3 = getProduct('cherry-blossom-branch')!

  return (
    <div ref={ref}>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Everlasting botanicals</span>
            <h1>
              Flowers that stay,
              <br />
              <em>long after the season goes.</em>
            </h1>
            <p className="lead">
              Hand-finished artificial bouquets, arrangements and stems — made to look, feel and live like the real thing. Delicate on the eye, effortless to keep.
            </p>
            <div className="hero-cta">
              <Link to="/shop?category=bouquets" className="btn btn-primary btn-lg">
                Shop bouquets <ArrowRight />
              </Link>
              <Link to="/shop?category=arrangements" className="btn btn-outline btn-lg">
                Arrangements
              </Link>
            </div>
            <div className="hero-proof">
              <span className="proof-stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} />
                ))}
              </span>
              <span>
                Rated <strong>4.9</strong> by 2,400+ happy homes
              </span>
            </div>
          </div>
          <div className="hero-art" aria-hidden>
            <div className="hero-arch hero-arch-a">
              <ArtSvg art={feature2.art} seed="hero-a" showFrame={false} />
            </div>
            <div className="hero-arch hero-arch-main">
              <ArtSvg art={feature.art} seed="hero-main" />
            </div>
            <div className="hero-arch hero-arch-b">
              <ArtSvg art={feature3.art} seed="hero-b" showFrame={false} />
            </div>
          </div>
        </div>
      </section>

      <section className="strip">
        <div className="container strip-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="strip-item reveal">
              <span className="strip-icon">{f.icon}</span>
              <div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Browse by</span>
            <h2>Find your arrangement</h2>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((c, i) => {
              const sample = PRODUCTS.filter((p) => p.category === c.id)[i % 2 === 0 ? 0 : 1] ?? PRODUCTS[0]
              return (
                <Link key={c.id} to={`/shop?category=${c.id}`} className="cat-tile reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                  <div className="cat-art">
                    <ArtSvg art={sample.art} seed={`cat-${c.id}`} showFrame={false} />
                  </div>
                  <h3>{c.label}</h3>
                  <p>{c.blurb}</p>
                  <span className="link-arrow">
                    Shop {c.label.toLowerCase()} <ArrowRight />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-head section-head-row reveal">
            <div>
              <span className="eyebrow">Most loved</span>
              <h2>Bestsellers</h2>
            </div>
            <Link to="/shop" className="link-arrow">
              View all <ArrowRight />
            </Link>
          </div>
          <div className="grid">
            {best.map((p) => (
              <div key={p.id} className="reveal">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section story">
        <div className="container story-grid">
          <div className="story-art reveal">
            <div className="story-arch">
              <BloomLine className="story-bloom" />
            </div>
            <span className="story-note">Est. in a small studio, 2019</span>
          </div>
          <div className="story-copy reveal">
            <span className="eyebrow">Our philosophy</span>
            <h2>
              Beauty that doesn’t ask
              <br />
              anything of you.
            </h2>
            <p>
              Fleurétern began with a simple idea: the loveliest flowers should not be a fleeting expense. We study real blooms — the fold of a peony, the powdery edge of an anemone — and recreate them in silk, paper and wire.
            </p>
            <p>Each piece is arranged by hand, photographed in daylight, and packed in plastic-free materials. Keep them for years, gift them without worry, and let the season be whatever it wants.</p>
            <ul className="tick-list">
              <li>Petals shaped by hand, never moulded flat</li>
              <li>Recycled paper wraps and compostable fillers</li>
              <li>Lifetime petal-repair promise</li>
            </ul>
            <Link to="/story" className="btn btn-outline">
              Read our story
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Kind words</span>
            <h2>Loved in homes everywhere</h2>
          </div>
          <div className="reviews">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="review reveal">
                <span className="proof-stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon key={i} />
                  ))}
                </span>
                <blockquote>“{r.quote}”</blockquote>
                <figcaption>
                  <strong>{r.name}</strong> · {r.place}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <div className="cta-copy">
              <GiftIcon width={30} height={30} />
              <h2>Your first bloom, 10% lighter.</h2>
              <p>
                Use code <strong>FLEUR10</strong> at checkout — plus free delivery on orders over $75.
              </p>
              <Link to="/shop" className="btn btn-primary btn-lg">
                Start shopping <ArrowRight />
              </Link>
            </div>
            <div className="cta-art" aria-hidden>
              <ArtSvg art={getProduct('garden-rose-reverie')!.art} seed="cta" showFrame={false} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
