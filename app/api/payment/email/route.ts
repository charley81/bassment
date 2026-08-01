import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getStripe } from '@/lib/stripe'

/* Attaches the buyer's email to a PaymentIntent before it is confirmed.
   The client secret identifies the intent (possession = ownership), so no
   session or auth is needed. The email travels in metadata — deliberately
   NOT receipt_email, which would trigger Stripe's own generic receipt and
   double-email the buyer alongside our branded ticket email. */

const bodySchema = z.object({
  clientSecret: z.string().regex(/^pi_[A-Za-z0-9]+_secret_[A-Za-z0-9]+$/, 'Invalid client secret'),
  email: z.email().max(320),
})

export async function POST(request: Request) {
  try {
    const parsed = bodySchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const { clientSecret, email } = parsed.data

    const intentId = clientSecret.split('_secret_')[0]
    const stripe = getStripe()
    await stripe.paymentIntents.update(intentId, {
      metadata: { customerEmail: email },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Attach email error:', error)
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 })
  }
}
