import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getStripe } from '@/lib/stripe'
import { orderRefFor } from '@/lib/orders'
import { AddToCalendar } from '@/components/add-to-calendar'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

const EVENT_DETAILS = groq`*[_type == "event" && slug.current == $slug][0] { title, date, doorsOpen }`

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ payment_intent?: string; redirect_status?: string }>
}

type Verification = 'verified' | 'failed' | 'unknown'

interface VerificationResult {
  status: Verification
  email?: string
}

async function verifyPayment(paymentIntentId?: string, redirectStatus?: string): Promise<VerificationResult> {
  if (!paymentIntentId || !redirectStatus) return { status: 'unknown' }
  if (redirectStatus !== 'succeeded') return { status: 'failed' }

  try {
    const stripe = getStripe()
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId)
    const email = intent.metadata?.customerEmail || intent.receipt_email || undefined
    return intent.status === 'succeeded'
      ? { status: 'verified', email }
      : { status: 'failed' }
  } catch (err) {
    console.error('Could not verify payment intent:', err)
    return { status: 'unknown' }
  }
}

const CONTENT: Record<Verification, { heading: string; body: string }> = {
  verified: {
    heading: "You're In.",
    body: 'Your ticket has been purchased. A confirmation email is on the way.',
  },
  failed: {
    heading: 'Payment Failed',
    body: 'Your payment could not be completed. You have not been charged — please try again.',
  },
  unknown: {
    heading: 'Nothing to Confirm',
    body: "We couldn't find a purchase linked to this page. If you just paid, your confirmation email will arrive shortly.",
  },
}

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { payment_intent, redirect_status } = await searchParams
  const verification = await verifyPayment(payment_intent, redirect_status)
  const content = CONTENT[verification.status]
  // Verified purchases name the exact address the ticket was sent to, so
  // buyers can catch a typo immediately instead of waiting for an email
  // that is never coming.
  const body =
    verification.status === 'verified' && verification.email
      ? `Your ticket has been purchased — it's on its way to ${verification.email}.`
      : content.body
  const orderRef =
    verification.status === 'verified' && payment_intent ? orderRefFor(payment_intent) : null
  // Event details for the Add to Calendar button (verified purchases only).
  const eventDetails = orderRef
    ? await client.fetch<{ title?: string; date?: string; doorsOpen?: string } | null>(
        EVENT_DETAILS,
        { slug }
      )
    : null

  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />
      <main className="pt-200 md:pt-280 pb-20 md:pb-120 px-2 lg:px-20 flex flex-col justify-center">
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-4">
            <h1 className="text-h2 text-bass-white">{content.heading}</h1>
            <p className="text-body text-bass-grey-light">{body}</p>
            {orderRef && (
              <>
                <p className="text-nav text-bass-white tracking-widest">Order {orderRef}</p>
                <p className="text-body-sm text-bass-grey-med">
                  Wrong email or nothing arrived?{' '}
                  <Link href="/tickets/resend" className="text-bass-grey-light underline underline-offset-4 hover:text-bass-white transition-colors">
                    Resend your ticket
                  </Link>{' '}
                  or{' '}
                  <Link href="/contact" className="text-bass-grey-light underline underline-offset-4 hover:text-bass-white transition-colors">
                    contact us
                  </Link>{' '}
                  with your order reference.
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <Link
              href={`/events/${slug}`}
              className="inline-flex h-14 items-center justify-center rounded-lg px-8 bg-bass-grey-dark border border-bass-grey-med text-btn text-bass-white hover:border-primary transition-colors"
            >
              Back to Event
            </Link>
            <Link
              href="/events"
              className="inline-flex h-14 items-center justify-center rounded-lg px-8 bg-primary text-btn text-bass-white hover:bg-primary/80 transition-colors"
            >
              More Events
            </Link>
            {orderRef && eventDetails?.title && (eventDetails.doorsOpen || eventDetails.date) && (
              <AddToCalendar
                title={eventDetails.title}
                date={eventDetails.date}
                doorsOpen={eventDetails.doorsOpen}
                orderRef={orderRef}
                slug={slug}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
