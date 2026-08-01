import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getStripe } from '@/lib/stripe'
import { clientUncached } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

const PRICE_QUERY = groq`*[_type == "event" && slug.current == $slug][0] { ticketPrice, ticketStatus }`

const bodySchema = z.object({
  eventSlug: z.string().trim().min(1).max(200),
})

// Statuses that allow purchasing. Anything else (soldOut, atDoor, past)
// is rejected server-side so tickets can't be bought via direct API calls.
const PURCHASABLE_STATUSES = new Set(['onSale', 'lowTickets'])

export async function POST(request: Request) {
  try {
    const parsed = bodySchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const { eventSlug } = parsed.data

    // Fetch price + status from Sanity server-side (uncached — never trust
    // client input or stale CDN data for transactional reads)
    const event = await clientUncached.fetch<{ ticketPrice?: number; ticketStatus?: string }>(
      PRICE_QUERY,
      { slug: eventSlug }
    )

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    if (!event.ticketPrice || event.ticketPrice <= 0) {
      return NextResponse.json({ error: 'Tickets not available for this event' }, { status: 400 })
    }
    if (!PURCHASABLE_STATUSES.has(event.ticketStatus ?? '')) {
      return NextResponse.json({ error: 'Tickets are not on sale for this event' }, { status: 400 })
    }

    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: event.ticketPrice,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { eventSlug },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Payment intent error:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
