/* BASSMENT — Related Events Section */
import { EventCard } from "@/components/shared/event-card";
import { getUpcomingEvents } from "@/lib/sanity/fetch";
import { mapEvent } from "@/lib/mappers";


export async function RelatedEvents() {
  const all = await getUpcomingEvents()
  const events = (all || []).slice(0, 3).map(mapEvent)

  if (!events.length) return null

  return (
    <div className="flex flex-col gap-6 md:gap-8 pt-16 md:pt-20">
      <h3 className="text-more-events text-bass-text">MORE EVENTS</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}
