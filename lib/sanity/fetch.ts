import { client } from './client'
import { cache } from 'react'
import {
  ALL_EVENTS_QUERY,
  FEATURED_EVENT_QUERY,
  UPCOMING_EVENTS_QUERY,
  PAST_EVENTS_QUERY,
  EVENT_BY_SLUG_QUERY,
  RESIDENT_DJS_QUERY,
  FAQS_QUERY,
  GALLERY_QUERY,
  VENUE_PAGE_QUERY,
  SOUND_SYSTEM_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
} from './queries'
import type {
  SanityEvent,
  SanityArtist,
  SanityFAQ,
  SanityGalleryImage,
  SanityVenuePage,
  SanitySoundSystemPage,
  SanitySiteSettings,
} from './types'

/* ── Generic fetch wrapper ── */

async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params as Record<string, string | number | boolean>)
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return null
  }
}

/* ── Cached data accessors ── */

export const getSiteSettings = cache(() =>
  sanityFetch<SanitySiteSettings>(SITE_SETTINGS_QUERY)
)

export const getAllEvents = cache(() =>
  sanityFetch<SanityEvent[]>(ALL_EVENTS_QUERY)
)

export const getFeaturedEvent = cache(() =>
  sanityFetch<SanityEvent>(FEATURED_EVENT_QUERY)
)

export const getUpcomingEvents = cache(() =>
  sanityFetch<SanityEvent[]>(UPCOMING_EVENTS_QUERY)
)

export const getPastEvents = cache(() =>
  sanityFetch<SanityEvent[]>(PAST_EVENTS_QUERY)
)

export const getEventBySlug = cache((slug: string) =>
  sanityFetch<SanityEvent>(EVENT_BY_SLUG_QUERY, { slug })
)

export const getResidentDjs = cache(() =>
  sanityFetch<SanityArtist[]>(RESIDENT_DJS_QUERY)
)

export const getFaqs = cache(() =>
  sanityFetch<SanityFAQ[]>(FAQS_QUERY)
)

export const getGallery = cache(() =>
  sanityFetch<SanityGalleryImage[]>(GALLERY_QUERY)
)

export const getVenuePage = cache(() =>
  sanityFetch<SanityVenuePage>(VENUE_PAGE_QUERY)
)

export const getSoundSystemPage = cache(() =>
  sanityFetch<SanitySoundSystemPage>(SOUND_SYSTEM_PAGE_QUERY)
)
