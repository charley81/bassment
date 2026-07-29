/**
 * Bulk upload images from /public/images to Sanity and link to documents.
 * Run with: npx tsx --env-file=.env scripts/upload-images.ts
 */

import { createClient } from 'next-sanity'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cp66glrr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

const IMAGES_DIR = join(process.cwd(), 'public/images')

/* ── Image → Document mapping ── */

interface Mapping {
  /** Document type to update */
  _type: string
  /** Document _id to patch */
  _id: string
  /** Field path to set (e.g. "image" or "heroImage") */
  field: string
}

function resolveMapping(filename: string): Mapping | null {
  const base = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '')

  // ── Event images ──
  const eventMap: Record<string, string> = {
    'event-dlr': 'event-dlr-b2b-break',
    'event-goldie': 'event-goldie---timeless-set',
    'event-calibre': 'event-calibre---deep-cuts',
    'event-sully': 'event-sully-b2b-tim-reaper',
    'event-alix-perez': 'event-alix-perez',
    'event-doc-scott': 'event-doc-scott',
    'event-om-unit': 'event-om-unit',
    'event-digital': 'event-digital--spirit-tribute',
    'event-storm': 'event-dj-storm--friends',
    'event-loxy': 'event-loxy-b2b-ink',
    'event-special-request': 'event-special-request',
    'event-dbridge': 'event-dbridge',
    'event-ivy-lab': 'event-ivy-lab',
    'event-commix': 'event-commix',
    'event-marcus-intalex': 'event-marcus-intalex',
    'event-dom-roland': 'event-dom--roland',
    'dillinja-valve-featured': 'event-dillinja--valve-sound-system-takeover',
    'dillinja-valve-detail': 'event-dillinja--valve-sound-system-takeover',
  }
  if (eventMap[base]) {
    return {
      _type: 'event',
      _id: eventMap[base],
      field: 'image',
    }
  }

  // Variations with -events suffix
  const eventsSuffix = base.replace('-events', '')
  if (eventMap[eventsSuffix]) {
    return {
      _type: 'event',
      _id: eventMap[eventsSuffix],
      field: 'image',
    }
  }

  // ── Gallery images ──
  const galleryMatch = base.match(/^gallery-(\d+)$/)
  if (galleryMatch) {
    const idx = parseInt(galleryMatch[1]) - 1
    return { _type: 'galleryImage', _id: `gallery-${idx}`, field: 'image' }
  }

  // ── Artist images ──
  if (base === 'dj-storm') {
    return { _type: 'artist', _id: 'artist-dj-storm', field: 'image' }
  }

  // ── Venue images ──
  if (base === 'venue-hero-7ee754') {
    return { _type: 'venuePage', _id: 'venuePage', field: 'heroImage' }
  }
  if (base === 'venue-space-ab4185') {
    return { _type: 'venuePage', _id: 'venuePage', field: 'heroImage' }
  }
  if (/^venue-photo-\d+$/.test(base)) {
    const idx = parseInt(base.replace('venue-photo-', '')) - 1
    if (idx >= 0 && idx < 6) return null // photo grid — handled separately
  }
  if (base === 'venue-map') {
    return { _type: 'venuePage', _id: 'venuePage', field: 'mapFallbackImage' }
  }

  // ── Sound system images ──
  if (base === 'sound-hero') {
    return { _type: 'soundSystemPage', _id: 'soundSystemPage', field: 'heroImage' }
  }
  if (base === 'sound-history') {
    return { _type: 'soundSystemPage', _id: 'soundSystemPage', field: 'historyImage' }
  }
  if (/^sound-subway/.test(base)) {
    return { _type: 'soundSystemPage', _id: 'soundSystemPage', field: 'subwayImage' }
  }

  // ── Detail images (event detail page) ──
  if (base.startsWith('detail-')) return null // handled elsewhere

  // ── Home hero, other page-level images ──
  if (base.startsWith('hero-')) return null

  return null
}

/* ── Main ── */

async function main() {
  const files = readdirSync(IMAGES_DIR).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
  console.log(`Found ${files.length} images.`)

  let uploaded = 0
  let skipped = 0

  for (const filename of files) {
    const mapping = resolveMapping(filename)
    if (!mapping) {
      console.log(`  ⊘ ${filename} — no mapping, skipped`)
      skipped++
      continue
    }

    try {
      // Upload image to Sanity
      const filePath = join(IMAGES_DIR, filename)
      const fileBuffer = readFileSync(filePath)

      const asset = await client.assets.upload('image', fileBuffer, {
        filename,
        contentType: `image/${filename.split('.').pop()}`,
      })

      console.log(`  ↑ ${filename} → ${asset._id}`)

      // Patch the document with the image reference + alt text
      const alt = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '').replace(/-/g, ' ')
      await client
        .patch(mapping._id)
        .set({
          [mapping.field]: {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
            alt,
          },
        })
        .commit()

      console.log(`  ✓ ${filename} → ${mapping._type}.${mapping._id}.${mapping.field}`)
      uploaded++
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(`  ✗ ${filename} — ${message}`)
      skipped++
    }
  }

  console.log(`\nDone. ${uploaded} uploaded, ${skipped} skipped.`)
}

main()
