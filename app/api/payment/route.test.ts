import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

/* Tests the payment route's branching logic with Stripe and Sanity mocked
   at the module boundary — validation, not-found, canSell gate, and error
   handling for both external services. */

const mocks = vi.hoisted(() => {
  const fetchMock = vi.fn()
  const createMock = vi.fn()
  const stripeMock = { paymentIntents: { create: createMock } }
  return { fetchMock, createMock, stripeMock }
})

vi.mock('@/lib/sanity/client', () => ({
  clientUncached: { fetch: mocks.fetchMock },
}))

vi.mock('@/lib/stripe', () => ({
  getStripe: () => mocks.stripeMock,
}))

import { POST } from './route'

function req(body: unknown) {
  return new NextRequest('http://localhost/api/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === null ? '' : JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.fetchMock.mockImplementation((_query: string, params: { slug?: string }) => {
    if (params?.slug === 'exists') {
      return { ticketPrice: 2500, ticketStatus: 'onSale' }
    }
    return null
  })
  mocks.createMock.mockResolvedValue({ client_secret: 'pi_test_secret_123' })
})

describe('POST /api/payment', () => {
  it('creates a payment intent for a valid event and returns a client secret', async () => {
    const res = await POST(req({ eventSlug: 'exists' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.clientSecret).toBe('pi_test_secret_123')
    expect(mocks.createMock).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 2500, currency: 'usd' })
    )
  })

  it('returns 400 when the eventSlug is missing', async () => {
    const res = await POST(req({}))
    expect(res.status).toBe(400)
  })

  it('returns 400 when the body is invalid (non-JSON)', async () => {
    const res = await POST(req(null))
    expect(res.status).toBe(400)
  })

  it('returns 404 when the event is not found', async () => {
    const res = await POST(req({ eventSlug: 'nonexistent' }))
    expect(res.status).toBe(404)
    expect(mocks.createMock).not.toHaveBeenCalled()
  })

  it('returns 400 when the event cannot be sold (soldOut)', async () => {
    mocks.fetchMock.mockResolvedValue({ ticketPrice: 2500, ticketStatus: 'soldOut' })
    const res = await POST(req({ eventSlug: 'exists' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when the event has no price', async () => {
    mocks.fetchMock.mockResolvedValue({ ticketStatus: 'onSale' })
    const res = await POST(req({ eventSlug: 'exists' }))
    expect(res.status).toBe(400)
  })

  it('returns 500 when the Sanity client throws', async () => {
    mocks.fetchMock.mockRejectedValue(new Error('Sanity down'))
    const res = await POST(req({ eventSlug: 'exists' }))
    expect(res.status).toBe(500)
  })

  it('returns 500 when Stripe throws', async () => {
    mocks.createMock.mockRejectedValue(new Error('Stripe down'))
    const res = await POST(req({ eventSlug: 'exists' }))
    expect(res.status).toBe(500)
  })
})
