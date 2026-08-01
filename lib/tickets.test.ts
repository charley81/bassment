import { describe, it, expect } from 'vitest'
import { resendAllowed, normalizeEmail, canSell, RESEND_THROTTLE_MINUTES } from './tickets'

const NOW = new Date('2026-08-01T12:00:00Z')
const minutesAgo = (n: number) => new Date(NOW.getTime() - n * 60_000).toISOString()

describe('canSell', () => {
  it('sells onSale and lowTickets with a price', () => {
    expect(canSell('onSale', 2500)).toBe(true)
    expect(canSell('lowTickets', 2500)).toBe(true)
  })

  it('refuses non-purchasable statuses', () => {
    expect(canSell('soldOut', 2500)).toBe(false)
    expect(canSell('atDoor', 2500)).toBe(false)
    expect(canSell('past', 2500)).toBe(false)
    expect(canSell(undefined, 2500)).toBe(false)
  })

  it('refuses missing or non-positive price', () => {
    expect(canSell('onSale', undefined)).toBe(false)
    expect(canSell('onSale', 0)).toBe(false)
    expect(canSell('onSale', -100)).toBe(false)
  })

  it('sells at any count when capacity is unset (unlimited)', () => {
    expect(canSell('onSale', 2500, undefined, 99999)).toBe(true)
  })

  it('sells under capacity and refuses at/over capacity', () => {
    expect(canSell('onSale', 2500, 200, 199)).toBe(true)
    expect(canSell('onSale', 2500, 200, 200)).toBe(false)
    expect(canSell('onSale', 2500, 200, 201)).toBe(false)
  })
})

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
