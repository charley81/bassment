import { describe, it, expect } from 'vitest'
import { buildIcs, ticketEventIcs, VENUE_LOCATION } from './calendar'

describe('buildIcs', () => {
  const ics = buildIcs({
    title: 'Goldie at BASSMENT',
    start: new Date('2025-10-24T22:00:00.000Z'),
    end: new Date('2025-10-25T03:00:00.000Z'),
    uid: 'BSMT-ABC123@clubbassment.com',
    location: VENUE_LOCATION,
    description: 'Order BSMT-ABC123',
  })

  it('emits RFC 5545 structure with CRLF line endings', () => {
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('VERSION:2.0')
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('END:VEVENT')
    expect(ics).toContain('END:VCALENDAR')
    expect(ics).toContain('\r\n')
    expect(ics.endsWith('\r\n')).toBe(true)
  })

  it('formats datetimes in UTC basic format', () => {
    expect(ics).toContain('DTSTART:20251024T220000Z')
    expect(ics).toContain('DTEND:20251025T030000Z')
  })

  it('escapes commas, semicolons, and newlines in text', () => {
    const escaped = buildIcs({
      title: 'DJ, Set; Live',
      start: new Date('2025-10-24T22:00:00.000Z'),
      end: new Date('2025-10-25T03:00:00.000Z'),
      uid: 'x@y',
      description: 'line one\nline two',
    })
    expect(escaped).toContain('SUMMARY:DJ\\, Set\\; Live')
    expect(escaped).toContain('DESCRIPTION:line one\\nline two')
  })
})

describe('ticketEventIcs', () => {
  it('prefers doorsOpen over date', () => {
    const ics = ticketEventIcs({
      title: 'Commix',
      date: '2025-10-24T23:00:00.000Z',
      doorsOpen: '2025-10-24T22:00:00.000Z',
      orderRef: 'BSMT-XYZ999',
    })!
    expect(ics).toContain('DTSTART:20251024T220000Z')
  })

  it('defaults to a 5-hour duration', () => {
    const ics = ticketEventIcs({ title: 'Commix', date: '2025-10-24T22:00:00.000Z', orderRef: 'BSMT-XYZ999' })!
    expect(ics).toContain('DTEND:20251025T030000Z')
  })

  it('includes venue, order ref, and a stable UID', () => {
    const ics = ticketEventIcs({ title: 'Commix', date: '2025-10-24T22:00:00.000Z', orderRef: 'BSMT-XYZ999' })!
    expect(ics).toContain(`LOCATION:${VENUE_LOCATION.replaceAll(',', '\\,')}`)
    expect(ics).toContain('UID:BSMT-XYZ999@clubbassment.com')
    expect(ics).toContain('SUMMARY:Commix at BASSMENT')
  })

  it('returns null without a usable start time', () => {
    expect(ticketEventIcs({ title: 'X', orderRef: 'BSMT-1' })).toBeNull()
    expect(ticketEventIcs({ title: 'X', date: 'not-a-date', orderRef: 'BSMT-1' })).toBeNull()
  })
})
