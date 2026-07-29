import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'cp66glrr',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
  // Server-only — never imported in a 'use client' file
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published',
  stega: false,
})
