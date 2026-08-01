import { describe, it, expect } from 'vitest'
import { sanityImageUrl, IMAGE_FALLBACK } from './image'

describe('sanityImageUrl', () => {
  it('returns the asset url when present', () => {
    expect(sanityImageUrl({ asset: { _id: 'a', url: 'https://cdn.sanity.io/x.jpg' } }))
      .toBe('https://cdn.sanity.io/x.jpg')
  })

  it('falls back when asset or url is missing', () => {
    expect(sanityImageUrl({ asset: undefined })).toBe(IMAGE_FALLBACK)
    expect(sanityImageUrl({})).toBe(IMAGE_FALLBACK)
  })

  it('falls back for null and undefined input', () => {
    expect(sanityImageUrl(null)).toBe(IMAGE_FALLBACK)
    expect(sanityImageUrl(undefined)).toBe(IMAGE_FALLBACK)
  })

  it('honors a custom fallback', () => {
    expect(sanityImageUrl(null, '/custom.png')).toBe('/custom.png')
  })
})
