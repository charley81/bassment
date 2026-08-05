#!/usr/bin/env node
/* BASSMENT — Upload generated flyers to Sanity and attach to events.
 * Usage: node scripts/upload-flyers.mjs
 * Reads flyers/<slug>.png, uploads each as an image asset, then patches
 * the matching event document's image field (doc id = `event-<slug>`).
 */
import fs from 'node:fs'
import path from 'node:path'

function getEnv(name) {
  const raw = fs.readFileSync(path.resolve('.env'), 'utf8')
  for (const line of raw.split('\n')) {
    if (line.startsWith(`${name}=`)) return line.slice(name.length + 1).trim()
  }
  return ''
}

const PROJECT = 'cp66glrr'
const DATASET = 'production'
const WRITE_TOKEN = getEnv('SANITY_API_WRITE_TOKEN')
const FLYERS_DIR = path.resolve('flyers')
const BASE = `https://${PROJECT}.api.sanity.io/v2025-01-01`

async function upload(file, filename) {
  const data = fs.readFileSync(file)
  const url = `${BASE}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WRITE_TOKEN}`, 'Content-Type': 'image/png' },
    body: data,
  })
  const json = await res.json()
  if (json.document?._id) return json.document._id
  throw new Error(`Upload failed for ${filename}: ${JSON.stringify(json)}`)
}

async function main() {
  if (!WRITE_TOKEN) throw new Error('SANITY_API_WRITE_TOKEN not configured')
  const files = fs.readdirSync(FLYERS_DIR).filter((f) => f.endsWith('.png'))
  if (!files.length) throw new Error('No PNGs in flyers/ — run generate-flyers.mjs first')

  const mutations = []
  for (const f of files) {
    const slug = f.replace(/\.png$/, '')
    const assetId = await upload(path.join(FLYERS_DIR, f), f)
    const docId = `event-${slug}`
    console.log(`  ✓ ${f} -> ${docId} (${assetId})`)
    mutations.push({
      patch: {
        id: docId,
        set: {
          image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } },
          altText: `BASSMENT event flyer`,
        },
      },
    })
  }

  const res = await fetch(`${BASE}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WRITE_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  })
  const json = await res.json()
  if (json.error) throw new Error(`Mutate failed: ${json.error.description || JSON.stringify(json.error)}`)
  console.log(`\nPatched ${json.results?.length ?? 0} events (transaction ${json.transactionId})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
