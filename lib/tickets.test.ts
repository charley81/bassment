import { describe, it, expect } from 'vitest'
import { resendAllowed, normalizeEmail, RESEND_THROTTLE_MINUTES } from './tickets'

const NOW = new Date('2026-08-01T12:00:00Z')
const minutesAgo = (n: number) => new Date(NOW.getTime() - n * 60_000).toISOString()

describe('resendAllowed', () => {
  it('allows when tickets were never resent', () => {
    expect(resendAllowed([undefined, undefined], NOW)).toBe(true)
    expect(resendAllowed([], NOW)).toBe(true)
  })

  it('denies when any ticket was resent within the window', () => {
    expect(resendAllowed([minutesAgo(1)], NOW)).toBe(false)
    expect(resendAllowed([minutesAgo(RESEND_THROTTLE_MINUTES - 1)], NOW)).toBe(false)
  })

  it('allows when the most recent resend is outside the window', () => {
    expect(resendAllowed([minutesAgo(RESEND_THROTTLE_MINUTES + 1)], NOW)).toBe(true)
    expect(resendAllowed([minutesAgo(10)], NOW)).toBe(true)
  })

  it('the newest resend wins across multiple tickets', () => {
    expect(resendAllowed([minutesAgo(60), minutesAgo(1)], NOW)).toBe(false)
    expect(resendAllowed([minutesAgo(60), minutesAgo(30)], NOW)).toBe(true)
  })

  it('ignores malformed timestamps', () => {
    expect(resendAllowed(['not-a-date'], NOW)).toBe(true)
  })
})

describe('normalizeEmail', () => {
  it('lowercases and trims', () => {
    expect(normalizeEmail('  Chris.Harley81@Gmail.com ')).toBe('chris.harley81@gmail.com')
  })
})
