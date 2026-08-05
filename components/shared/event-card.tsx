/*
 * BASSMENT — Event Card
 * Clean white typographic tile: dark event title, grey-med date/support,
 * primary-red accent bar that expands on hover. No artwork — the flyers
 * live on the event pages.
 */
import Link from "next/link";
import type { Event } from "@/lib/types";

interface EventCardProps {
  event: Event;
  faded?: boolean;
}

export function EventCard({
  event,
  faded = false,
}: EventCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className={`
        group relative flex flex-col justify-between overflow-hidden rounded-lg
        bg-white p-5 md:p-6
        shadow-[0_4px_14px_rgba(9,1,2,0.35)]
        transition-shadow duration-300
        hover:shadow-[0_10px_28px_rgba(9,1,2,0.55)]
        h-[300px] md:h-[380px]
        ${faded ? "opacity-50" : ""}
      `}
    >
      {/* Text block — dark main text, grey-med secondary */}
      <div className="flex flex-col gap-4">
        <span className="text-heading text-bass-dark leading-tight">
          {event.title}
        </span>
        <div className="flex flex-col gap-1.5">
          <span className="text-nav text-bass-grey-med">{event.date}</span>
          <span className="text-nav text-bass-grey-med">{event.support}</span>
        </div>
      </div>

      {/* Red accent — expands on hover */}
      <div className="h-[3px] w-12 bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
