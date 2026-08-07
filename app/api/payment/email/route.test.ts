import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

/* Tests the payment email route's validation gate and Stripe integration
   at the module boundary. */

const mocks = vi.hoisted(() => {
  const updateMock = vi.fn()
  const stripeMock = { paymentIntents: { update: updateMock } }
  return { updateMock, stripeMock }
})

vi.mock('@/lib/stripe', () => ({
  getStripe: () => mocks.stripeMock,
}))

import { POST } from './route'

function req(body: unknown) {
  return new NextRequest('http://localhost/api/payment/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === null ? '' : JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.updateMock.mockResolvedValue(undefined)
})

describe('POST /api/payment/email', () => {
  it('attaches the customer email to the payment intent and returns ok', async () => {
    const res = await POST(req({
      clientSecret: 'pi_abc123_secret_xyz456',
      email: 'fan@bassment.com',
    }))
    expect(res.status).toBe(200)
    expect(mocks.updateMock).toHaveBeenCalledWith('pi_abc123', {
      metadata: { customerEmail: 'fan@bassment.com' },
    })
  })

  it('returns 400 when the client secret is missing', async () => {
    const res = await POST(req({ email: 'fan@bassment.com' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when the client secret has an invalid format', async () => {
    const res = await POST(req({
      clientSecret: 'not-a-valid-pi-format',
      email: 'fan@bassment.com',
    }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when the email is invalid', async () => {
    const res = await POST(req({
      clientSecret: 'pi_abc123_secret_xyz456',
      email: 'not-an-email',
    }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when the body is not JSON', async () => {
    const res = await POST(req(null))
    expect(res.status).toBe(400)
  })

  it('returns 500 when Stripe throws', async () => {
    mocks.updateMock.mockRejectedValue(new Error('Stripe auth failed'))
    const res = await POST(req({
      clientSecret: 'pi_abc_secret_xyz',
      email: 'fan@bassment.com',
    }))
    expect(res.status).toBe(500)
  })
})
