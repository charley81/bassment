import { groq } from 'next-sanity'

/* ── Site Settings ── */
export const SITE_SETTINGS_QUERY = groq`
  *[_id == "siteSettings"][0] {
    siteName,
    newsletterTitle,
    newsletterDescription,
    newsletterPlaceholder,
    newsletterDisclaimer,
    venueAddress,
    venueLat,
    venueLng
  }
`

/* ── Events ── */
export const ALL_EVENTS_QUERY = groq`
  *[_type == "event"] | order(date asc) {
    _id,
    title,
    "slug": slug.current,
    date,
    doorsOpen,
    supportText,
    "lineup": lineup[]-> {
      _id,
      name,
      "slug": slug.current,
      role,
      tags,
      "image": image.asset->url
    },
    description,
    "image": image {
      asset-> { _id, url },
      alt
    },
    ticketUrl,
    ticketStatus,
    featured,
    badge
  }
`

export const FEATURED_EVENT_QUERY = groq`
  *[_type == "event" && featured == true][0] {
    _id,
    title,
    "slug": slug.current,
    date,
    doorsOpen,
    supportText,
    "lineup": lineup[]-> {
      _id,
      name,
      "slug": slug.current,
      role,
      tags,
      "image": image.asset->url
    },
    description,
    "image": image {
      asset-> { _id, url },
      alt
    },
    ticketUrl,
    ticketStatus,
    featured,
    badge
  }
`

export const NEXT_EVENT_QUERY = groq`
  *[_type == "event" && date >= now()] | order(date asc)[0] {
    _id,
    title,
    "slug": slug.current,
    date,
    doorsOpen,
    supportText,
    "lineup": lineup[]-> {
      _id,
      name,
      "slug": slug.current,
      role,
      tags,
      "image": image.asset->url
    },
    description,
    "image": image {
      asset-> { _id, url },
      alt
    },
    ticketUrl,
    ticketStatus,
    featured,
    badge
  }
`

export const UPCOMING_EVENTS_QUERY = groq`
  *[_type == "event" && date >= now()] | order(date asc) {
    _id,
    title,
    "slug": slug.current,
    date,
    doorsOpen,
    supportText,
    "image": image {
      asset-> { _id, url },
      alt
    },
    ticketUrl,
    ticketStatus,
    badge
  }
`

export const PAST_EVENTS_QUERY = groq`
  *[_type == "event" && date < now()] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    date,
    doorsOpen,
    supportText,
    "image": image {
      asset-> { _id, url },
      alt
    },
    ticketUrl,
    ticketStatus,
    badge
  }
`

export const EVENT_BY_SLUG_QUERY = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    date,
    doorsOpen,
    supportText,
    "lineup": lineup[]-> {
      _id,
      name,
      "slug": slug.current,
      role,
      tags,
      "image": image.asset->url
    },
    description,
    "image": image {
      asset-> { _id, url },
      alt
    },
    ticketUrl,
    ticketStatus,
    featured,
    badge
  }
`

/* ── Artists ── */
export const RESIDENT_DJS_QUERY = groq`
  *[_type == "artist" && role == "resident"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    role,
    description,
    tags,
    "image": image {
      asset-> { _id, url },
      alt
    },
    instagram,
    soundcloud
  }
`

/* ── FAQ ── */
export const FAQS_QUERY = groq`
  *[_type == "faq"] | order(order asc) {
    _id,
    question,
    answer,
    order
  }
`

/* ── Gallery ── */
export const GALLERY_QUERY = groq`
  *[_type == "galleryImage"] | order(order asc) {
    _id,
    "image": image {
      asset-> { _id, url },
      alt
    },
    size,
    order
  }
`

/* ── Venue Page ── */
export const VENUE_PAGE_QUERY = groq`
  *[_id == "venuePage"][0] {
    heroHeadline,
    heroSubtitle,
    "heroImage": heroImage {
      asset-> { _id, url },
      alt
    },
    historyLabel,
    historyBody,
    stats[] { value, label },
    "photoGrid": photoGrid[] {
      asset-> { _id, url }
    },
    "mapFallbackImage": mapFallbackImage {
      asset-> { _id, url }
    },
    ctaLabel
  }
`

/* ── Sound System Page ── */
export const SOUND_SYSTEM_PAGE_QUERY = groq`
  *[_id == "soundSystemPage"][0] {
    "heroImage": heroImage {
      asset-> { _id, url },
      alt
    },
    heroEyebrow,
    heroHeadline,
    heroQuote,
    heroDescription,
    historyLabel,
    historyBody,
    "historyImage": historyImage {
      asset-> { _id, url },
      alt
    },
    specs[] { value, label },
    subwayQuote,
    "subwayImage": subwayImage {
      asset-> { _id, url },
      alt
    },
    ctaLabel
  }
`
