import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

/* Tests the webhook route's auth logic with revalidatePath mocked — the
   handler must accept the standard Sanity webhook pattern (secret in the
   URL query string) as well as the legacy body secret, and must fail
   closed when the server secret is not configured. */

const mocks = vi.hoisted(() => ({ revalidatePathMock: vi.fn() }))

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePathMock,
}))

import { POST } from './route'

function req(url: string, body?: unknown) {
  return new NextRequest(url, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('SANITY_WEBHOOK_SECRET', 'test-secret')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('POST /api/revalidate', () => {
  it('accepts a valid secret in the URL query (Sanity webhook pattern)', async () => {
    const res = await POST(req('https://clubbassment.com/api/revalidate?secret=test-secret', {}))
    expect(res.status).toBe(200)
    expect(mocks.revalidatePathMock).toHaveBeenCalledWith('/', 'layout')
  })

  it('accepts a valid secret in the JSON body', async () => {
    const res = await POST(req('https://clubbassment.com/api/revalidate', { secret: 'test-secret' }))
    expect(res.status).toBe(200)
    expect(mocks.revalidatePathMock).toHaveBeenCalledWith('/', 'layout')
  })

  it('rejects an invalid secret with 401', async () => {
    const res = await POST(req('https://clubbassment.com/api/revalidate?secret=wrong', {}))
    expect(res.status).toBe(401)
    expect(mocks.revalidatePathMock).not.toHaveBeenCalled()
  })

  it('rejects a missing secret with 401', async () => {
    const res = await POST(req('https://clubbassment.com/api/revalidate', {}))
    expect(res.status).toBe(401)
    expect(mocks.revalidatePathMock).not.toHaveBeenCalled()
  })

  it('fails closed with 500 when SANITY_WEBHOOK_SECRET is not configured', async () => {
    vi.stubEnv('SANITY_WEBHOOK_SECRET', '')
    const res = await POST(req('https://clubbassment.com/api/revalidate?secret=anything', {}))
    expect(res.status).toBe(500)
    expect(mocks.revalidatePathMock).not.toHaveBeenCalled()
  })
})
