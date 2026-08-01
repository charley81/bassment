/* Shared Sanity → UI mappers (single source — was duplicated in 4+ files) */
import type { SanityEvent } from '@/lib/sanity/types'
import type { Event } from '@/lib/types'
import { sanityImageUrl } from '@/lib/sanity/image'
import { formatEventDateShort } from '@/lib/dates'

export function mapEvent(e: SanityEvent): Event {
  return {
    id: e.slug || e._id,
    title: e.title,
    date: e.date ? formatEventDateShort(e.date) : 'TBA',
    support: e.supportText || '',
    image: sanityImageUrl(e.image),
  }
}
