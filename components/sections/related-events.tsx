/* BASSMENT — Related Events Section */
import { EventCard } from "@/components/shared/event-card";
import { getUpcomingEvents } from "@/lib/sanity/fetch";
import type { SanityEvent } from "@/lib/sanity/types";
import type { Event } from "@/lib/types";

function mapEvent(e: SanityEvent): Event {
  const img = e.image as unknown as { asset?: { url?: string } } | undefined
  return {
    id: e.slug || e._id,
    title: e.title,
    date: e.date ? new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) : 'TBA',
    support: e.supportText || '',
    image: img?.asset?.url || '/images/placeholder.png',
  }
}

export async function RelatedEvents() {
  const all = await getUpcomingEvents()
  const events = (all || []).slice(0, 3).map(mapEvent)

  if (!events.length) return null

  return (
    <div className="flex flex-col gap-6 md:gap-8 pt-16 md:pt-20">
      <h3 className="text-more-events text-bass-text">MORE EVENTS</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}
