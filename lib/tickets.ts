/* Ticket order helpers shared by the webhook and the resend flow. */

/** Statuses that allow purchasing (kept in sync with the event schema list). */
export const PURCHASABLE_STATUSES = new Set(['onSale', 'lowTickets'])

/** Pure purchase-gate decision (unit-tested). Used by /api/payment so the
    same logic is provable without standing up the route. */
export function canSell(
  ticketStatus: string | undefined,
  ticketPrice: number | undefined,
  capacity?: number,
  ticketsSold?: number
): boolean {
  if (!ticketPrice || ticketPrice <= 0) return false
  if (!PURCHASABLE_STATUSES.has(ticketStatus ?? '')) return false
  if (capacity != null && (ticketsSold ?? 0) >= capacity) return false
  return true
}

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
