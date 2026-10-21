import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const base = (p: P): P => ({
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  ...p,
})

export const BagIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5.5 8.5h13l-1 11.5h-11z" />
    <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
  </svg>
)
export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" />
  </svg>
)
export const SearchIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
)
export const MenuIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
)
export const CloseIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
)
export const PlusIcon = (p: P) => (
  <svg {...base(p)} width={16} height={16}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const MinusIcon = (p: P) => (
  <svg {...base(p)} width={16} height={16}>
    <path d="M5 12h14" />
  </svg>
)
export const ArrowRight = (p: P) => (
  <svg {...base(p)} width={18} height={18}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
)
export const ArrowLeft = (p: P) => (
  <svg {...base(p)} width={18} height={18}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </svg>
)
export const CheckIcon = (p: P) => (
  <svg {...base(p)} strokeWidth={1.8}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)
export const ChevronDown = (p: P) => (
  <svg {...base(p)} width={18} height={18}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)
export const StarIcon = (p: P) => (
  <svg {...base(p)} width={14} height={14} fill="currentColor" strokeWidth={0}>
    <path d="m12 3 2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.2 6.4 20.3l1.2-6.3L3 9.6l6.3-.8z" />
  </svg>
)
export const LockIcon = (p: P) => (
  <svg {...base(p)} width={16} height={16}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </svg>
)
export const TruckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 6.5h11v9H3zM14 10h4l3 3v2.5h-7z" />
    <circle cx="7.5" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
)
export const SunIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
  </svg>
)
export const LeafIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z" />
    <path d="M5 19c3-5 6-8 10-10" />
  </svg>
)
export const GiftIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="9" width="16" height="11" rx="1.5" />
    <path d="M3 9h18v3H3zM12 9v11M12 9c-2.5 0-4.5-1-4.5-2.7S10 4 12 9zM12 9c2.5 0 4.5-1 4.5-2.7S14 4 12 9z" />
  </svg>
)
export const RefreshIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v4.5h-4.5" />
  </svg>
)
export const TrashIcon = (p: P) => (
  <svg {...base(p)} width={18} height={18}>
    <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />
  </svg>
)
export const InstagramIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.7" cy="7.3" r=".6" fill="currentColor" />
  </svg>
)
export const PinterestIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M10.8 16.5 12.3 9.8M9.3 12.2c-.4-2.2 1.2-3.5 3-3.2 2 .3 2.4 2.7 1.3 4.2-1 1.3-2.5 1.2-3 .4" />
  </svg>
)
export const MailIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
)

export function PaymentLogo({ id }: { id: string }) {
  const common = { width: 40, height: 26, viewBox: '0 0 40 26', 'aria-hidden': true } as const
  switch (id) {
    case 'card':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.3">
          <rect x="3" y="4" width="34" height="18" rx="3" />
          <path d="M3 10h34M8 17h8" />
        </svg>
      )
    case 'paypal':
      return (
        <svg {...common}>
          <rect x="1" y="1" width="38" height="24" rx="4" fill="#f4efe6" stroke="#3a352e" strokeOpacity=".25" />
          <text x="20" y="17" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontStyle="italic" fontSize="11" fill="#1c3f86">
            Pay<tspan fill="#2b8fd6">Pal</tspan>
          </text>
        </svg>
      )
    case 'applepay':
      return (
        <svg {...common}>
          <rect x="1" y="1" width="38" height="24" rx="4" fill="#1d1b19" />
          <text x="20" y="17" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="10" fill="#fff">
            Pay
          </text>
          <path d="M9.5 8.2c.5-.6.8-1.2.7-1.9-.7 0-1.4.4-1.8 1-.4.5-.7 1.2-.6 1.8.7.1 1.3-.3 1.7-.9z" fill="#fff" transform="translate(-.5 .5)" />
        </svg>
      )
    case 'googlepay':
      return (
        <svg {...common}>
          <rect x="1" y="1" width="38" height="24" rx="4" fill="#fff" stroke="#3a352e" strokeOpacity=".25" />
          <text x="20" y="17" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="10">
            <tspan fill="#4285f4">G</tspan>
            <tspan fill="#5f6368"> Pay</tspan>
          </text>
        </svg>
      )
    case 'klarna':
      return (
        <svg {...common}>
          <rect x="1" y="1" width="38" height="24" rx="4" fill="#efc9cf" />
          <text x="20" y="16.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill="#1d1b19">
            3 × pay
          </text>
        </svg>
      )
    case 'bank':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
          <path d="M5 11 20 4l15 7zM8 12v8M15 12v8M25 12v8M32 12v8M5 22h30" />
        </svg>
      )
    case 'cod':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.3">
          <rect x="4" y="6" width="32" height="14" rx="2" />
          <circle cx="20" cy="13" r="3.2" />
          <path d="M8 10v.01M32 16v.01" strokeWidth="2" />
        </svg>
      )
    default:
      return null
  }
}
