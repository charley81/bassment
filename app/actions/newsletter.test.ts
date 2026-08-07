import { describe, it, expect, vi, beforeEach } from 'vitest'

/* Tests the newsletter action's branching logic with Resend mocked at the
   module boundary — honeypot, zod validation, and error handling. */

const mocks = vi.hoisted(() => {
  const sendMock = vi.fn()
  const emailsMock = { send: sendMock }
  const resendMock = { emails: emailsMock }
  return { sendMock, emailsMock, resendMock }
})

vi.mock('@/lib/resend', () => ({
  getResend: () => mocks.resendMock,
  getFromAddress: () => 'test@bassment.com',
}))

import { subscribeNewsletter } from './newsletter'

beforeEach(() => {
  vi.clearAllMocks()
  mocks.sendMock.mockResolvedValue(undefined)
})

describe('subscribeNewsletter', () => {
  it('honeypot: fake success when botField is filled', async () => {
    const res = await subscribeNewsletter({ email: 'test@example.com', botField: 'spam' })
    expect(res.success).toBe(true)
    expect(mocks.sendMock).not.toHaveBeenCalled()
  })

  it('subscribes a valid email via Resend and returns success', async () => {
    const res = await subscribeNewsletter({ email: 'test@example.com' })
    expect(res.success).toBe(true)
    expect(mocks.sendMock).toHaveBeenCalledTimes(1)
    const call = mocks.sendMock.mock.calls[0][0]
    expect(call.text).toContain('test@example.com')
  })

  it('rejects an invalid email', async () => {
    const res = await subscribeNewsletter({ email: 'not-an-email' })
    expect(res.success).toBe(false)
    expect(res.error).toContain('valid email')
  })

  it('rejects an empty email', async () => {
    const res = await subscribeNewsletter({ email: '' })
    expect(res.success).toBe(false)
  })

  it('returns an error when Resend throws', async () => {
    mocks.sendMock.mockRejectedValue(new Error('Resend down'))
    const res = await subscribeNewsletter({ email: 'test@example.com' })
    expect(res.success).toBe(false)
    expect(res.error).toContain('Failed to subscribe')
  })
})
