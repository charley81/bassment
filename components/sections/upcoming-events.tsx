/* BASSMENT — Upcoming Events Grid Section */
import Link from "next/link";
import { EventCard } from "@/components/shared/event-card";
import { Reveal } from "@/components/animations/reveal";
import { getUpcomingEvents } from "@/lib/sanity/fetch";
import { mapEvent } from "@/lib/mappers";

export async function UpcomingEvents() {
  const sanityEvents = await getUpcomingEvents()
  const events = (sanityEvents || []).slice(0, 4).map(mapEvent)

  return (
    <section className="py-20 md:py-120 px-4 lg:px-20">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {events.length > 0 ? (
            events.map((e, i) => (
              <Reveal key={e.id} delay={i * 0.08}>
                <EventCard event={e} />
              </Reveal>
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
