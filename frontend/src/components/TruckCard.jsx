import { Eye, Plus, Warehouse } from 'lucide-react'
import { formatAed } from '../api'

export default function TruckCard({ truck, onViewSpecs, onAdd, index }) {
  const inStock = truck.stock_vin_count > 0

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-steel-200/80 bg-white/90 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-steel-400 hover:shadow-panel animate-rise"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-steel-900 via-steel-700 to-steel-600">
        <div className="absolute inset-0 bg-grid bg-[length:20px_20px] opacity-30" />
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-brand/20 blur-2xl transition duration-500 group-hover:bg-amber-brand/35" />
        <div className="absolute inset-0 flex items-end justify-between p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-brand">
              {truck.brand}
            </p>
            <h3 className="mt-1 max-w-[16rem] font-display text-lg leading-tight text-white">
              {truck.model_name}
            </h3>
          </div>
          <span className="rounded-md bg-amber-brand px-2.5 py-1 font-mono text-xs font-semibold text-steel-950">
            {truck.drive_type}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-steel-50 px-2 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-steel-500">Power</p>
            <p className="mt-0.5 text-sm font-semibold text-steel-900">{truck.horsepower} HP</p>
          </div>
          <div className="rounded-lg bg-steel-50 px-2 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-steel-500">Emission</p>
            <p className="mt-0.5 text-sm font-semibold text-steel-900">{truck.emission_standard}</p>
          </div>
          <div className="rounded-lg bg-steel-50 px-2 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-steel-500">Stock</p>
            <p className={`mt-0.5 text-sm font-semibold ${inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
              {truck.stock_vin_count} VIN
            </p>
          </div>
        </div>

        <div className="space-y-1 text-sm text-steel-600">
          <p className="truncate">
            <span className="text-steel-400">Engine · </span>
            {truck.engine_model}
          </p>
          <p className="truncate">
            <span className="text-steel-400">Gearbox · </span>
            {truck.transmission}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-steel-100 pt-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-steel-400">Retail AED</p>
            <p className="font-display text-2xl text-steel-900">{formatAed(truck.retail_price_aed)}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-steel-500">
            <Warehouse className="h-3.5 w-3.5" />
            <span>{inStock ? 'Dubai yard' : 'Indent'}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onViewSpecs(truck)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-steel-200 bg-white px-3 py-2.5 text-sm font-medium text-steel-700 transition hover:border-steel-400 hover:bg-steel-50"
          >
            <Eye className="h-4 w-4" />
            View Specs
          </button>
          <button
            type="button"
            onClick={() => onAdd(truck)}
            disabled={!inStock}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-steel-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-steel-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            Add to Quote
          </button>
        </div>
      </div>
    </article>
  )
}
