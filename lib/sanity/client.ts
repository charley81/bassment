import { createClient } from 'next-sanity'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cp66glrr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  // Server-only — never imported in a 'use client' file
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published' as const,
  stega: false,
}

/** Cached reads for page rendering (pairs with ISR) */
export const client = createClient({ ...config, useCdn: true })

/** Fresh reads for transactional paths (payments, emails) — never stale */
export const clientUncached = createClient({ ...config, useCdn: false })
