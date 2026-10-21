import { Link } from 'react-router-dom'
import { HeartIcon } from '../components/Icons'
import { ProductCard } from '../components/ProductCard'
import { getProduct } from '../data/products'
import { useStore } from '../store/StoreContext'

export function Wishlist() {
  const { state } = useStore()
  const items = state.wishlist.map(getProduct).filter((p) => !!p)

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <span className="eyebrow">Saved for later</span>
          <h1>Your wishlist</h1>
        </header>
        {items.length === 0 ? (
          <div className="empty-state">
            <HeartIcon width={30} height={30} />
            <h3>Nothing saved yet</h3>
            <p className="muted">Tap the heart on any piece to keep it here.</p>
            <Link to="/shop" className="btn btn-primary">
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="grid">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
