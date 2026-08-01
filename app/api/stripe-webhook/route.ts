import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { groq } from 'next-sanity'
import { getStripe } from '@/lib/stripe'
import { sendTicketEmail, resolveTicketRecipient } from '@/lib/ticket-email'
import { getWriteClient, clientUncached } from '@/lib/sanity/client'
import { orderRefFor } from '@/lib/orders'
import type { SanityTicket } from '@/lib/sanity/types'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

const EVENT_LOOKUP = groq`*[_type == "event" && slug.current == $slug][0] { _id, title }`

/* Idempotency is durable, not in-memory: the ticket document's _id IS the
   Stripe PaymentIntent ID. create() conflicts on replays/duplicate endpoints,
   and emailSentAt on the doc distinguishes "email already sent" (skip) from
   "order recorded but email failed" (resend). spec: docs/ticket-orders */

function isConflict(err: unknown): boolean {
  const e = err as { statusCode?: number; message?: string }
  return e?.statusCode === 409 || /already exists/i.test(e?.message ?? '')
}

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

  if (event.type !== 'payment_intent.succeeded') {
    return NextResponse.json({ received: true })
  }

  const intent = event.data.object as Stripe.PaymentIntent

  let billingEmail: string | null | undefined
  if (!intent.metadata?.customerEmail && !intent.receipt_email && intent.payment_method) {
    try {
      const stripe = getStripe()
      const pm = await stripe.paymentMethods.retrieve(intent.payment_method as string)
      billingEmail = pm.billing_details?.email
    } catch {
      console.warn('Could not retrieve payment method for email')
    }
  }
  // Stored lowercase so the self-serve resend lookup is case-insensitive.
  const email = resolveTicketRecipient(intent, billingEmail)?.toLowerCase() ?? null
  const eventSlug = intent.metadata?.eventSlug
  const amount = intent.amount

  if (!email || !eventSlug) {
    console.warn('Missing email or eventSlug in PaymentIntent metadata', { email, eventSlug })
    return NextResponse.json({ received: true })
  }

  const orderRef = orderRefFor(intent.id)

  try {
    const sanity = getWriteClient()

    // 1. Record the order. A conflict means this PaymentIntent was already
    //    processed (Stripe retry or duplicate webhook endpoint).
    try {
      const eventDoc = await clientUncached.fetch<{ _id: string; title?: string } | null>(
        EVENT_LOOKUP,
        { slug: eventSlug }
      )
      await sanity.create({
        _id: intent.id,
        _type: 'ticket',
        event: eventDoc ? { _type: 'reference', _ref: eventDoc._id, _weak: true } : undefined,
        eventSlug,
        eventTitle: eventDoc?.title || eventSlug,
        email,
        amount,
        currency: intent.currency,
        orderRef,
        status: 'paid',
        purchasedAt: new Date(intent.created * 1000).toISOString(),
      })
      console.log(`Ticket ${orderRef} recorded for ${email} (${eventSlug})`)
    } catch (err) {
      if (!isConflict(err)) throw err
      const existing = await sanity.getDocument<SanityTicket>(intent.id)
      if (existing?.emailSentAt) {
        console.log(`Duplicate delivery for ${orderRef} — email already sent, skipping`)
        return NextResponse.json({ received: true })
      }
      // Order exists but the email never went out (previous attempt failed
      // between create and send) — fall through and send it now.
    }

    // 2. Send the ticket email, then mark it sent. If the send fails we 500 →
    //    Stripe retries → the conflict path above finds emailSentAt unset and
    //    tries again. No lost tickets, no duplicates, in either failure order.
    await sendTicketEmail(email, eventSlug, amount, orderRef)
    await sanity.patch(intent.id).set({ emailSentAt: new Date().toISOString() }).commit()
    console.log(`Ticket ${orderRef} emailed to ${email} (${eventSlug})`)

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error(`Failed to process ticket ${orderRef}:`, err)
    // 500 → Stripe retries the event
    return NextResponse.json({ error: 'Ticket processing failed' }, { status: 500 })
  }
}
