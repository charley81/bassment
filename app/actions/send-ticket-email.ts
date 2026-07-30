'use server'

import { sendEmail } from '@/lib/resend'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

const EVENT_QUERY = groq`*[_type == "event" && slug.current == $slug][0] { title, date }`

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function sendTicketEmail(email: string, eventSlug: string, pricePaid: number) {
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
        <p style="font-size:16px;margin:0">${price}</p>
      </div>

      <p style="font-size:14px;color:#999999;margin:0 0 4px">Venue</p>
      <p style="font-size:16px;margin:0 0 24px">70 Pine Street, Manhattan</p>

      <p style="font-size:14px;color:#666666;margin:0">We'll see you there.<br>— BASSMENT</p>
    </div>
  `

  await sendEmail(email, `You're In — ${eventName} at BASSMENT`, html)
}
