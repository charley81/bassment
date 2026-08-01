/* ICS (RFC 5545) generation for the confirmation page's Add to Calendar
   button. Pure and unit-tested; no dependency. */

export const VENUE_LOCATION = 'BASSMENT, 70 Pine Street, Manhattan'

/** Club-night default — events have no end-time field (spec'd assumption). */
const DEFAULT_DURATION_HOURS = 5

export interface IcsEvent {
  title: string
  start: Date
  end: Date
  uid: string
  location?: string
  description?: string
}

/** 2026-08-01T22:00:00.000Z → 20260801T220000Z */
function formatUtc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** Escape per RFC 5545 §3.3.11 */
function escapeText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

export function buildIcs(e: IcsEvent): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BASSMENT//Tickets//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${escapeText(e.uid)}`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(e.start)}`,
    `DTEND:${formatUtc(e.end)}`,
    `SUMMARY:${escapeText(e.title)}`,
    e.location ? `LOCATION:${escapeText(e.location)}` : null,
    e.description ? `DESCRIPTION:${escapeText(e.description)}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter((l): l is string => l !== null)
  return lines.join('\r\n') + '\r\n'
}

export interface TicketEventInput {
  title: string
  date?: string
  doorsOpen?: string
  orderRef: string
}

/** Builds the ICS for a purchased event. doorsOpen wins over date; returns
    null when there's no usable start time (caller hides the button). */
export function ticketEventIcs({ title, date, doorsOpen, orderRef }: TicketEventInput): string | null {
  const startIso = doorsOpen ?? date
  if (!startIso) return null
  const start = new Date(startIso)
  if (Number.isNaN(start.getTime())) return null
  const end = new Date(start.getTime() + DEFAULT_DURATION_HOURS * 3_600_000)
  return buildIcs({
    title: `${title} at BASSMENT`,
    start,
    end,
    uid: `${orderRef}@clubbassment.com`,
    location: VENUE_LOCATION,
    description: `Order ${orderRef} — your ticket confirmation email is your ticket.`,
  })
}
