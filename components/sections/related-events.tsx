/* BASSMENT — Related Events Section */
import { EventCard } from "@/components/shared/event-card";
import { Reveal } from "@/components/animations/reveal";
import { getUpcomingEvents } from "@/lib/sanity/fetch";
import { mapEvent } from "@/lib/mappers";

interface Props {
  /** The event currently being viewed — excluded so it doesn't appear in the list */
  currentId?: string;
}

export async function RelatedEvents({ currentId }: Props) {
  const all = await getUpcomingEvents()
  // Drop the current event, then take the next three
  const events = (all || [])
    .filter((e) => e.slug !== currentId && e._id !== currentId)
    .slice(0, 3)
    .map(mapEvent)

  if (!events.length) return null

  return (
    <div className="flex flex-col gap-6 md:gap-8 pt-16 md:pt-20">
      <h3 className="text-more-events text-bass-text">MORE EVENTS</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {events.map((e, i) => (
          <Reveal key={e.id} delay={i * 0.08}>
            <EventCard event={e} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
