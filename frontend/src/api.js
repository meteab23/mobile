const API_BASE = import.meta.env.VITE_API_BASE || '/api'

async function handleJson(res) {
  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const data = await res.json()
      detail = data.detail || JSON.stringify(data)
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }
  return res.json()
}

export async function fetchTrucks() {
  const res = await fetch(`${API_BASE}/trucks/`)
  return handleJson(res)
}

export async function generateQuotationPdf(payload) {
  const res = await fetch(`${API_BASE}/quotations/generate-pdf/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    let detail = `PDF generation failed (${res.status})`
    try {
      const data = await res.json()
      detail = data.detail || JSON.stringify(data)
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }

  const blob = await res.blob()
  const disposition = res.headers.get('Content-Disposition') || ''
  const match = disposition.match(/filename="?([^"]+)"?/)
  const filename = match?.[1] || 'quotation.pdf'
  return { blob, filename }
}

export function formatAed(value) {
  const num = Number(value) || 0
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatAedExact(value) {
  const num = Number(value) || 0
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}
