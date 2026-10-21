export function BloomLine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M52 124 C 50 104 53 88 62 70" />
      <path d="M51 105 C 40 100 28 92 14 80 C 26 80 42 88 51 105Z" />
      <path d="M50 114 C 40 112 28 112 20 114 C 30 106 44 106 50 114Z" />
      <path d="M66 62 C 54 66 40 60 36 46 C 34 36 44 28 54 30 C 62 24 78 24 84 34 C 92 36 94 46 88 54 C 84 60 74 62 66 62Z" />
      <path d="M44 40 C 46 48 52 54 58 58" opacity=".6" />
      <path d="M60 32 C 64 40 70 46 78 50" opacity=".6" />
      <path d="M62 66 C 70 74 76 86 84 92 C 80 98 66 96 62 88 C 58 82 60 74 62 66Z" />
      <path d="M62 56 L58 40 M64 56 L66 38 M66 57 L72 42 M60 57 L52 44 M68 58 L80 48 M64 58 L74 56" strokeWidth="0.9" />
      <circle cx="58" cy="39" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="66" cy="37" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="72.5" cy="41.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="51.5" cy="43.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="80.5" cy="47.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="6 14 108 192" className={className} fill="none" stroke="currentColor" aria-hidden>
      <path d="M54 26.6 A48 48 0 0 0 12 74 V150 A48 48 0 0 0 108 150 V74 A48 48 0 0 0 66 26.6" strokeWidth="1.1" />
      <circle cx="60" cy="22" r="3" fill="currentColor" stroke="none" />
      <text x="60" y="74" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="44" fontWeight="500" fill="currentColor" stroke="none">
        F
      </text>
      <g transform="translate(8 72) scale(0.98)">
        <BloomPaths />
      </g>
    </svg>
  )
}

function BloomPaths() {
  return (
    <g strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M52 124 C 50 104 53 88 62 70" />
      <path d="M51 105 C 40 100 28 92 14 80 C 26 80 42 88 51 105Z" />
      <path d="M50 114 C 40 112 28 112 20 114 C 30 106 44 106 50 114Z" />
      <path d="M66 62 C 54 66 40 60 36 46 C 34 36 44 28 54 30 C 62 24 78 24 84 34 C 92 36 94 46 88 54 C 84 60 74 62 66 62Z" />
      <path d="M44 40 C 46 48 52 54 58 58" opacity=".6" />
      <path d="M60 32 C 64 40 70 46 78 50" opacity=".6" />
      <path d="M62 66 C 70 74 76 86 84 92 C 80 98 66 96 62 88 C 58 82 60 74 62 66Z" />
      <path d="M62 56 L58 40 M64 56 L66 38 M66 57 L72 42 M60 57 L52 44 M68 58 L80 48 M64 58 L74 56" strokeWidth="0.9" />
    </g>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return <span className={`wordmark ${className ?? ''}`}>Fleurétern</span>
}
