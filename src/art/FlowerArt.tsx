import type { ReactNode } from 'react'

export type BloomKind =
  | 'peony'
  | 'rose'
  | 'ranunculus'
  | 'tulip'
  | 'anemone'
  | 'cosmos'
  | 'poppy'
  | 'hydrangea'

export type FoliageKind =
  | 'eucalyptus'
  | 'lavender'
  | 'pampas'
  | 'fern'
  | 'gypsophila'
  | 'blossom'

export interface BloomItem {
  kind: BloomKind
  x: number
  y: number
  r: number
  color: string
  rot?: number
  ox?: number
}

export interface FoliageItem {
  kind: FoliageKind
  len: number
  rot: number
  color: string
  ox?: number
}

export type VaseKind = 'bud' | 'round' | 'cylinder' | 'bowl'

export interface Art {
  bg: string
  blooms: BloomItem[]
  foliage?: FoliageItem[]
  vase?: { kind: VaseKind; color: string }
  wrap?: { color: string; ribbon: string }
  scale?: number
}

const INK = '#3a352e'
const SAGE = '#9fae91'

function rng(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function mix(a: string, b: string, t: number) {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  const c = (x: number, y: number) => Math.round(x + (y - x) * t)
  return `rgb(${c(r1, r2)},${c(g1, g2)},${c(b1, b2)})`
}

const f = (n: number) => Math.round(n * 100) / 100

function quad(t: number, p0: [number, number], p1: [number, number], p2: [number, number]) {
  const u = 1 - t
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ] as [number, number]
}

