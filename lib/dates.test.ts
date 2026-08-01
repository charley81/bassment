import { describe, it, expect } from 'vitest'
import {
  formatEventDateShort,
  formatEventDateLong,
  formatEventDateUpper,
  formatEventTime,
} from './dates'

// Friday, October 24, 2025, 22:30 UTC = 18:30 EDT (America/New_York)
const ISO = '2025-10-24T22:30:00.000Z'

describe('formatEventDateShort', () => {
  it('formats as "Fri, Oct 24"', () => {
    expect(formatEventDateShort(ISO)).toBe('Fri, Oct 24')
  })
})

describe('formatEventDateLong', () => {
  it('formats as "Friday, October 24, 2025"', () => {
    expect(formatEventDateLong(ISO)).toBe('Friday, October 24, 2025')
  })
})

describe('formatEventDateUpper', () => {
  it('formats as "FRI, OCT 24"', () => {
    expect(formatEventDateUpper(ISO)).toBe('FRI, OCT 24')
  })
})

describe('formatEventTime', () => {
  it('formats as NYC local time', () => {
    expect(formatEventTime(ISO)).toBe('6:30 PM')
  })
})

describe('timezone pinning', () => {
  it('uses America/New_York regardless of host timezone', () => {
    // 2025-10-24T02:00:00Z is Oct 23 at 22:00 EDT — a host in UTC would
    // render Oct 24, NYC must render Oct 23.
    const boundary = '2025-10-24T02:00:00.000Z'
    expect(formatEventDateShort(boundary)).toBe('Thu, Oct 23')
    expect(formatEventTime(boundary)).toBe('10:00 PM')
  })
})
