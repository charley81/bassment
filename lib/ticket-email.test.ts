import { describe, it, expect } from 'vitest'
import { resolveTicketRecipient } from './ticket-email'

describe('resolveTicketRecipient', () => {
  it('prefers metadata.customerEmail (attached at checkout)', () => {
    expect(
      resolveTicketRecipient(
        { metadata: { customerEmail: 'a@x.com' }, receipt_email: 'b@x.com' },
        'c@x.com'
      )
    ).toBe('a@x.com')
  })

  it('falls back to receipt_email (legacy purchases)', () => {
    expect(
      resolveTicketRecipient({ metadata: {}, receipt_email: 'b@x.com' }, 'c@x.com')
    ).toBe('b@x.com')
  })

  it('falls back to billing details email (wallet payments)', () => {
    expect(resolveTicketRecipient({ metadata: {} }, 'c@x.com')).toBe('c@x.com')
  })

  it('returns null when no source has an email', () => {
    expect(resolveTicketRecipient({ metadata: {} })).toBeNull()
    expect(resolveTicketRecipient({})).toBeNull()
    expect(resolveTicketRecipient({ metadata: null, receipt_email: null }, null)).toBeNull()
  })

  it('ignores empty-string metadata values', () => {
    expect(
      resolveTicketRecipient({ metadata: { customerEmail: '' }, receipt_email: 'b@x.com' })
    ).toBe('b@x.com')
  })
})
