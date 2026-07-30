import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'BASSMENT <onboarding@resend.dev>'

export async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Email not sent to:', to)
    return
  }

  const resend = new Resend(RESEND_API_KEY)
  await resend.emails.send({ from: RESEND_FROM, to, subject, html })
}
