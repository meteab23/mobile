import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { CheckIcon, CloseIcon } from './Icons'

export function PromoBox() {
  const { promo, applyPromo, clearPromo } = useStore()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  if (promo) {
    return (
      <div className="promo-applied">
        <CheckIcon width={16} height={16} />
        <span>
          <strong>{promo.code}</strong> · {promo.label}
        </span>
        <button className="icon-btn" onClick={() => { clearPromo(); setMsg(null) }} aria-label="Remove promo code">
          <CloseIcon width={16} height={16} />
        </button>
      </div>
    )
  }

  return (
    <form
      className="promo"
      onSubmit={(e) => {
        e.preventDefault()
        const r = applyPromo(code)
        setMsg({ ok: r.ok, text: r.message })
        if (r.ok) setCode('')
      }}
    >
      <div className="promo-row">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" aria-label="Promo code" autoCapitalize="characters" />
        <button className="btn btn-outline" type="submit">
          Apply
        </button>
      </div>
      {msg && <p className={`field-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</p>}
    </form>
  )
}
