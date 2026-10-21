import { Link } from 'react-router-dom'
import { ArtSvg } from '../art/FlowerArt'
import { CATEGORIES, type Product } from '../data/products'
import { money } from '../lib/format'
import { useStore } from '../store/StoreContext'
import { HeartIcon, PlusIcon, StarIcon } from './Icons'

export function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      <StarIcon />
      <span>{rating.toFixed(1)}</span>
      {count !== undefined && <span className="stars-count">({count})</span>}
    </span>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const { state, toggleWish, addToCart } = useStore()
  const wished = state.wishlist.includes(product.id)
  const cat = CATEGORIES.find((c) => c.id === product.category)

  return (
    <article className="pcard">
      <div className="pcard-media">
        <Link to={`/product/${product.id}`} aria-label={product.name} className="pcard-link">
          <ArtSvg art={product.art} seed={product.id} className="pcard-art" />
        </Link>
        {product.badge && <span className={`badge badge-${product.badge.toLowerCase()}`}>{product.badge}</span>}
        <button className={`wish ${wished ? 'on' : ''}`} onClick={() => toggleWish(product.id)} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={wished}>
          <HeartIcon filled={wished} width={18} height={18} />
        </button>
        <button
          className="quick-add"
          onClick={() => addToCart({ productId: product.id, size: 'classic', vase: false, qty: 1 })}
        >
          <PlusIcon /> Quick add
        </button>
      </div>
      <div className="pcard-body">
        <span className="eyebrow">{cat?.label}</span>
        <h3>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="pcard-meta">
          <span className="price">{money(product.price)}</span>
          <Stars rating={product.rating} count={product.reviews} />
        </div>
      </div>
    </article>
  )
}