const strokeProps = { stroke: INK, strokeWidth: 1, strokeOpacity: 0.62, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

function Leaf({ len, rot = 0, color = SAGE, x = 0, y = 0 }: { len: number; rot?: number; color?: string; x?: number; y?: number }) {
  const w = len * 0.32
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(rot)})`}>
      <path
        d={`M0 0 C ${f(len * 0.25)} ${f(-w)} ${f(len * 0.7)} ${f(-w * 0.9)} ${f(len)} 0 C ${f(len * 0.7)} ${f(w * 0.9)} ${f(len * 0.25)} ${f(w)} 0 0Z`}
        fill={color}
        fillOpacity={0.85}
        {...strokeProps}
      />
      <path d={`M0 0 L ${f(len * 0.85)} 0`} fill="none" {...strokeProps} strokeOpacity={0.35} strokeWidth={0.8} />
    </g>
  )
}

function petalPath(len: number, width: number) {
  return `M0 0 C ${f(-width)} ${f(-len * 0.35)} ${f(-width * 1.15)} ${f(-len * 0.92)} 0 ${f(-len)} C ${f(width * 1.15)} ${f(-len * 0.92)} ${f(width)} ${f(-len * 0.35)} 0 0Z`
}

function Layered({ r, color, rings, count, wide, seed }: { r: number; color: string; rings: number; count: number; wide: number; seed: string }) {
  const rand = rng(seed)
  const out: ReactNode[] = []
  for (let i = 0; i < rings; i++) {
    const ringR = r * (1 - i * (0.78 / rings))
    const n = Math.max(4, count - Math.floor(i * 0.8))
    const fill = mix(color, i < rings - 1 ? '#ffffff' : INK, i === 0 ? 0.35 : i < rings - 1 ? 0.18 - i * 0.03 : 0.16)
    const offset = rand() * 360
    for (let k = 0; k < n; k++) {
      const rot = offset + (k * 360) / n + (rand() - 0.5) * 10
      const len = ringR * (0.92 + rand() * 0.14)
      out.push(
        <path
          key={`${i}-${k}`}
          d={petalPath(len, len * wide)}
          transform={`rotate(${f(rot)})`}
          fill={fill}
          {...strokeProps}
        />,
      )
    }
  }
  const curl = r * 0.2
  out.push(
    <path
      key="curl"
      d={`M${f(-curl)} 0 C ${f(-curl)} ${f(-curl * 1.2)} ${f(curl)} ${f(-curl * 1.2)} ${f(curl)} 0 C ${f(curl)} ${f(curl)} ${f(-curl * 0.2)} ${f(curl)} ${f(-curl * 0.2)} ${f(curl * 0.1)}`}
      fill="none"
      {...strokeProps}
      strokeOpacity={0.55}
    />,
  )
  return <>{out}</>
}

function Tulip({ r, color }: { r: number; color: string }) {
  const light = mix(color, '#ffffff', 0.28)
  const dark = mix(color, INK, 0.08)
  const h = r * 1.6
  return (
    <g transform={`translate(0 ${f(r * 0.1)})`}>
      <path
        d={`M0 0 C ${f(-r * 0.85)} ${f(-r * 0.1)} ${f(-r * 0.8)} ${f(-h * 0.8)} ${f(-r * 0.2)} ${f(-h)} C ${f(-r * 0.1)} ${f(-h * 0.6)} 0 ${f(-h * 0.3)} 0 0Z`}
        fill={dark}
        {...strokeProps}
      />
      <path
        d={`M0 0 C ${f(r * 0.85)} ${f(-r * 0.1)} ${f(r * 0.8)} ${f(-h * 0.8)} ${f(r * 0.2)} ${f(-h)} C ${f(r * 0.1)} ${f(-h * 0.6)} 0 ${f(-h * 0.3)} 0 0Z`}
        fill={dark}
        {...strokeProps}
      />
      <path
        d={`M0 0 C ${f(-r * 0.55)} ${f(-h * 0.2)} ${f(-r * 0.5)} ${f(-h * 0.95)} 0 ${f(-h * 1.12)} C ${f(r * 0.5)} ${f(-h * 0.95)} ${f(r * 0.55)} ${f(-h * 0.2)} 0 0Z`}
        fill={light}
        {...strokeProps}
      />
      <path d={`M0 ${f(-h * 0.1)} C ${f(-r * 0.05)} ${f(-h * 0.5)} ${f(r * 0.02)} ${f(-h * 0.8)} 0 ${f(-h * 1.05)}`} fill="none" {...strokeProps} strokeOpacity={0.3} strokeWidth={0.8} />
    </g>
  )
}

function Stamens({ r, n, spread }: { r: number; n: number; spread: number }) {
  const out: ReactNode[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.3
    const l = r * spread * (0.8 + ((i * 37) % 10) / 25)
    const x = Math.cos(a) * l
    const y = Math.sin(a) * l
    out.push(
      <g key={i}>
        <path d={`M0 0 L ${f(x)} ${f(y)}`} stroke={INK} strokeWidth={0.9} strokeOpacity={0.6} strokeLinecap="round" />
        <circle cx={f(x)} cy={f(y)} r={Math.max(1.2, r * 0.045)} fill={INK} fillOpacity={0.75} />
      </g>,
    )
  }
  return <>{out}</>
}

function Anemone({ r, color }: { r: number; color: string }) {
  const n = 6
  const petals = Array.from({ length: n }, (_, k) => (
    <ellipse
      key={k}
      cx={0}
      cy={f(-r * 0.52)}
      rx={f(r * 0.46)}
      ry={f(r * 0.58)}
      transform={`rotate(${k * (360 / n) + 15})`}
      fill={mix(color, '#ffffff', 0.25)}
      {...strokeProps}
    />
  ))
  return (
    <>
      {petals}
      <circle r={f(r * 0.24)} fill="#4a4658" fillOpacity={0.92} stroke={INK} strokeWidth={0.8} />
      <Stamens r={r} n={16} spread={0.42} />
    </>
  )
}

function Cosmos({ r, color }: { r: number; color: string }) {
  const n = 8
  return (
    <>
      {Array.from({ length: n }, (_, k) => (
        <path
          key={k}
          d={petalPath(r * 0.98, r * 0.3)}
          transform={`rotate(${k * (360 / n)})`}
          fill={mix(color, '#ffffff', 0.22)}
          {...strokeProps}
        />
      ))}
      <circle r={f(r * 0.14)} fill="#e6c36b" stroke={INK} strokeWidth={0.8} strokeOpacity={0.6} />
      <circle r={f(r * 0.06)} cx={f(r * 0.03)} cy={f(-r * 0.03)} fill={INK} fillOpacity={0.35} />
    </>
  )
}

function Poppy({ r, color }: { r: number; color: string }) {
  const petals = [0, 90, 180, 270].map((a, k) => (
    <path
      key={k}
      d={`M0 0 C ${f(-r * 0.9)} ${f(-r * 0.1)} ${f(-r * 1.05)} ${f(-r * 0.95)} ${f(-r * 0.3)} ${f(-r * 1.05)} Q 0 ${f(-r * 1.2)} ${f(r * 0.3)} ${f(-r * 1.05)} C ${f(r * 1.05)} ${f(-r * 0.95)} ${f(r * 0.9)} ${f(-r * 0.1)} 0 0Z`}
      transform={`rotate(${a + 20})`}
      fill={mix(color, '#ffffff', k % 2 ? 0.05 : 0.2)}
      fillOpacity={0.94}
      {...strokeProps}
    />
  ))
  return (
    <>
      {petals}
      {Array.from({ length: 4 }, (_, k) => (
        <path key={`c${k}`} d={`M0 0 Q ${f(-r * 0.2)} ${f(-r * 0.5)} ${f(-r * 0.12)} ${f(-r * 0.78)}`} transform={`rotate(${k * 90 + 55})`} fill="none" {...strokeProps} strokeOpacity={0.3} strokeWidth={0.7} />
      ))}
      <circle r={f(r * 0.17)} fill="#403a44" stroke={INK} strokeWidth={0.8} />
      <Stamens r={r} n={18} spread={0.34} />
    </>
  )
}

function Hydrangea({ r, color, seed }: { r: number; color: string; seed: string }) {
  const rand = rng(seed)
  const out: ReactNode[] = []
  const n = 34
  const golden = Math.PI * (3 - Math.sqrt(5))
  const pts = Array.from({ length: n }, (_, i) => {
    const rad = Math.sqrt((i + 0.5) / n) * r * 0.84
    return { x: Math.cos(i * golden) * rad, y: Math.sin(i * golden) * rad * 0.9 }
  }).reverse()
  pts.forEach((p, i) => {
    const s = r * (0.2 + rand() * 0.04)
    const fill = mix(color, rand() > 0.5 ? '#ffffff' : '#6f7fb0', 0.12 + rand() * 0.28)
    const rot = rand() * 90
    out.push(
      <g key={i} transform={`translate(${f(p.x)} ${f(p.y)}) rotate(${f(rot)})`}>
        {[0, 90, 180, 270].map((a) => (
          <ellipse key={a} cx={0} cy={f(-s * 0.55)} rx={f(s * 0.5)} ry={f(s * 0.6)} transform={`rotate(${a})`} fill={fill} {...strokeProps} strokeWidth={0.8} />
        ))}
        <circle r={f(s * 0.14)} fill={INK} fillOpacity={0.5} />
      </g>,
    )
  })
  return <>{out}</>
}

function Bloom({ item, seed }: { item: BloomItem; seed: string }) {
  const { kind, r, color } = item
  switch (kind) {
    case 'peony':
      return <Layered r={r} color={color} rings={4} count={9} wide={0.52} seed={seed} />
    case 'rose':
      return <Layered r={r} color={color} rings={5} count={6} wide={0.46} seed={seed} />
    case 'ranunculus':
      return <Layered r={r} color={color} rings={6} count={10} wide={0.42} seed={seed} />
    case 'tulip':
      return <Tulip r={r} color={color} />
    case 'anemone':
      return <Anemone r={r} color={color} />
    case 'cosmos':
      return <Cosmos r={r} color={color} />
    case 'poppy':
      return <Poppy r={r} color={color} />
    case 'hydrangea':
      return <Hydrangea r={r} color={color} seed={seed} />
  }
}

function stemGeometry(item: BloomItem, ox: number, oy: number): { d: string; mid: [number, number]; p0: [number, number]; p1: [number, number]; p2: [number, number] } {
  const bend = (item.x - ox) * 0.15
  const p0: [number, number] = [ox, oy]
  const p1: [number, number] = [ox + (item.x - ox) * 0.35 - bend, oy + (item.y - oy) * 0.55]
  const bloomBottom = item.kind === 'tulip' ? item.y + item.r * 0.1 : item.y + item.r * 0.1
  const p2: [number, number] = [item.x, bloomBottom]
  return { d: `M${f(p0[0])} ${f(p0[1])} Q ${f(p1[0])} ${f(p1[1])} ${f(p2[0])} ${f(p2[1])}`, mid: quad(0.5, p0, p1, p2), p0, p1, p2 }
}

function Foliage({ item, seed }: { item: FoliageItem; seed: string }) {
  const rand = rng(seed)
  const { kind, len, color } = item
  const lean = 0
  const p0: [number, number] = [0, 0]
  const p1: [number, number] = [lean + len * 0.1, -len * 0.5]
  const p2: [number, number] = [lean, -len]
  const stem = <path d={`M0 0 Q ${f(p1[0])} ${f(p1[1])} ${f(p2[0])} ${f(p2[1])}`} fill="none" stroke={INK} strokeWidth={1.1} strokeOpacity={0.62} strokeLinecap="round" />
  const els: ReactNode[] = []

  if (kind === 'eucalyptus' || kind === 'fern') {
    const count = kind === 'eucalyptus' ? 11 : 15
    for (let i = 0; i < count; i++) {
      const t = 0.18 + (i / count) * 0.8
      const [x, y] = quad(t, p0, p1, p2)
      const side = i % 2 ? 1 : -1
      const size = (kind === 'eucalyptus' ? 13 : 24) * (1.05 - t * 0.45)
      if (kind === 'eucalyptus') {
        els.push(
          <g key={i} transform={`translate(${f(x)} ${f(y)}) rotate(${side * (48 + rand() * 12)})`}>
            <ellipse cx={0} cy={f(-size * 0.9)} rx={f(size * 0.8)} ry={f(size)} fill={mix(color, '#ffffff', rand() * 0.2)} fillOpacity={0.92} {...strokeProps} />
            <path d={`M0 0 L0 ${f(-size * 1.7)}`} {...strokeProps} strokeOpacity={0.3} strokeWidth={0.7} />
          </g>,
        )
      } else {
        els.push(<Leaf key={i} x={x} y={y} len={size * 1.1} rot={-90 + side * (55 + rand() * 10)} color={color} />)
      }
    }
    if (kind === 'fern') els.push(<Leaf key="tip" x={p2[0]} y={p2[1]} len={12} rot={-90} color={color} />)
  }

  if (kind === 'lavender') {
    const count = 15
    for (let i = 0; i < count; i++) {
      const t = 0.5 + (i / count) * 0.5
      const [x, y] = quad(t, p0, p1, p2)
      const s = 5.5 - t * 1.8
      for (const side of [-1, 1]) {
        els.push(
          <ellipse key={`${i}${side}`} cx={f(x + side * s * 0.9)} cy={f(y)} rx={f(s * 0.55)} ry={f(s * 1.2)} transform={`rotate(${side * 28} ${f(x)} ${f(y)})`} fill={mix(color, '#ffffff', rand() * 0.25)} {...strokeProps} strokeWidth={0.8} />,
        )
      }
    }
    els.push(<ellipse key="top" cx={f(p2[0])} cy={f(p2[1] - 3)} rx={2.2} ry={5} fill={color} {...strokeProps} strokeWidth={0.8} />)
    els.push(<Leaf key="l1" x={quad(0.22, p0, p1, p2)[0]} y={quad(0.22, p0, p1, p2)[1]} len={len * 0.12} rot={-128} color={SAGE} />)
    els.push(<Leaf key="l2" x={quad(0.3, p0, p1, p2)[0]} y={quad(0.3, p0, p1, p2)[1]} len={len * 0.1} rot={-52} color={SAGE} />)
  }

  if (kind === 'pampas') {
    const top = quad(0.58, p0, p1, p2)
    for (let i = 0; i < 46; i++) {
      const spread = (rand() - 0.5) * 1.5
      const l = len * (0.3 + rand() * 0.2)
      const a = -Math.PI / 2 + spread
      const ex = top[0] + Math.cos(a) * l * 0.55 + spread * 12
      const ey = top[1] + Math.sin(a) * l
      const cx = top[0] + Math.cos(a) * l * 0.2 - spread * 6
      const cy = top[1] + Math.sin(a) * l * 0.5
      els.push(
        <path key={i} d={`M${f(top[0])} ${f(top[1] + 12)} Q ${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`} fill="none" stroke={mix(color, INK, 0.1 + rand() * 0.2)} strokeWidth={0.9} strokeOpacity={0.55} strokeLinecap="round" />,
      )
    }
    els.unshift(
      <path key="plume" d={`M${f(top[0])} ${f(top[1] + 14)} C ${f(top[0] - 34)} ${f(top[1] - 20)} ${f(top[0] - 14)} ${f(top[1] - len * 0.42)} ${f(top[0] + 4)} ${f(top[1] - len * 0.5)} C ${f(top[0] + 22)} ${f(top[1] - len * 0.4)} ${f(top[0] + 38)} ${f(top[1] - 18)} ${f(top[0])} ${f(top[1] + 14)}Z`} fill={color} fillOpacity={0.55} />,
    )
  }

  if (kind === 'gypsophila') {
    const branches = 7
    for (let i = 0; i < branches; i++) {
      const t = 0.35 + (i / branches) * 0.55
      const [x, y] = quad(t, p0, p1, p2)
      const side = i % 2 ? 1 : -1
      const bl = len * (0.28 - t * 0.1)
      const ex = x + side * bl * 0.8
      const ey = y - bl * 0.8
      els.push(<path key={`b${i}`} d={`M${f(x)} ${f(y)} Q ${f(x + side * bl * 0.2)} ${f(y - bl * 0.6)} ${f(ex)} ${f(ey)}`} fill="none" stroke={INK} strokeWidth={0.8} strokeOpacity={0.5} strokeLinecap="round" />)
      for (let k = 0; k < 4; k++) {
        const px = ex + (rand() - 0.5) * 12
        const py = ey + (rand() - 0.5) * 10
        els.push(<circle key={`d${i}-${k}`} cx={f(px)} cy={f(py)} r={f(2.2 + rand() * 1.8)} fill={mix(color, '#ffffff', 0.4)} {...strokeProps} strokeWidth={0.7} />)
      }
    }
    for (let k = 0; k < 5; k++) {
      els.push(<circle key={`t${k}`} cx={f(p2[0] + (rand() - 0.5) * 12)} cy={f(p2[1] + (rand() - 0.5) * 10)} r={f(2.4 + rand() * 1.6)} fill={mix(color, '#ffffff', 0.4)} {...strokeProps} strokeWidth={0.7} />)
    }
  }

  if (kind === 'blossom') {
    const spots = [0.35, 0.55, 0.75, 0.95]
    spots.forEach((t, i) => {
      const [x, y] = quad(t, p0, p1, p2)
      const side = i % 2 ? 1 : -1
      const tx = x + side * 26
      const ty = y - 14
      els.push(<path key={`tw${i}`} d={`M${f(x)} ${f(y)} Q ${f(x + side * 10)} ${f(y - 4)} ${f(tx)} ${f(ty)}`} fill="none" stroke={INK} strokeWidth={0.9} strokeOpacity={0.55} strokeLinecap="round" />)
      const bloomAt = i === 3 ? [x, y - 6] : [tx, ty]
      const s = 11 - i * 0.6
      els.push(
        <g key={`fl${i}`} transform={`translate(${f(bloomAt[0])} ${f(bloomAt[1])}) rotate(${f(rand() * 70)})`}>
          {[0, 1, 2, 3, 4].map((k) => (
            <ellipse key={k} cx={0} cy={f(-s * 0.7)} rx={f(s * 0.62)} ry={f(s * 0.78)} transform={`rotate(${k * 72})`} fill={mix(color, '#ffffff', 0.35)} {...strokeProps} strokeWidth={0.9} />
          ))}
          <Stamens r={s} n={7} spread={0.5} />
        </g>,
      )
    })
    els.push(<circle key="bud1" cx={f(quad(0.45, p0, p1, p2)[0] - 20)} cy={f(quad(0.45, p0, p1, p2)[1] - 20)} r={4} fill={mix(color, INK, 0.1)} {...strokeProps} />)
    els.push(<path key="tw-b" d={`M${f(quad(0.45, p0, p1, p2)[0])} ${f(quad(0.45, p0, p1, p2)[1])} L ${f(quad(0.45, p0, p1, p2)[0] - 20)} ${f(quad(0.45, p0, p1, p2)[1] - 17)}`} stroke={INK} strokeWidth={0.8} strokeOpacity={0.5} />)
  }

  return (
    <g transform={`translate(${f(item.ox ?? 0)} 0) rotate(${f(item.rot)})`}>
      {stem}
      {els}
    </g>
  )
}

const VASES: Record<VaseKind, { mouthY: number; path: string; lines: string[]; width: number }> = {
  bud: {
    mouthY: 372,
    width: 100,
    path: 'M184 372 L184 398 C150 412 138 450 160 470 Q164 474 170 474 L230 474 Q236 474 240 470 C262 450 250 412 216 398 L216 372 Z',
    lines: ['M170 438 C 168 452 172 462 178 466'],
  },
  cylinder: {
    mouthY: 386,
    width: 100,
    path: 'M152 386 L152 466 Q152 474 160 474 L240 474 Q248 474 248 466 L248 386 Z',
    lines: ['M166 400 L166 460', 'M152 386 Q200 394 248 386'],
  },
  round: {
    mouthY: 386,
    width: 150,
    path: 'M172 386 L172 398 C100 414 96 474 200 474 C304 474 300 414 228 398 L228 386 Z',
    lines: ['M128 440 C 134 456 150 464 168 467', 'M172 398 Q200 404 228 398'],
  },
  bowl: {
    mouthY: 410,
    width: 170,
    path: 'M110 410 L290 410 C290 456 260 474 200 474 C140 474 110 456 110 410 Z',
    lines: ['M110 410 Q200 420 290 410', 'M138 446 C 150 458 165 464 182 466'],
  },
}

export function ArtSvg({ art, seed, className, showFrame = true, title }: { art: Art; seed: string; className?: string; showFrame?: boolean; title?: string }) {
  const vase = art.vase ? VASES[art.vase.kind] : null
  const originY = vase ? vase.mouthY + 6 : art.wrap ? 392 : 474
  const originX = 200

  const stems = art.blooms.map((b, i) => {
    const ox = originX + (b.ox ?? 0)
    return { b, i, g: stemGeometry(b, ox, originY) }
  })

  const arch = (
    <>
      <rect x={50} y={34} width={300} height={440} rx={150} fill={art.bg} />
      {showFrame && (
        <>
          <path d="M50 184 A150 150 0 0 1 192 34" fill="none" stroke={INK} strokeOpacity={0.55} strokeWidth={0.9} />
          <path d="M208 34 A150 150 0 0 1 350 184 L350 324 A150 150 0 0 1 200 474 A150 150 0 0 1 50 324 L50 184" fill="none" stroke={INK} strokeOpacity={0.55} strokeWidth={0.9} />
          <circle cx={200} cy={30} r={3.2} fill={INK} fillOpacity={0.7} />
        </>
      )}
    </>
  )

  const clipId = `clip-${seed.replace(/[^a-z0-9]/gi, '')}`
  const scale = art.scale ?? (art.wrap ? 1.12 : 1)

  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      {title && <title>{title}</title>}
      <defs>
        <clipPath id={clipId}>
          <path d="M54 -20 H346 V324 A146 150 0 0 1 200 476 A146 150 0 0 1 54 324 Z" />
        </clipPath>
      </defs>
      {arch}
      <ellipse cx={200} cy={478} rx={vase ? vase.width * 0.75 : art.wrap ? 80 : 60} ry={5} fill={INK} fillOpacity={0.08} />
      <g clipPath={`url(#${clipId})`}>
      <g transform={`translate(200 474) scale(${scale}) translate(-200 -474)`}>

      {stems.map(({ b, i, g }) => (
        <g key={`s${i}`}>
          <path d={g.d} fill="none" stroke={INK} strokeWidth={1.2} strokeOpacity={0.62} strokeLinecap="round" />
          {b.kind !== 'hydrangea' && (
            <>
              <Leaf x={quad(0.42, g.p0, g.p1, g.p2)[0]} y={quad(0.42, g.p0, g.p1, g.p2)[1]} len={32 + (i % 3) * 5} rot={(i % 2 ? -1 : 1) * 40 - 90 + (b.x - originX) * 0.05} color={SAGE} />
              {i % 2 === 0 && <Leaf x={quad(0.6, g.p0, g.p1, g.p2)[0]} y={quad(0.6, g.p0, g.p1, g.p2)[1]} len={24} rot={55 - 90} color={mix(SAGE, '#ffffff', 0.15)} />}
            </>
          )}
        </g>
      ))}

      {(art.foliage ?? []).map((fo, i) => (
        <g key={`f${i}`} transform={`translate(${originX + (fo.ox ?? 0)} ${originY})`}>
          <Foliage item={fo} seed={`${seed}-f${i}`} />
        </g>
      ))}

      {[...art.blooms]
        .map((b, i) => ({ b, i }))
        .sort((a, b) => b.b.y - a.b.y || a.b.r - b.b.r)
        .map(({ b, i }) => (
          <g key={`b${i}`} transform={`translate(${b.x} ${b.y}) rotate(${b.rot ?? 0})`}>
            <Bloom item={b} seed={`${seed}-b${i}`} />
          </g>
        ))}

      {vase && art.vase && (
        <g>
          <path d={vase.path} fill={art.vase.color} stroke={INK} strokeOpacity={0.65} strokeWidth={1} strokeLinejoin="round" />
          {vase.lines.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={INK} strokeOpacity={i === 0 && art.vase?.kind !== 'cylinder' ? 0.22 : 0.25} strokeWidth={0.9} strokeLinecap="round" />
          ))}
        </g>
      )}

      {art.wrap && (
        <g>
          <path d="M96 346 Q200 376 304 346 L220 470 Q200 482 180 470 Z" fill={art.wrap.color} stroke={INK} strokeOpacity={0.65} strokeWidth={1} strokeLinejoin="round" />
          <path d="M96 346 Q150 370 200 424 Q250 370 304 346" fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={0.9} />
          <path d="M200 424 L200 474" stroke={INK} strokeOpacity={0.2} strokeWidth={0.9} />
          <g transform="translate(200 398)">
            <path d="M0 0 C -30 -18 -42 6 -26 14 C -14 18 -4 8 0 0 C 4 8 14 18 26 14 C 42 6 30 -18 0 0Z" fill={art.wrap.ribbon} fillOpacity={0.95} stroke={INK} strokeOpacity={0.6} strokeWidth={0.9} strokeLinejoin="round" />
            <circle r={4.5} fill={art.wrap.ribbon} stroke={INK} strokeOpacity={0.6} strokeWidth={0.9} />
            <path d="M-3 6 L-16 34 L-8 31 L-3 38 M3 6 L14 32 L8 30 L5 38" fill="none" stroke={INK} strokeOpacity={0.55} strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      )}
      </g>
      </g>
    </svg>
  )
}
