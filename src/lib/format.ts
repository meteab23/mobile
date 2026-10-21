const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const usdWhole = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const money = (n: number) => (Number.isInteger(n) ? usdWhole.format(n) : usd.format(n))
export const moneyExact = (n: number) => usd.format(n)

export function formatDate(d: Date, opts: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' }) {
  return new Intl.DateTimeFormat('en-US', opts).format(d)
}

export function formatCardNumber(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 19)
  if (/^3[47]/.test(digits)) {
    const d = digits.slice(0, 15)
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10)].filter(Boolean).join(' ')
  }
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

export function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4)
  if (d.length < 3) return d
  return `${d.slice(0, 2)} / ${d.slice(2)}`
}

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'

export function cardBrand(num: string): CardBrand {
  const d = num.replace(/\D/g, '')
  if (/^4/.test(d)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'mastercard'
  if (/^3[47]/.test(d)) return 'amex'
  if (/^(6011|65)/.test(d)) return 'discover'
  return 'unknown'
}

export function luhn(num: string) {
  const d = num.replace(/\D/g, '')
  if (d.length < 13) return false
  let sum = 0
  let alt = false
  for (let i = d.length - 1; i >= 0; i--) {
    let n = Number(d[i])
    if (alt) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alt = !alt
  }
  return sum % 10 === 0
}

export function expiryValid(v: string) {
  const m = v.replace(/\D/g, '')
  if (m.length !== 4) return false
  const month = Number(m.slice(0, 2))
  const year = 2000 + Number(m.slice(2))
  if (month < 1 || month > 12) return false
  const now = new Date()
  const endOfMonth = new Date(year, month, 0, 23, 59, 59)
  return endOfMonth >= now
}

export const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
