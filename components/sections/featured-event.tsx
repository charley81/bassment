/* BASSMENT — Featured Event Section */
import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedEvent, getNextEvent } from '@/lib/sanity/fetch'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).toUpperCase()
}

function toPlainText(blocks: unknown): string {
  if (typeof blocks === 'string') return blocks
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b: { _type?: string }) => b._type === 'block')
    .flatMap((b: { children?: { text?: string }[] }) =>
      b.children?.map((c) => c.text ?? '').join('') ?? []
    )
    .join(' ')
}

export async function FeaturedEvent() {
  let event = await getFeaturedEvent()
  // Fall back to closest future event if no event is explicitly featured
  if (!event) event = await getNextEvent()

  if (!event) return null

  const img = event.image as unknown as { asset?: { url?: string } } | undefined
  const imageUrl = img?.asset?.url || '/images/placeholder.png'
  const description = event.description ? toPlainText(event.description) : ''

  return (
    <section className="py-20 md:py-120 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <h2 className="text-section-heading text-bass-white">Next event</h2>
        <div className="flex flex-col md:flex-row rounded overflow-hidden">
          <div className="w-full md:w-3xl h-[400px] md:h-[1028px] relative shrink-0">
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center gap-6 md:gap-8 p-6 md:p-12">
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex flex-col gap-1 md:gap-2">
                <p className="text-nav text-bass-grey-light">
                  {event.date ? formatDate(event.date) : 'TBA'}
                </p>
                <h3 className="text-subtitle text-bass-white">
                  {event.title}
                </h3>
              </div>
              <p className="text-nav text-primary">{event.supportText}</p>
              <p className="text-body text-bass-grey-light">
                {description}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <Link href={`/events/${event.slug || ''}`} className="inline-flex h-14 items-center justify-center rounded-none bg-primary text-btn text-bass-white w-fit transition-colors hover:bg-primary/80 px-6">
                Get Tickets
              </Link>
              {event.badge && (
                <span className="inline-flex h-8 px-3 items-center rounded-full bg-bass-grey-dark border border-bass-grey-light text-label text-bass-grey-light">
                  {event.badge}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
