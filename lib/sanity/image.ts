/* Helpers for the projected image shape returned by our GROQ queries:
   "image": image { asset-> { _id, url }, alt } */

export interface SanityImageProjection {
  asset?: { _id: string; url: string }
  alt?: string
}

export const IMAGE_FALLBACK = '/images/placeholder.png'

export function sanityImageUrl(
  img: SanityImageProjection | null | undefined,
  fallback: string = IMAGE_FALLBACK
): string {
  return img?.asset?.url || fallback
}
