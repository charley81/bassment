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
    <section className="py-20 md:py-120 px-4 lg:px-20">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <h2 className="text-section-heading text-bass-white">Next event</h2>
        <div className="flex flex-col items-center md:flex-row md:items-stretch rounded-lg overflow-hidden">
          <div className="relative w-full max-w-[320px] md:w-[360px] md:max-w-none aspect-[768/1376] shrink-0">
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              sizes="(max-width: 767px) 320px, 360px"
              className="object-cover"
            />
          </div>
          <div className="w-full flex-1 flex flex-col justify-center gap-6 py-6 md:gap-8 md:p-10">
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
