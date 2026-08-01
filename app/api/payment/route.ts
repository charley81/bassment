import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getStripe } from '@/lib/stripe'
import { clientUncached } from '@/lib/sanity/client'
import { canSell } from '@/lib/tickets'
import { groq } from 'next-sanity'

const PRICE_QUERY = groq`*[_type == "event" && slug.current == $slug][0] { ticketPrice, ticketStatus, capacity, ticketsSold }`

const bodySchema = z.object({
  eventSlug: z.string().trim().min(1).max(200),
})

export async function POST(request: Request) {
  try {
    const parsed = bodySchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const { eventSlug } = parsed.data

    // Fetch price + status from Sanity server-side (uncached — never trust
    // client input or stale CDN data for transactional reads)
    const event = await clientUncached.fetch<{
      ticketPrice?: number
      ticketStatus?: string
      capacity?: number
      ticketsSold?: number
    }>(PRICE_QUERY, { slug: eventSlug })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    if (!canSell(event.ticketStatus, event.ticketPrice, event.capacity, event.ticketsSold)) {
      return NextResponse.json({ error: 'Tickets are not available for this event' }, { status: 400 })
    }

    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      // canSell above guarantees a positive price; TS can't narrow through it
      amount: event.ticketPrice!,
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
