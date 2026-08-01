#!/usr/bin/env node
/**
 * End-to-end checkout integration test (API level).
 *
 * Exercises the full purchase loop against a locally running server:
 *   1. discover a purchasable event from /events
 *   2. POST /api/payment            → create PaymentIntent
 *   3. POST /api/payment/email      → attach delivery email (metadata)
 *   4. confirm with pm_card_visa    → payment succeeds (Stripe test mode)
 *   5. signed webhook POST          → /api/stripe-webhook returns 200
 *   6. replay the same event        → still 200, no crash (dup-safe)
 *
 * Usage:
 *   pnpm test:integration                      # expects server on :3000
 *   BASE_URL=http://localhost:3100 pnpm test:integration
 *
 * Requires in .env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, and
 * TEST_TICKET_EMAIL (must be the Resend account owner's address while the
 * sender is the onboarding address — other recipients get rejected there).
 */

import { loadEnvFile } from 'node:process'
import Stripe from 'stripe'

loadEnvFile('.env')

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const required = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'TEST_TICKET_EMAIL']
const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  console.error(`✗ Missing env vars: ${missing.join(', ')}\n  See the header comment in scripts/test-checkout-flow.mjs`)
  process.exit(1)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
let failures = 0

function step(name, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures++
}

async function main() {
  console.log(`\nCheckout integration test → ${BASE_URL}\n`)

  // 1. Find a purchasable event
  const eventsHtml = await fetch(`${BASE_URL}/events`).then((r) => r.text())
  const slug = [...eventsHtml.matchAll(/\/events\/([a-z0-9-]+)/g)]
    .map((m) => m[1])
    .filter((s) => !s.includes('buy') && !s.includes('confirmation'))[0]
  step('discover event slug', Boolean(slug), slug)
  if (!slug) process.exit(1)

  // 2. Create PaymentIntent
  const paymentRes = await fetch(`${BASE_URL}/api/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventSlug: slug }),
  })
  const { clientSecret, error: paymentError } = await paymentRes.json()
  step('POST /api/payment', paymentRes.ok && Boolean(clientSecret), paymentError || 'client secret issued')
  if (!clientSecret) process.exit(1)

  // 3. Attach delivery email
  const emailRes = await fetch(`${BASE_URL}/api/payment/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientSecret, email: process.env.TEST_TICKET_EMAIL }),
  })
  step('POST /api/payment/email', emailRes.ok, emailRes.ok ? process.env.TEST_TICKET_EMAIL : await emailRes.text())

  // 3b. Validation rejects bad input
  const badRes = await fetch(`${BASE_URL}/api/payment/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientSecret, email: 'not-an-email' }),
  })
  step('POST /api/payment/email rejects invalid email', badRes.status === 400, `status ${badRes.status}`)

  // 4. Confirm payment (test card)
  const intentId = clientSecret.split('_secret_')[0]
  const confirmed = await stripe.paymentIntents.confirm(intentId, {
    payment_method: 'pm_card_visa',
    return_url: `${BASE_URL}/events/${slug}/confirmation`,
  })
  step('payment confirmation (pm_card_visa)', confirmed.status === 'succeeded', confirmed.status)
  const emailOnIntent = confirmed.metadata?.customerEmail
  step('metadata.customerEmail on intent', emailOnIntent === process.env.TEST_TICKET_EMAIL, emailOnIntent)

  // 5. Signed webhook delivery
  const eventId = `evt_integration_${Date.now()}`
  const payload = JSON.stringify({
    id: eventId,
    object: 'event',
    type: 'payment_intent.succeeded',
    data: { object: confirmed },
  })
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: process.env.STRIPE_WEBHOOK_SECRET,
  })
  const webhookRes = await fetch(`${BASE_URL}/api/stripe-webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'stripe-signature': signature },
    body: payload,
  })
  step('POST /api/stripe-webhook', webhookRes.ok, `status ${webhookRes.status} (check server log for "Receipt sent")`)

  // 6. Replay — duplicate delivery must not crash
  const replayRes = await fetch(`${BASE_URL}/api/stripe-webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'stripe-signature': signature },
    body: payload,
  })
  step('webhook replay tolerated', replayRes.ok, `status ${replayRes.status}`)

  // 7. Bad signature rejected
  const badSigRes = await fetch(`${BASE_URL}/api/stripe-webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'stripe-signature': 't=1,v1=bad' },
    body: payload,
  })
  step('webhook rejects bad signature', badSigRes.status === 400, `status ${badSigRes.status}`)

  console.log(failures ? `\n✗ ${failures} step(s) failed\n` : '\n✓ All steps passed\n')
  process.exit(failures ? 1 : 0)
}

main().catch((err) => {
  console.error('\n✗ Integration test crashed:', err.message)
  console.error('  Is the server running? (pnpm dev, or pnpm build && pnpm start)')
  process.exit(1)
})
