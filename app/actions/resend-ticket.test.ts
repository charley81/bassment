import { describe, it, expect, vi, beforeEach } from 'vitest'

/* Tests the server action's branching logic with Sanity/Resend mocked at the
   module boundary — covers lookup, throttle, per-ticket send + patch, and
   normalization without needing a running Next server. */

const mocks = vi.hoisted(() => {
  const fetchMock = vi.fn()
  const patchCommitMock = vi.fn()
  const setMock = vi.fn(() => ({ commit: patchCommitMock }))
  const patchMock = vi.fn(() => ({ set: setMock }))
  const sendMock = vi.fn()
  return { fetchMock, patchCommitMock, patchMock, sendMock }
})

vi.mock('@/lib/sanity/client', () => ({
  clientUncached: { fetch: mocks.fetchMock },
  getWriteClient: () => ({ patch: mocks.patchMock }),
}))

vi.mock('@/lib/ticket-email', () => ({
  sendTicketEmail: mocks.sendMock,
}))

import { resendTickets } from './resend-ticket'

const ticket = {
  _id: 'pi_test_1',
  eventSlug: 'commix',
  amount: 2500,
  orderRef: 'BSMT-TEST01',
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.fetchMock.mockResolvedValue([])
  mocks.sendMock.mockResolvedValue(undefined)
  mocks.patchCommitMock.mockResolvedValue(undefined)
})

describe('resendTickets', () => {
  it('honeypot: fake success, no work', async () => {
    const res = await resendTickets({ email: 'a@b.com', botField: 'spam' })
    expect(res.success).toBe(true)
    expect(mocks.fetchMock).not.toHaveBeenCalled()
  })

  it('rejects invalid email', async () => {
    const res = await resendTickets({ email: 'nope' })
    expect(res.success).toBe(false)
    expect(res.error).toMatch(/valid email/i)
  })

  it('unknown email: generic success, no email sent (non-enumerating)', async () => {
    const res = await resendTickets({ email: 'ghost@nowhere.com' })
    expect(res.success).toBe(true)
    expect(mocks.sendMock).not.toHaveBeenCalled()
  })

  it('resends every ticket found and patches lastResentAt', async () => {
    mocks.fetchMock.mockResolvedValue([ticket, { ...ticket, _id: 'pi_test_2', orderRef: 'BSMT-TEST02' }])
    const res = await resendTickets({ email: 'buyer@x.com' })
    expect(res.success).toBe(true)
    expect(mocks.sendMock).toHaveBeenCalledTimes(2)
    expect(mocks.sendMock).toHaveBeenCalledWith('buyer@x.com', 'commix', 2500, 'BSMT-TEST01')
    expect(mocks.patchCommitMock).toHaveBeenCalledTimes(2)
  })

  it('throttled when any ticket was resent within the window', async () => {
    mocks.fetchMock.mockResolvedValue([{ ...ticket, lastResentAt: new Date().toISOString() }])
    const res = await resendTickets({ email: 'buyer@x.com' })
    expect(res.success).toBe(true) // generic success — throttle is invisible
    expect(mocks.sendMock).not.toHaveBeenCalled()
    expect(mocks.patchCommitMock).not.toHaveBeenCalled()
  })

  it('a failed send does not block others and is not marked resent', async () => {
    mocks.fetchMock.mockResolvedValue([ticket, { ...ticket, _id: 'pi_test_2', orderRef: 'BSMT-TEST02' }])
    mocks.sendMock.mockRejectedValueOnce(new Error('resend down'))
    const res = await resendTickets({ email: 'buyer@x.com' })
    expect(res.success).toBe(true)
    expect(mocks.sendMock).toHaveBeenCalledTimes(2)
    expect(mocks.patchCommitMock).toHaveBeenCalledTimes(1) // only the successful one
  })

  it('normalizes mixed-case input for the lookup', async () => {
    await resendTickets({ email: '  Buyer@X.COM ' })
    expect(mocks.fetchMock).toHaveBeenCalledWith(expect.anything(), { email: 'buyer@x.com' })
  })
})
