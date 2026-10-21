import { Link } from 'react-router-dom'
import { BloomLine } from '../components/Logo'

export function NotFound() {
  return (
    <div className="page">
      <div className="container empty-state big">
        <BloomLine className="nf-bloom" />
        <span className="eyebrow">404</span>
        <h1>This page has wilted away</h1>
        <p className="muted">The page you were looking for isn’t here, but plenty of blooms are.</p>
        <Link to="/shop" className="btn btn-primary">
          Back to the shop
        </Link>
      </div>
    </div>
  )
}
