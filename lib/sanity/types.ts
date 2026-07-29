import type { Image as SanityImage } from 'sanity'

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
  description?: unknown // block content
  image: SanityImage
  ticketUrl?: string
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
  description?: unknown // block content
  tags?: string[]
  image: SanityImage
  instagram?: string
  soundcloud?: string
}

/* ── FAQ ── */
export interface SanityFAQ {
  _id: string
  question: string
  answer: unknown // block content
  order: number
}

/* ── Gallery ── */
export interface SanityGalleryImage {
  _id: string
  image: SanityImage
  size: 'tall' | 'short'
  order: number
}

/* ── Venue Page (singleton) ── */
export interface SanityVenuePage {
  _id: 'venuePage'
  heroHeadline: string
  heroSubtitle?: string
  heroImage: SanityImage
  historyLabel?: string
  historyBody?: unknown // block content
  stats?: { value: string; label: string }[]
  photoGrid?: SanityImage[]
  mapFallbackImage?: SanityImage
  ctaLabel?: string
}

/* ── Sound System Page (singleton) ── */
export interface SanitySoundSystemPage {
  _id: 'soundSystemPage'
  heroImage: SanityImage
  heroEyebrow?: string
  heroHeadline: string
  heroQuote?: string
  heroDescription?: string
  historyLabel?: string
  historyBody?: unknown // block content
  historyImage?: SanityImage
  specs?: { value: string; label: string }[]
  subwayQuote?: string
  subwayImage?: SanityImage
  ctaLabel?: string
}
