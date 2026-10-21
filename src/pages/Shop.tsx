import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CloseIcon, SearchIcon } from '../components/Icons'
import { ProductCard } from '../components/ProductCard'
import { CATEGORIES, COLOR_FILTERS, PRODUCTS, type Category } from '../data/products'

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
  { id: 'popular', label: 'Most reviewed' },
]

export function Shop() {
  const [params, setParams] = useSearchParams()
  const category = (params.get('category') as Category | null) ?? null
  const color = params.get('color')
  const sort = params.get('sort') ?? 'featured'
  const q = params.get('q') ?? ''

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const items = useMemo(() => {
    let list = PRODUCTS.filter((p) => (!category || p.category === category) && (!color || p.colors.includes(color)))
    if (q) {
      const needle = q.toLowerCase()
      list = list.filter((p) => `${p.name} ${p.tagline} ${p.description} ${p.colors.join(' ')} ${p.category}`.toLowerCase().includes(needle))
    }
    const sorted = [...list]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    if (sort === 'popular') sorted.sort((a, b) => b.reviews - a.reviews)
    return sorted
  }, [category, color, sort, q])

  const activeCat = CATEGORIES.find((c) => c.id === category)
  const hasFilters = Boolean(category || color || q)

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <span className="eyebrow">{activeCat ? 'Collection' : 'The collection'}</span>
          <h1>{q ? `Results for “${q}”` : (activeCat?.label ?? 'All flowers')}</h1>
          <p className="muted">{activeCat?.blurb ?? 'Bouquets, arrangements and stems — all made to last.'}</p>
        </header>

        <div className="filters">
          <div className="chips" role="tablist" aria-label="Categories">
            <button className={`chip ${!category ? 'on' : ''}`} onClick={() => set('category', null)}>
              All
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.id} className={`chip ${category === c.id ? 'on' : ''}`} onClick={() => set('category', c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="filter-right">
            <div className="swatches" aria-label="Filter by colour">
              {COLOR_FILTERS.map((c) => (
                <button
                  key={c.name}
                  className={`swatch ${color === c.name ? 'on' : ''}`}
                  style={{ background: c.swatch }}
                  title={c.name}
                  aria-label={`${c.name}${color === c.name ? ' (selected)' : ''}`}
                  aria-pressed={color === c.name}
                  onClick={() => set('color', color === c.name ? null : c.name)}
                />
              ))}
            </div>
            <label className="select-wrap">
              <span className="sr-only">Sort by</span>
              <select value={sort} onChange={(e) => set('sort', e.target.value === 'featured' ? null : e.target.value)}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="result-bar">
          <span className="muted">
            {items.length} {items.length === 1 ? 'piece' : 'pieces'}
            {color && ` · ${color}`}
          </span>
          {hasFilters && (
            <button className="link-btn" onClick={() => setParams({}, { replace: true })}>
              <CloseIcon width={14} height={14} /> Clear filters
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <SearchIcon width={28} height={28} />
            <h3>Nothing matches just yet</h3>
            <p className="muted">Try a different colour or clear your filters.</p>
            <Link to="/shop" className="btn btn-primary">
              See everything
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
