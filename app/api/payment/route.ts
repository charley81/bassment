import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

const PRICE_QUERY = groq`*[_type == "event" && slug.current == $slug][0] { ticketPrice }`

export async function POST(request: Request) {
  try {
    const { eventSlug } = await request.json()

    if (!eventSlug) {
      return NextResponse.json({ error: 'Missing event slug' }, { status: 400 })
    }

    // Fetch ticket price from Sanity (server-side, no client input)
    const event = await client.fetch<{ ticketPrice?: number }>(PRICE_QUERY, { slug: eventSlug })

    if (!event?.ticketPrice || event.ticketPrice <= 0) {
      return NextResponse.json({ error: 'Tickets not available for this event' }, { status: 400 })
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
