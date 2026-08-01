import { Resend } from 'resend'

/* Resolves the from-address per send. In production, email must come from a
   verified domain (see docs/email-deliverability/spec.md) — the shared
   onboarding address only delivers to the Resend account owner, so falling
   back to it in production would silently drop every customer email. Throw
   instead: callers surface the error loudly (webhook 500 → Stripe retries).
   Non-production keeps the onboarding fallback for local testing. */
export function getFromAddress(): string {
  const from = process.env.RESEND_FROM_EMAIL
  if (from) return from
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'RESEND_FROM_EMAIL not configured — refusing to send from the onboarding address in production'
    )
  }
  console.warn(
    'RESEND_FROM_EMAIL not set — using Resend onboarding address (delivers only to the account owner)'
  )
  return 'BASSMENT <onboarding@resend.dev>'
}

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
  const { error } = await getResend().emails.send({ from: getFromAddress(), to, subject, html })
  if (error) {
    throw new Error(`Resend failed: ${error.message}`)
  }
}
