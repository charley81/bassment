import { describe, it, expect } from 'vitest'
import { mapEvent } from './mappers'
import type { SanityEvent } from '@/lib/sanity/types'
import { IMAGE_FALLBACK } from '@/lib/sanity/image'

const base: SanityEvent = {
  _id: 'abc123',
  title: 'Goldie',
  date: '2025-10-24T22:30:00.000Z',
} as SanityEvent

describe('mapEvent', () => {
  it('maps a full event', () => {
    const e = mapEvent({
      ...base,
      slug: 'goldie',
      supportText: 'with Doc Scott',
      image: { asset: { _id: 'i', url: 'https://cdn.sanity.io/g.jpg' } },
    } as SanityEvent)
    expect(e).toEqual({
      id: 'goldie',
      title: 'Goldie',
      date: 'Fri, Oct 24',
      support: 'with Doc Scott',
      image: 'https://cdn.sanity.io/g.jpg',
    })
  })

  it('falls back to _id when slug is missing', () => {
    expect(mapEvent(base).id).toBe('abc123')
  })

  it('renders TBA when date is missing', () => {
    // Cast through unknown: simulates a CMS record missing a date despite the type
    expect(mapEvent({ ...base, date: undefined } as unknown as SanityEvent).date).toBe('TBA')
  })

  it('falls back to placeholder image and empty support', () => {
    const e = mapEvent(base)
    expect(e.image).toBe(IMAGE_FALLBACK)
    expect(e.support).toBe('')
  })
})
