const S = 'fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]'
const Svg = ({ className = '', children, solid }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`flex-none ${solid ? 'fill-current stroke-none' : S} ${className}`}>{children}</svg>
)
export const DownloadIcon = (p) => <Svg {...p}><path d="M12 3v13" /><path d="M6 12l6 6 6-6" /><path d="M5 21h14" /></Svg>
export const ArrowRightIcon = (p) => <Svg {...p}><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></Svg>
export const ArrowUpIcon = (p) => <Svg {...p}><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></Svg>
export const SearchIcon = (p) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></Svg>
export const CloseIcon = (p) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>
export const ClockIcon = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></Svg>
export const TagIcon = (p) => <Svg {...p}><path d="M20.6 12L12 3.4 4 5l-1.6 8L11 21.6a2 2 0 002.8 0l6.8-6.8a2 2 0 000-2.8z" /></Svg>
export const StarIcon = ({ filled, className = '' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`size-[13px] flex-none stroke-[1.6] [stroke-linejoin:round] ${filled ? 'fill-amber stroke-amber' : 'fill-none stroke-[#4a5661]'} ${className}`}>
    <polygon points="12,2 15,9 22,9.5 16.5,14 18,21.5 12,17.5 6,21.5 7.5,14 2,9.5 9,9" />
  </svg>
)
export const DiscordIcon = (p) => (
  <Svg solid {...p}><path d="M20.3 5.4A17.7 17.7 0 0015.6 4l-.3.5a13 13 0 013.9 1.6 15.3 15.3 0 00-13.9 0A13 13 0 018.4 4.5L8.1 4a17.6 17.6 0 00-4.7 1.4C1 9.9.3 14.3.6 18.6a17.7 17.7 0 005.4 2.7l.7-1.2a11.5 11.5 0 01-1.9-.9l.5-.4a12.7 12.7 0 0010.9 0l.5.4a11.6 11.6 0 01-1.9.9l.7 1.2a17.6 17.6 0 005.4-2.7c.4-5-.9-9.4-3.3-13.2zM8.9 15.8c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2zm6.2 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2z" /></Svg>
)
const YouTube = (p) => <Svg solid {...p}><path d="M22 12s0-3.2-.4-4.7a2.8 2.8 0 00-2-2C17.9 5 12 5 12 5s-5.9 0-7.6.3a2.8 2.8 0 00-2 2C2 8.8 2 12 2 12s0 3.2.4 4.7a2.8 2.8 0 002 2C6.1 19 12 19 12 19s5.9 0 7.6-.3a2.8 2.8 0 002-2C22 15.2 22 12 22 12zM10 15.3V8.7l6 3.3z" /></Svg>
const Instagram = (p) => <Svg {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></Svg>
const Facebook = (p) => <Svg solid {...p}><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.3V13h2.8v8z" /></Svg>
export const SOCIAL_ICONS = { Discord: DiscordIcon, YouTube, Instagram, Facebook }
