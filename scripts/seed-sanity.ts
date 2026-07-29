/**
 * Sanity Seed Script
 *
 * Pushes static data from lib/data.ts to the Sanity project.
 * Run with: npx tsx scripts/seed-sanity.ts
 *
 * Note: Images are set as placeholder references since local files
 * need manual upload to Sanity via the Studio after seeding.
 */

import { createClient } from '@sanity/client'
import {
  residentDjs,
  faqItems,
  galleryImages,
  venueHistoryData,
  venueHeroData,
  venuePhotos,
  venueStats,
  venuePlanData,
  soundHeroData,
  soundHistoryData,
  soundSpecs,
  soundSubwayData,
  soundCtaData,
  newsletterData,
  upcomingEvents,
  eventsPageData,
  featuredEvent,
} from '../lib/data'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cp66glrr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_READ_TOKEN, // Must be a write token
  useCdn: false,
})

const transaction = client.transaction()

/* ── Helper: create a document ── */
function createDoc<T extends Record<string, unknown>>(
  _type: string,
  _id: string,
  fields: T
) {
  transaction.create({ _id, _type, ...fields })
}

/* ── Helper: create or replace a document ── */
function createOrReplaceDoc<T extends Record<string, unknown>>(
  _type: string,
  _id: string,
  fields: T
) {
  transaction.createOrReplace({ _id, _type, ...fields })
}

console.log('Seeding Sanity...')

/* ══════════════════════════════════════════════════════════
   SITE SETTINGS
   ══════════════════════════════════════════════════════════ */
createOrReplaceDoc('siteSettings', 'siteSettings', {
  siteName: 'BASSMENT',
  newsletterTitle: newsletterData.title,
  newsletterDescription: newsletterData.description,
  newsletterPlaceholder: newsletterData.placeholder,
  newsletterDisclaimer: newsletterData.disclaimer,
  venueAddress: '70 Pine Street, New York, NY 10005',
  venueLat: 40.7071,
  venueLng: -74.0081,
})

/* ══════════════════════════════════════════════════════════
   ARTISTS (Resident DJs)
   ══════════════════════════════════════════════════════════ */
for (const dj of residentDjs) {
  const slug = dj.name.toLowerCase().replace(/\s+/g, '-')
  createOrReplaceDoc('artist', `artist-${slug}`, {
    name: dj.name,
    slug: { _type: 'slug', current: slug },
    role: 'resident',
    description: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: dj.description }],
      },
    ],
    tags: dj.tags,
  })
}

/* ══════════════════════════════════════════════════════════
   FAQS
   ══════════════════════════════════════════════════════════ */
faqItems.forEach((faq, i) => {
  createOrReplaceDoc('faq', `faq-${i}`, {
    question: faq.question,
    answer: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: faq.answer }],
      },
    ],
    order: i,
  })
})

/* ══════════════════════════════════════════════════════════
   GALLERY IMAGES
   ══════════════════════════════════════════════════════════ */
galleryImages.forEach((img, i) => {
  createOrReplaceDoc('galleryImage', `gallery-${i}`, {
    size: img.size || 'short',
    order: i,
  })
})

/* ══════════════════════════════════════════════════════════
   EVENTS
   ══════════════════════════════════════════════════════════ */

// Featured event
const feSlug = featuredEvent.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
createOrReplaceDoc('event', `event-${feSlug}`, {
  title: featuredEvent.title,
  slug: { _type: 'slug', current: feSlug },
  supportText: featuredEvent.support,
  description: [
    {
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: featuredEvent.description }],
    },
  ],
  ticketStatus: 'onSale',
  featured: true,
  badge: featuredEvent.badge,
})

// All events (merge upcoming + eventsPage, deduplicate by title)
const seenTitles = new Set<string>([featuredEvent.title])
for (const eventList of [upcomingEvents, eventsPageData]) {
  for (const evt of eventList) {
    if (seenTitles.has(evt.title)) continue
    seenTitles.add(evt.title)

    const slug = evt.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    createOrReplaceDoc('event', `event-${slug}`, {
      title: evt.title,
      slug: { _type: 'slug', current: slug },
      supportText: evt.support,
      ticketStatus: 'onSale',
      featured: false,
    })
  }
}

/* ══════════════════════════════════════════════════════════
   VENUE PAGE
   ══════════════════════════════════════════════════════════ */
createOrReplaceDoc('venuePage', 'venuePage', {
  heroHeadline: venueHeroData.headline,
  heroSubtitle: venueHeroData.subtitle,
  historyLabel: venueHistoryData.label,
  historyBody: venueHistoryData.paragraphs.map((text) => ({
    _type: 'block',
    style: 'normal',
    children: [{ _type: 'span', text }],
  })),
  stats: venueStats.map((s) => ({ value: s.value, label: s.label })),
  ctaLabel: venuePlanData.cta,
})

/* ══════════════════════════════════════════════════════════
   SOUND SYSTEM PAGE
   ══════════════════════════════════════════════════════════ */
createOrReplaceDoc('soundSystemPage', 'soundSystemPage', {
  heroEyebrow: soundHeroData.eyebrow,
  heroHeadline: soundHeroData.headline,
  heroQuote: soundHeroData.quote,
  historyLabel: soundHistoryData.label,
  historyBody: soundHistoryData.paragraphs.map((text) => ({
    _type: 'block',
    style: 'normal',
    children: [{ _type: 'span', text }],
  })),
  specs: soundSpecs.map((s) => ({ value: s.value, label: s.label })),
  subwayQuote: soundSubwayData.quote,
  ctaLabel: soundCtaData.label,
})

/* ══════════════════════════════════════════════════════════
   COMMIT
   ══════════════════════════════════════════════════════════ */

transaction
  .commit()
  .then(() => {
    console.log('✓ Seeded successfully.')
  })
  .catch((err) => {
    console.error('Seed failed:', err.message)
    process.exit(1)
  })
