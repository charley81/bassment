/* BASSMENT — Event Detail */
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EventDetailHero } from "@/components/sections/event-detail-hero";
import { EventLineup } from "@/components/sections/event-lineup";
import { EventDescription } from "@/components/sections/event-description";
import { VenueInfoCard } from "@/components/sections/venue-info-card";
import { RelatedEvents } from "@/components/sections/related-events";
import { getEventBySlug } from "@/lib/sanity/fetch";
import type { SanityEvent } from "@/lib/sanity/types";
import type { Event } from "@/lib/types";

export const revalidate = 3600

function mapEvent(e: SanityEvent): Event {
  const img = e.image as unknown as { asset?: { url?: string } } | undefined
  return {
    id: e._id,
    title: e.title,
    date: e.date
      ? new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
      : 'TBA',
    support: e.supportText || '',
    image: img?.asset?.url || '/images/placeholder.png',
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EventDetail({ params }: Props) {
  const { slug } = await params;
  const sanityEvent = await getEventBySlug(slug)

  if (!sanityEvent) notFound()

  const event = mapEvent(sanityEvent)

  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />
      <main className="pt-200 md:pt-280 pb-20 md:pb-120 px-6 md:px-20 flex flex-col items-center">
        <div className="w-full max-w-7xl flex flex-col gap-10 md:gap-12">
          <EventDetailHero event={event} targetDate={sanityEvent.date} ticketStatus={sanityEvent.ticketStatus} ticketSlug={sanityEvent.slug} ticketPrice={sanityEvent.ticketPrice} />
          <EventLineup />
          <EventDescription />
          <VenueInfoCard />
          <RelatedEvents />
        </div>
      </main>
      <Footer />
    </div>
  );
}
