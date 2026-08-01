import { X } from 'lucide-react'
import { formatAed } from '../api'

function SpecRow({ label, value }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 border-b border-steel-100 py-2.5 last:border-0">
      <dt className="font-mono text-[11px] uppercase tracking-wider text-steel-400">{label}</dt>
      <dd className="text-sm font-medium text-steel-800">{String(value)}</dd>
    </div>
  )
}

function humanize(key) {
  return key.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function SpecsModal({ truck, onClose, onAdd }) {
  if (!truck) return null

  const specEntries = Object.entries(truck.specs || {})

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-steel-950/55 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-steel-200 bg-white shadow-panel animate-rise"
      >
        <div className="flex items-start justify-between gap-4 border-b border-steel-100 bg-gradient-to-r from-steel-900 to-steel-700 px-6 py-5 text-white">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-brand">
              Technical dossier
            </p>
            <h2 className="mt-1 font-display text-xl leading-tight">
              {truck.brand} {truck.model_name}
            </h2>
            <p className="mt-2 text-sm text-steel-200">
              {truck.horsepower} HP · {truck.drive_type} · {truck.emission_standard} ·{' '}
              {formatAed(truck.retail_price_aed)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-steel-200 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          <dl>
            <SpecRow label="Engine" value={truck.engine_model} />
            <SpecRow label="Transmission" value={truck.transmission} />
            <SpecRow label="Drive" value={truck.drive_type} />
            <SpecRow label="Horsepower" value={`${truck.horsepower} HP`} />
            <SpecRow label="Emission" value={truck.emission_standard} />
            <SpecRow label="FOB (USD)" value={`$${Number(truck.fob_price_usd).toLocaleString()}`} />
            <SpecRow label="Landed Cost" value={formatAed(truck.landed_cost_aed)} />
            <SpecRow label="Retail" value={formatAed(truck.retail_price_aed)} />
            <SpecRow label="Yard Stock" value={`${truck.stock_vin_count} VIN units`} />
            {specEntries.map(([key, value]) => (
              <SpecRow key={key} label={humanize(key)} value={value} />
            ))}
          </dl>
        </div>

        <div className="flex justify-end gap-2 border-t border-steel-100 bg-steel-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-steel-200 bg-white px-4 py-2.5 text-sm font-medium text-steel-700 hover:bg-steel-100"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onAdd(truck)
              onClose()
            }}
            className="rounded-xl bg-steel-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-steel-800"
          >
            Add to Quotation
          </button>
        </div>
      </div>
    </div>
  )
}
