import type { SanityImageProjection } from './image'
import type { PortableTextBlockLike } from '@/lib/portable-text'

/* ── Site Settings ── */
export interface SanitySiteSettings {
  _id: 'siteSettings'
  siteName: string
  newsletterTitle?: string
  newsletterDescription?: string
  newsletterPlaceholder?: string
  newsletterDisclaimer?: string
  venueAddress?: string
  venueLat?: number
  venueLng?: number
}

/* ── Event ── */
export interface SanityEvent {
  _id: string
  title: string
  slug: string
  date: string // ISO datetime
  doorsOpen?: string
  supportText?: string
  lineup?: SanityArtist[]
  description?: PortableTextBlockLike[]
  image: SanityImageProjection
  ticketUrl?: string
  ticketPrice?: number
  ticketStatus: 'onSale' | 'lowTickets' | 'soldOut' | 'atDoor' | 'past'
  featured?: boolean
  badge?: string
}

/* ── Artist ── */
export interface SanityArtist {
  _id: string
  name: string
  slug: string
  role: 'resident' | 'guest'
  description?: PortableTextBlockLike[]
  tags?: string[]
  image: SanityImageProjection
  instagram?: string
  soundcloud?: string
}

/* ── FAQ ── */
export interface SanityFAQ {
  _id: string
  question: string
  answer?: PortableTextBlockLike[]
  order: number
}

/* ── Gallery ── */
export interface SanityGalleryImage {
  _id: string
  image: SanityImageProjection
  size: 'tall' | 'short'
  order: number
}

/* ── Venue Page (singleton) ── */
export interface SanityVenuePage {
  _id: 'venuePage'
  heroHeadline: string
  heroSubtitle?: string
  heroImage: SanityImageProjection
  historyLabel?: string
  historyBody?: PortableTextBlockLike[]
  stats?: { value: string; label: string }[]
  photoGrid?: SanityImageProjection[]
  mapFallbackImage?: SanityImageProjection
  ctaLabel?: string
}

/* ── Sound System Page (singleton) ── */
export interface SanitySoundSystemPage {
  _id: 'soundSystemPage'
  heroImage: SanityImageProjection
  heroEyebrow?: string
  heroHeadline: string
  heroQuote?: string
  heroDescription?: string
  historyLabel?: string
  historyBody?: PortableTextBlockLike[]
  historyImage?: SanityImageProjection
  specs?: { value: string; label: string }[]
  subwayQuote?: string
  subwayImage?: SanityImageProjection
  ctaLabel?: string
}
