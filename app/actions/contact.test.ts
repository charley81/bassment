import { describe, it, expect, vi, beforeEach } from 'vitest'

/* Tests the server action's branching logic with Resend mocked at the
   module boundary — covers honeypot, zod validation gate, and error handling. */

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

import { sendContactMessage } from './contact'

const valid = {
  name: 'Test User',
  email: 'test@example.com',
  message: 'This is a valid test message.',
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.sendMock.mockResolvedValue(undefined)
})

describe('sendContactMessage', () => {
  it('honeypot: fake success when botField is filled', async () => {
    const res = await sendContactMessage({ ...valid, botField: 'spam' })
    expect(res.success).toBe(true)
    expect(mocks.sendMock).not.toHaveBeenCalled()
  })

  it('sends a valid message via Resend and returns success', async () => {
    const res = await sendContactMessage(valid)
    expect(res.success).toBe(true)
    expect(mocks.sendMock).toHaveBeenCalledTimes(1)
    const call = mocks.sendMock.mock.calls[0][0]
    expect(call.subject).toContain('Test User')
    expect(call.text).toContain('This is a valid test message.')
  })

  it('rejects an empty name', async () => {
    const res = await sendContactMessage({ ...valid, name: '' })
    expect(res.success).toBe(false)
    expect(res.error).toBeDefined()
  })

  it('rejects a name with newlines (subject-line injection guard)', async () => {
    const res = await sendContactMessage({ ...valid, name: 'Test\nUser' })
    expect(res.success).toBe(false)
    expect(mocks.sendMock).not.toHaveBeenCalled()
  })

  it('rejects a name with carriage returns', async () => {
    const res = await sendContactMessage({ ...valid, name: 'Test\r\nUser' })
    expect(res.success).toBe(false)
  })

  it('rejects an invalid email', async () => {
    const res = await sendContactMessage({ ...valid, email: 'not-an-email' })
    expect(res.success).toBe(false)
  })

  it('rejects a message that is too short', async () => {
    const res = await sendContactMessage({ ...valid, message: 'short' })
    expect(res.success).toBe(false)
  })

  it('returns an error when Resend throws', async () => {
    mocks.sendMock.mockRejectedValue(new Error('Resend down'))
    const res = await sendContactMessage(valid)
    expect(res.success).toBe(false)
    expect(res.error).toContain('Failed to send')
  })
})
