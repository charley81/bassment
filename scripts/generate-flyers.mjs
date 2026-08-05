#!/usr/bin/env node
/* BASSMENT — SVG Event Flyer Generator
 * Fetches events from Sanity, renders an on-brand SVG flyer per event,
 * and rasterizes each to a 1200x1600 PNG via sharp.
 *
 * Usage: node scripts/generate-flyers.mjs
 * Output: flyers/<slug>.svg + flyers/<slug>.png
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

/* ── env ── */
function getEnv(name) {
  const raw = fs.readFileSync(path.resolve('.env'), 'utf8')
  for (const line of raw.split('\n')) {
    if (line.startsWith(`${name}=`)) return line.slice(name.length + 1).trim()
  }
  return ''
}

const PROJECT = 'cp66glrr'
const DATASET = 'production'
const TOKEN = getEnv('SANITY_API_READ_TOKEN')
const OUT_DIR = path.resolve('flyers')

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

async function query(groq) {
  const url = `https://${PROJECT}.api.sanity.io/v2025-01-01/data/query/${DATASET}?query=${encodeURIComponent(groq)}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
  const json = await res.json()
  if (json.error) throw new Error(json.error.description || 'Sanity query failed')
  return json.result
}

/* ── helpers ── */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function fmtDate(iso) {
  const d = new Date(iso)
  return `${DAYS[d.getUTCDay()]} ${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function fmtTime(iso) {
  const d = new Date(iso)
  const h = d.getUTCHours()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hr = h % 12 === 0 ? 12 : h % 12
  return `${String(hr).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} ${ampm}`
}

/* deterministic pseudo-random meter heights from a string seed */
function meterHeights(seed, n = 40) {
  let h = 2166136261
  for (const c of seed) {
    h ^= c.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  const heights = []
  const pool = [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170]
  for (let i = 0; i < n; i++) {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5
    heights.push(pool[h >>> 28 % pool.length] || 80)
  }
  return heights
}

function splitTitle(title) {
  const parts = title.split(/\s*[—-]\s*/)
  return {
    head: (parts[0] || title).trim().toUpperCase(),
    theme: parts.length > 1 ? parts.slice(1).join(' ').trim().toUpperCase() : '',
  }
}

function fmtSupport(support) {
  if (!support) return ''
  return support
    .replace(/\bwith\b/i, '')
    .replace(/\band\b/gi, '·')
    .replace(/,\s*/g, ' · ')
    .replace(/\s*·\s*/g, ' · ')
    .replace(/^\s*·\s*/, '')
    .trim()
    .toUpperCase()
}

/* ── flyer template (approved design, parameterized) ── */
function renderFlyer({ title, supportText, date, doorsOpen, slug, featured }, settings) {
  const { head, theme: splitTheme } = splitTitle(title)
  const theme = splitTheme || (supportText || 'BASSMENT SOUND SYSTEM').toUpperCase()
  const withLine = splitTheme ? fmtSupport(supportText) : ''
  const venue = (settings?.venueAddress || '70 Pine Street, New York, NY 10005')
    .split(',')[0].toUpperCase()
  const doors = doorsOpen ? fmtTime(doorsOpen) : '10:00 PM'
  const barcode = date ? `BSMT-${date.slice(0, 10).replace(/-/g, '').slice(2)}` : 'BSMT-0000'
  const meters = meterHeights(slug + title)

  const titleSize = Math.min(216, Math.max(64, Math.floor(1040 / (0.6 * head.length))))
  const themeSize = Math.min(44, Math.max(24, Math.floor(1040 / (0.6 * theme.length))))
  const withY = withLine ? 1460 : 1510

  const meterBars = meters.map((height, i) =>
    `<rect x="${i * 26}" y="${100 + (170 - height)}" width="8" height="${height}"/>`
  ).join('\n      ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
  <defs>
    <style>
      text { font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1200" height="1600" fill="#090102"/>

  <!-- Graticule: subtle vertical hairlines -->
  <g stroke="#1F1415" stroke-width="1">
    ${Array.from({ length: 9 }, (_, i) => `<line x1="${(i + 1) * 120}" y1="0" x2="${(i + 1) * 120}" y2="1600"/>`).join('\n    ')}
  </g>

  <!-- Header -->
  <text x="80" y="110" font-size="34" font-weight="800" letter-spacing="14" fill="#EDEDED">BASSMENT</text>
  <text x="80" y="160" font-size="18" letter-spacing="6" fill="#D31F28">MANHATTAN — UNDERGROUND SOUND SYSTEM</text>
  <text x="1120" y="110" text-anchor="end" font-size="18" letter-spacing="4" fill="#7A6B6C">EST. 2025</text>
  <text x="1120" y="160" text-anchor="end" font-size="18" letter-spacing="4" fill="#7A6B6C">40.7075°N 74.0087°W</text>
  <rect x="80" y="200" width="1040" height="6" fill="#D31F28"/>

  <!-- Eyebrow -->
  <text x="80" y="300" font-size="20" letter-spacing="10" fill="#EDEDED">${featured ? 'BASSMENT PRESENTS — FEATURED' : 'BASSMENT PRESENTS'}</text>

  <!-- Mega title -->
  <text x="76" y="520" font-size="${titleSize}" font-weight="800" letter-spacing="-2" fill="#EDEDED">${esc(head)}</text>

  <!-- Theme -->
  <text x="80" y="612" font-size="${themeSize}" font-weight="700" letter-spacing="8" fill="#D31F28">${esc(theme)}</text>

  <!-- Waveform / valve meter motif -->
  <g transform="translate(80,760)">
    <polyline points="0,60 20,40 40,70 60,20 80,80 100,10 120,65 140,35 160,75 180,25 200,55 220,45 240,70 260,30 280,60 300,15 320,80 340,40 360,20 380,70 400,45 420,65 440,10 460,75 480,35 500,55 520,25 540,60 560,40 580,80 600,20 620,70 640,30 660,65 680,45 700,15 720,75 740,40 760,60 780,25 800,55 820,35 840,70 860,20 880,80 900,40 920,65 940,30 960,60 980,45 1000,75 1020,25 1040,50"
          fill="none" stroke="#D31F28" stroke-width="4"/>
    <g fill="#D31F28">
      ${meterBars}
    </g>
    <text x="0" y="320" font-size="16" letter-spacing="4" fill="#7A6B6C">96,000 WATTS — HAND-BUILT ANALOG POWER</text>
  </g>

  <!-- Divider -->
  <rect x="80" y="1160" width="1040" height="2" fill="#1F1415"/>

  <!-- Info grid -->
  <g font-size="20" fill="#EDEDED">
    <text x="80" y="1240" font-size="18" letter-spacing="6" fill="#7A6B6C">DATE</text>
    <text x="80" y="1290" font-weight="700" letter-spacing="2">${esc(date ? fmtDate(date) : 'TBA')}</text>

    <text x="380" y="1240" font-size="18" letter-spacing="6" fill="#7A6B6C">DOORS</text>
    <text x="380" y="1290" font-weight="700" letter-spacing="2">${esc(doors)} — 21+</text>

    <text x="680" y="1240" font-size="18" letter-spacing="6" fill="#7A6B6C">VENUE</text>
    <text x="680" y="1290" font-weight="700" letter-spacing="2">${esc(venue)}, NYC</text>
  </g>

  <rect x="80" y="1330" width="1040" height="2" fill="#1F1415"/>

  ${withLine ? `
  <!-- Lineup -->
  <text x="80" y="1410" font-size="18" letter-spacing="6" fill="#7A6B6C">WITH</text>
  <text x="80" y="${withY}" font-size="26" font-weight="700" letter-spacing="4" fill="#D31F28">${esc(withLine)}</text>
` : ''}

  <!-- Footer: barcode + pass -->
  <g transform="translate(80,1510)" fill="#EDEDED">
    ${Array.from({ length: 25 }, (_, i) => `<rect x="${i * 7 + (i % 3 === 1 ? 1 : 0)}" y="0" width="${i % 3 === 0 ? 4 : 2}" height="46"/>`).join('\n    ')}
  </g>
  <text x="1120" y="1538" text-anchor="end" font-size="16" letter-spacing="3" fill="#7A6B6C">${esc(barcode)} · GATE PASS</text>
</svg>
`
}

/* ── main ── */
async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const [events, settings] = await Promise.all([
    query(`*[_type == "event"] | order(date asc) { title, supportText, date, doorsOpen, "slug": slug.current, featured }`),
    query(`*[_id == "siteSettings"][0] { venueAddress }`),
  ])

  console.log(`Rendering ${events.length} flyers…`)
  for (const ev of events) {
    if (!ev.slug) continue
    const svg = renderFlyer(ev, settings)
    fs.writeFileSync(path.join(OUT_DIR, `${ev.slug}.svg`), svg)
    await sharp(Buffer.from(svg)).png().toFile(path.join(OUT_DIR, `${ev.slug}.png`))
    console.log(`  ✓ ${ev.slug} — ${ev.title}`)
  }
  console.log(`\nDone → ${OUT_DIR}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
