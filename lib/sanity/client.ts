import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cp66glrr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
  // Server-only — never imported in a 'use client' file
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published',
  stega: false,
})
