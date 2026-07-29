/**
 * Update event dates in Sanity from the static data strings.
 * Run with: npx tsx --env-file=.env scripts/update-event-dates.ts
 */

import { createClient } from 'next-sanity'
import { upcomingEvents, eventsPageData, featuredEvent } from '../lib/data'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cp66glrr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

function parseDate(dateStr: string): string | null {
  // "Sat 01 Nov" → "2025-11-01", "Fri 24 Oct" → "2025-10-24"
  const months: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  }
  // Remove weekday prefix and separators (e.g., "FRI / 24 OCT" → "24 OCT")
  const cleaned = dateStr
    .replace(/^(mon|tue|wed|thu|fri|sat|sun)\s*\/?\s*/i, '')
    .trim()
  const parts = cleaned.split(' ')
  if (parts.length >= 2) {
    const day = parts[0].padStart(2, '0')
    const month = months[parts[1].toLowerCase().slice(0, 3)]
    if (month) {
      // Use 2025 for all dates
      return `2025-${month}-${day}T20:00:00Z`
    }
  }
  return null
}

function slugFromTitle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

async function main() {
  const allEvents = [featuredEvent, ...upcomingEvents, ...eventsPageData]
  const seenTitles = new Set<string>()

  for (const evt of allEvents) {
    if (seenTitles.has(evt.title)) continue
    seenTitles.add(evt.title)

    const date = parseDate(evt.date)
    if (!date) {
      console.log(`⚠ Skipped "${evt.title}" — couldn't parse "${evt.date}"`)
      continue
    }

    const slug = slugFromTitle(evt.title)
    await client
      .patch(`event-${slug}`)
      .set({ date })
      .commit()
      .then(() => console.log(`✓ ${evt.title} → ${date}`))
      .catch(() => console.log(`⚠ ${evt.title} — not found in Sanity, skipping`))
  }

  console.log('Done.')
}

main()
