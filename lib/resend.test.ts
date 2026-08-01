import { describe, it, expect, afterEach, vi } from 'vitest'
import { getFromAddress } from './resend'

describe('getFromAddress', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns RESEND_FROM_EMAIL verbatim when set', () => {
    vi.stubEnv('RESEND_FROM_EMAIL', 'BASSMENT <tickets@contact.clubbassment.com>')
    expect(getFromAddress()).toBe('BASSMENT <tickets@contact.clubbassment.com>')
  })

  it('throws in production when unset (fail loud — never silently drop customer email)', () => {
    vi.stubEnv('RESEND_FROM_EMAIL', '')
    vi.stubEnv('NODE_ENV', 'production')
    expect(() => getFromAddress()).toThrow(/RESEND_FROM_EMAIL not configured/)
  })

  it('falls back to the onboarding address outside production', () => {
    vi.stubEnv('RESEND_FROM_EMAIL', '')
    vi.stubEnv('NODE_ENV', 'test')
    expect(getFromAddress()).toBe('BASSMENT <onboarding@resend.dev>')
  })
})
