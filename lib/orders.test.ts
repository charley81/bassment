import { describe, it, expect } from 'vitest'
import { orderRefFor } from './orders'

describe('orderRefFor', () => {
  it('derives a deterministic BSMT- reference from the PaymentIntent ID', () => {
    expect(orderRefFor('pi_3TzVCgLCBcgW9UWy0IvOK1Sz')).toBe('BSMT-VOK1SZ')
  })

  it('is deterministic — same ID, same ref, every time', () => {
    const id = 'pi_1ABCdef2GHIjkl'
    expect(orderRefFor(id)).toBe(orderRefFor(id))
  })

  it('uppercases and strips non-alphanumerics', () => {
    expect(orderRefFor('pi_xxx-yyy_abc123')).toBe('BSMT-ABC123')
  })

  it('differs for different intents', () => {
    expect(orderRefFor('pi_aaaaaa111111')).not.toBe(orderRefFor('pi_bbbbbb222222'))
  })
})
