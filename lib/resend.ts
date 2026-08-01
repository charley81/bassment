import { Resend } from 'resend'

export const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'BASSMENT <onboarding@resend.dev>'

/** Returns a configured Resend client. Throws when unconfigured —
    callers rely on the throw to surface misconfiguration (and trigger
    Stripe webhook retries) instead of silently dropping email. */
export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured')
  }
  return new Resend(apiKey)
}

/** Sends an HTML email. Throws on failure. */
export async function sendEmail(to: string, subject: string, html: string) {
  const { error } = await getResend().emails.send({ from: RESEND_FROM, to, subject, html })
  if (error) {
    throw new Error(`Resend failed: ${error.message}`)
  }
}
