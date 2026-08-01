import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { sendTicketEmail } from '@/lib/ticket-email'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Track processed Stripe event IDs to prevent duplicate emails.
// In-memory Set works across warm function invocations on Netlify.
// For production at scale, migrate to a KV store or database.
const processedEvents = new Set<string>()
const MAX_PROCESSED_EVENTS = 10_000

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Deduplicate by Stripe event ID — retries have the same ID
  if (processedEvents.has(event.id)) {
    return NextResponse.json({ received: true })
  }

  if (event.type !== 'payment_intent.succeeded') {
    return NextResponse.json({ received: true })
  }

  const intent = event.data.object as Stripe.PaymentIntent

  // Email lives in metadata.customerEmail (attached at checkout). Deliberately
  // not receipt_email — that would make Stripe send its own generic receipt
  // alongside our branded ticket email. receipt_email/billing details remain
  // as fallbacks for purchases made before this flow existed.
  let email: string | null | undefined = intent.metadata?.customerEmail || intent.receipt_email
  if (!email && intent.payment_method) {
    try {
      const stripe = getStripe()
      const pm = await stripe.paymentMethods.retrieve(intent.payment_method as string)
      email = pm.billing_details?.email ?? undefined
    } catch {
      console.warn('Could not retrieve payment method for email')
    }
  }
  const eventSlug = intent.metadata?.eventSlug
  const amount = intent.amount

  if (!email || !eventSlug) {
    console.warn('Missing email or eventSlug in PaymentIntent metadata', { email, eventSlug })
    return NextResponse.json({ received: true })
  }

  try {
    await sendTicketEmail(email, eventSlug, amount)
    // Only mark processed AFTER success — otherwise a Stripe retry for a
    // failed send would be swallowed as a duplicate and the email lost.
    if (processedEvents.size >= MAX_PROCESSED_EVENTS) {
      const oldest = processedEvents.values().next().value
      if (oldest) processedEvents.delete(oldest)
    }
    processedEvents.add(event.id)
    console.log(`Receipt sent to ${email} for ${eventSlug}`)
  } catch (err) {
    console.error('Failed to send receipt email:', err)
    // 500 → Stripe retries the event
    return NextResponse.json({ error: 'Email failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
