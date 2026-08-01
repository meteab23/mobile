import { useEffect, useState } from 'react'
import { ClipboardList, Loader2, RefreshCw, Truck } from 'lucide-react'
import { fetchTrucks } from './api'
import TruckCard from './components/TruckCard'
import SpecsModal from './components/SpecsModal'
import QuotationBuilder from './components/QuotationBuilder'

export default function App() {
  const [trucks, setTrucks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [specsTruck, setSpecsTruck] = useState(null)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteItems, setQuoteItems] = useState([])

  const loadTrucks = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchTrucks()
      setTrucks(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      setError(err.message || 'Failed to load trucks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrucks()
  }, [])

  const addToQuote = (truck) => {
    setQuoteItems((prev) => {
      const existing = prev.find((item) => item.truck.id === truck.id)
      if (existing) {
        return prev.map((item) =>
          item.truck.id === truck.id
            ? { ...item, quantity: Number(item.quantity) + 1 }
            : item,
        )
      }
      return [
        ...prev,
        {
          truck,
          quantity: 1,
          unit_selling_price_aed: Number(truck.retail_price_aed),
          custom_notes: '',
        },
      ]
    })
    setQuoteOpen(true)
  }

  const updateItem = (truckId, patch) => {
    setQuoteItems((prev) =>
      prev.map((item) => (item.truck.id === truckId ? { ...item, ...patch } : item)),
    )
  }

  const removeItem = (truckId) => {
    setQuoteItems((prev) => prev.filter((item) => item.truck.id !== truckId))
  }

  const totalUnits = quoteItems.reduce((sum, item) => sum + Number(item.quantity), 0)

  return (
    <div className="min-h-screen bg-hero">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" />

      <header className="relative border-b border-steel-200/70 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-steel-900 to-steel-700 font-display text-sm text-amber-brand shadow-sm">
              GST
            </div>
            <div>
              <p className="font-display text-xl tracking-tight text-steel-950 sm:text-2xl">
                Gulf Sino Trucks
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel-500">
                UAE B2B Fleet Sales · China Import Yard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadTrucks}
              className="inline-flex items-center gap-2 rounded-xl border border-steel-200 bg-white px-3 py-2.5 text-sm font-medium text-steel-700 transition hover:border-steel-400"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setQuoteOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-steel-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-steel-800"
            >
              <ClipboardList className="h-4 w-4" />
              Quotation
              {totalUnits > 0 && (
                <span className="rounded-md bg-amber-brand px-1.5 py-0.5 font-mono text-[11px] font-bold text-steel-950">
                  {totalUnits}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <section className="mb-8 max-w-3xl animate-rise">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-deep">
            Dubai Maritime City · TRN 100492837100003
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-steel-950 sm:text-4xl">
            Commercial truck catalog for UAE fleet buyers
          </h1>
          <p className="mt-3 max-w-2xl text-base text-steel-600">
            Select Sinotruk, Shacman, FAW, and Foton units from China import stock, build a live
            AED quotation with 5% UAE VAT, and download a WeasyPrint PDF for your buyer.
          </p>
        </section>

        {loading && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-steel-200 bg-white/80 py-20 text-steel-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading yard inventory…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-6 text-rose-800">
            <p className="font-semibold">Could not reach the API</p>
            <p className="mt-1 text-sm">{error}</p>
            <p className="mt-2 text-sm text-rose-700">
              Start the Django server on port 8000, then refresh.
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-4 flex items-center gap-2 text-sm text-steel-500">
              <Truck className="h-4 w-4" />
              <span>
                {trucks.length} models in catalog · Dubai Maritime City yard
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4">
              {trucks.map((truck, index) => (
                <TruckCard
                  key={truck.id}
                  truck={truck}
                  index={index}
                  onViewSpecs={setSpecsTruck}
                  onAdd={addToQuote}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <SpecsModal
        truck={specsTruck}
        onClose={() => setSpecsTruck(null)}
        onAdd={addToQuote}
      />

      <QuotationBuilder
        open={quoteOpen}
        items={quoteItems}
        onClose={() => setQuoteOpen(false)}
        onUpdateItem={updateItem}
        onRemoveItem={removeItem}
        onClear={() => setQuoteItems([])}
      />
    </div>
  )
}
