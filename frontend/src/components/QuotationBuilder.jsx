import { useMemo, useState } from 'react'
import {
  FileDown,
  Loader2,
  Minus,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { formatAedExact, generateQuotationPdf } from '../api'

const emptyClient = {
  client_name: '',
  company_name: '',
  client_email: '',
  client_phone: '',
}

export default function QuotationBuilder({
  open,
  items,
  onClose,
  onUpdateItem,
  onRemoveItem,
  onClear,
}) {
  const [client, setClient] = useState(emptyClient)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.unit_selling_price_aed) * Number(item.quantity),
      0,
    )
    const vat = subtotal * 0.05
    const total = subtotal + vat
    return { subtotal, vat, total }
  }, [items])

  if (!open) return null

  const updateClient = (field) => (e) => {
    setClient((prev) => ({ ...prev, [field]: e.target.value }))
    setError('')
    setSuccess('')
  }

  const handleGenerate = async () => {
    setError('')
    setSuccess('')

    if (!items.length) {
      setError('Add at least one truck to the quotation.')
      return
    }
    if (!client.client_name.trim() || !client.company_name.trim()) {
      setError('Client name and company are required.')
      return
    }
    if (!client.client_email.trim() || !client.client_phone.trim()) {
      setError('Client email and phone are required.')
      return
    }

    setBusy(true)
    try {
      const payload = {
        ...client,
        items: items.map((item) => ({
          truck_id: item.truck.id,
          quantity: Number(item.quantity),
          unit_selling_price_aed: Number(item.unit_selling_price_aed).toFixed(2),
          custom_notes: item.custom_notes || '',
        })),
      }

      const { blob, filename } = await generateQuotationPdf(payload)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setSuccess(`PDF downloaded: ${filename}`)
    } catch (err) {
      setError(err.message || 'Failed to generate PDF')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end animate-fade">
      <button
        type="button"
        aria-label="Close quotation drawer"
        className="absolute inset-0 bg-steel-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-panel animate-drawer">
        <header className="flex items-start justify-between border-b border-steel-100 bg-steel-950 px-5 py-4 text-white">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-brand">
              Quotation builder
            </p>
            <h2 className="mt-1 font-display text-xl">Fleet Quote Draft</h2>
            <p className="mt-1 text-sm text-steel-300">
              {items.length} line{items.length === 1 ? '' : 's'} · Live UAE VAT 5%
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-steel-300 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-steel-500">
                Selected trucks
              </h3>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-xs font-medium text-rose-600 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-steel-200 bg-steel-50 px-4 py-10 text-center text-sm text-steel-500">
                No trucks yet. Add units from the catalog to build a quote.
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.truck.id}
                    className="rounded-xl border border-steel-200 bg-steel-50/70 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-amber-deep">
                          {item.truck.brand} · {item.truck.drive_type}
                        </p>
                        <p className="text-sm font-semibold text-steel-900">
                          {item.truck.model_name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.truck.id)}
                        className="rounded-lg p-1.5 text-steel-400 hover:bg-white hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <label className="block text-xs text-steel-500">
                        Qty
                        <div className="mt-1 flex items-center overflow-hidden rounded-lg border border-steel-200 bg-white">
                          <button
                            type="button"
                            className="px-2 py-2 text-steel-600 hover:bg-steel-50"
                            onClick={() =>
                              onUpdateItem(item.truck.id, {
                                quantity: Math.max(1, Number(item.quantity) - 1),
                              })
                            }
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              onUpdateItem(item.truck.id, {
                                quantity: Math.max(1, Number(e.target.value) || 1),
                              })
                            }
                            className="w-full border-x border-steel-200 py-1.5 text-center text-sm outline-none"
                          />
                          <button
                            type="button"
                            className="px-2 py-2 text-steel-600 hover:bg-steel-50"
                            onClick={() =>
                              onUpdateItem(item.truck.id, {
                                quantity: Number(item.quantity) + 1,
                              })
                            }
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </label>

                      <label className="block text-xs text-steel-500">
                        Unit price (AED)
                        <input
                          type="number"
                          min="1"
                          step="100"
                          value={item.unit_selling_price_aed}
                          onChange={(e) =>
                            onUpdateItem(item.truck.id, {
                              unit_selling_price_aed: Number(e.target.value) || 0,
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-steel-200 bg-white px-3 py-2 text-sm outline-none focus:border-steel-500"
                        />
                      </label>
                    </div>

                    <label className="mt-3 block text-xs text-steel-500">
                      Custom notes / add-ons
                      <textarea
                        rows={2}
                        value={item.custom_notes}
                        onChange={(e) =>
                          onUpdateItem(item.truck.id, { custom_notes: e.target.value })
                        }
                        placeholder="e.g. Includes 1-Year Free Service + RTA Registration"
                        className="mt-1 w-full rounded-lg border border-steel-200 bg-white px-3 py-2 text-sm outline-none focus:border-steel-500"
                      />
                    </label>

                    <p className="mt-2 text-right text-sm font-semibold text-steel-800">
                      Line:{' '}
                      {formatAedExact(
                        Number(item.unit_selling_price_aed) * Number(item.quantity),
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-steel-500">
              Client details
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block text-xs text-steel-500 sm:col-span-1">
                Contact name
                <input
                  value={client.client_name}
                  onChange={updateClient('client_name')}
                  className="mt-1 w-full rounded-lg border border-steel-200 px-3 py-2 text-sm outline-none focus:border-steel-500"
                  placeholder="Ahmed Al Maktoum"
                />
              </label>
              <label className="block text-xs text-steel-500">
                Company
                <input
                  value={client.company_name}
                  onChange={updateClient('company_name')}
                  className="mt-1 w-full rounded-lg border border-steel-200 px-3 py-2 text-sm outline-none focus:border-steel-500"
                  placeholder="Desert Fleet Logistics LLC"
                />
              </label>
              <label className="block text-xs text-steel-500">
                Email
                <input
                  type="email"
                  value={client.client_email}
                  onChange={updateClient('client_email')}
                  className="mt-1 w-full rounded-lg border border-steel-200 px-3 py-2 text-sm outline-none focus:border-steel-500"
                  placeholder="fleet@desertlogistics.ae"
                />
              </label>
              <label className="block text-xs text-steel-500">
                Phone
                <input
                  value={client.client_phone}
                  onChange={updateClient('client_phone')}
                  className="mt-1 w-full rounded-lg border border-steel-200 px-3 py-2 text-sm outline-none focus:border-steel-500"
                  placeholder="+971 50 123 4567"
                />
              </label>
            </div>
          </section>
        </div>

        <footer className="border-t border-steel-100 bg-steel-50 px-5 py-4">
          <div className="mb-3 space-y-1 text-sm">
            <div className="flex justify-between text-steel-600">
              <span>Subtotal (AED)</span>
              <span className="font-medium">{formatAedExact(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-steel-600">
              <span>UAE VAT 5% (AED)</span>
              <span className="font-medium">{formatAedExact(totals.vat)}</span>
            </div>
            <div className="flex justify-between border-t border-steel-200 pt-2 text-base font-bold text-steel-950">
              <span>Grand Total</span>
              <span>{formatAedExact(totals.total)}</span>
            </div>
          </div>

          {error && (
            <p className="mb-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>
          )}
          {success && (
            <p className="mb-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {success}
            </p>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={handleGenerate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-brand px-4 py-3 text-sm font-bold text-steel-950 transition hover:brightness-105 disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF…
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                Generate &amp; Download PDF
              </>
            )}
          </button>
        </footer>
      </aside>
    </div>
  )
}
