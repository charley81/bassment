import { sendEmail } from '@/lib/resend'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

/* Server-only helper — called by the Stripe webhook, never from the client.
   Deliberately NOT a server action ('use server' would expose it as a
   public endpoint anyone could invoke with arbitrary email addresses). */

const EVENT_QUERY = groq`*[_type == "event" && slug.current == $slug][0] { title, date }`

/* Who gets the ticket email. Pure decision, extracted from the webhook route
   for testability. Precedence: metadata.customerEmail (attached at checkout)
   → receipt_email (legacy purchases / future Stripe receipts) → billing
   details email (wallet payments) → null (nothing to deliver to). */
export interface TicketIntentLike {
  metadata?: Record<string, string | undefined> | null
  receipt_email?: string | null
}

export function resolveTicketRecipient(
  intent: TicketIntentLike,
  billingEmail?: string | null
): string | null {
  return intent.metadata?.customerEmail || intent.receipt_email || billingEmail || null
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York',
  })
}

export async function sendTicketEmail(email: string, eventSlug: string, pricePaid: number, orderRef: string) {
  const event = await client.fetch<{ title?: string; date?: string }>(EVENT_QUERY, { slug: eventSlug })
  const eventName = event?.title || 'Your Event'
  const eventDate = event?.date ? formatDate(event.date) : 'TBA'
  const price = `$${(pricePaid / 100).toFixed(2)}`

  const html = `
    <div style="max-width:480px;margin:0 auto;font-family:monospace;background:#090102;color:#eeeeee;padding:40px 24px">
      <h1 style="font-size:24px;font-weight:800;text-transform:uppercase;margin:0 0 8px">You're In.</h1>
      <p style="font-size:16px;color:#999999;margin:0 0 32px">Your ticket is confirmed.</p>

      <div style="border-top:1px solid #533c3d;border-bottom:1px solid #533c3d;padding:24px 0;margin:0 0 32px">
        <p style="font-size:14px;color:#999999;margin:0 0 4px">Event</p>
        <p style="font-size:16px;font-weight:700;margin:0 0 16px">${eventName}</p>
        <p style="font-size:14px;color:#999999;margin:0 0 4px">Date</p>
        <p style="font-size:16px;margin:0 0 16px">${eventDate}</p>
        <p style="font-size:14px;color:#999999;margin:0 0 4px">Price</p>
        <p style="font-size:16px;margin:0 0 16px">${price}</p>
        <p style="font-size:14px;color:#999999;margin:0 0 4px">Order</p>
        <p style="font-size:16px;font-weight:700;letter-spacing:1px;margin:0">${orderRef}</p>
      </div>

      <p style="font-size:14px;color:#999999;margin:0 0 4px">Venue</p>
      <p style="font-size:16px;margin:0 0 24px">70 Pine Street, Manhattan</p>

      <p style="font-size:14px;color:#666666;margin:0">We'll see you there.<br>— BASSMENT</p>
      <p style="font-size:12px;color:#555555;margin:24px 0 0;border-top:1px solid #2a2a2a;padding-top:16px">
        Didn't get your ticket? <a href="https://clubbassment.com/tickets/resend" style="color:#999999">Resend it</a>.
        Wrong email? Contact us at
        <a href="https://clubbassment.com/contact" style="color:#999999">clubbassment.com/contact</a>
        with your order reference <strong>${orderRef}</strong>.
      </p>
    </div>
  `

  await sendEmail(email, `You're In — ${eventName} at BASSMENT`, html)
}
