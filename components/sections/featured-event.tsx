/* BASSMENT — Featured Event Section */
import Image from 'next/image'
import { getFeaturedEvent, getNextEvent } from '@/lib/sanity/fetch'
import { TicketCta } from '@/components/ticket-cta'
import { sanityImageUrl } from '@/lib/sanity/image'
import { formatEventDateUpper } from '@/lib/dates'
import { toPlainText } from '@/lib/portable-text'

export async function FeaturedEvent() {
  let event = await getFeaturedEvent()
  // Fall back to closest future event if no event is explicitly featured
  if (!event) event = await getNextEvent()

  if (!event) return null

  const imageUrl = sanityImageUrl(event.image)
  const description = event.description ? toPlainText(event.description) : ''

  return (
    <section className="py-20 md:py-120 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <h2 className="text-section-heading text-bass-white">Next event</h2>
        <div className="flex flex-col md:flex-row rounded-lg overflow-hidden">
          <div className="w-full md:w-3xl aspect-[768/1376] relative shrink-0">
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center gap-6 md:gap-8 p-6 md:p-12">
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex flex-col gap-1 md:gap-2">
                <p className="text-nav text-bass-grey-light">
                  {event.date ? formatEventDateUpper(event.date) : 'TBA'}
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
              <TicketCta status={event.ticketStatus} slug={event.slug} ticketPrice={event.ticketPrice} />
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
