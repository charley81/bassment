/* BASSMENT — Upcoming Events Grid Section */
import Link from "next/link";
import { EventCard } from "@/components/shared/event-card";
import { getUpcomingEvents } from "@/lib/sanity/fetch";
import type { SanityEvent } from "@/lib/sanity/types";
import type { Event } from "@/lib/types";

function mapEvent(e: SanityEvent): Event {
  const img = e.image as unknown as { asset?: { url?: string } } | undefined
  return {
    id: e.slug || e._id,
    title: e.title,
    date: e.date
      ? new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
      : 'TBA',
    support: e.supportText || '',
    image: img?.asset?.url || '/images/placeholder.png',
  }
}

export async function UpcomingEvents() {
  const sanityEvents = await getUpcomingEvents()
  const events = (sanityEvents || []).slice(0, 4).map(mapEvent)

  return (
    <section className="py-20 md:py-120 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-12 md:gap-16">
        <div className="flex justify-between items-end">
          <h2 className="text-section-title text-bass-white">UPCOMING</h2>
          <Link
            href="/events"
            className="text-link text-primary hover:text-bass-white transition-colors"
          >
            View All Events →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {events.length > 0 ? (
            events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))
          ) : (
            <p className="text-body text-bass-grey-med py-12 col-span-full text-center">
              No upcoming events. Check back soon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
