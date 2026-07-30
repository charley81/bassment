import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { sendTicketEmail } from '@/app/actions/send-ticket-email'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

const sentEmails = new Set<string>()

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent

    // Deduplicate
    if (sentEmails.has(intent.id)) {
      return NextResponse.json({ received: true, deduplicated: true })
    }
    sentEmails.add(intent.id)

    // Extract email and event info
    const email = intent.receipt_email
    const eventSlug = intent.metadata?.eventSlug
    const amount = intent.amount

    if (email && eventSlug) {
      await sendTicketEmail(email, eventSlug, amount)
      console.log(`Receipt sent to ${email} for ${eventSlug}`)
    }
  }

  return NextResponse.json({ received: true })
}
