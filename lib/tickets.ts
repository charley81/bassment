/* Ticket order helpers shared by the webhook and the resend flow. */

/** Minutes before the same email address can request another resend. */
export const RESEND_THROTTLE_MINUTES = 5

/** Emails are stored and looked up lowercase — buyers type mixed case. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Pure throttle decision (unit-tested). Given the lastResentAt values of all
    tickets found for an email, allow only if NONE is within the window. */
export function resendAllowed(lastResentAts: (string | undefined)[], now: Date = new Date()): boolean {
  const windowMs = RESEND_THROTTLE_MINUTES * 60 * 1000
  return !lastResentAts.some((iso) => {
    if (!iso) return false
    const t = new Date(iso).getTime()
    return Number.isFinite(t) && now.getTime() - t < windowMs
  })
}
