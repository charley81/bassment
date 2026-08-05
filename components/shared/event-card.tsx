/*
 * BASSMENT — Event Card
 * White card with flyer artwork on top (native color, white bottom fade),
 * dark main text, grey-med secondary text, and a primary-red accent bar
 * that expands on hover.
 */
import Image from "next/image";
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
        group relative flex flex-col overflow-hidden rounded-lg bg-white
        shadow-[0_4px_14px_rgba(9,1,2,0.35)]
        transition-shadow duration-300
        hover:shadow-[0_10px_28px_rgba(9,1,2,0.55)]
        h-[300px] md:h-[380px]
        ${faded ? "opacity-50" : ""}
      `}
    >
      {/* Event image — flyer artwork keeps its native color */}
      <div className="relative flex-1 min-h-0">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Bottom fade into the white body — hugs just above the date */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-white z-1" />
      </div>

      {/* Info strip — dark main text, grey-med secondary, red accent */}
      <div className="relative z-2 px-4 md:px-5 pt-3 pb-4 md:pb-5 flex flex-col gap-2.5">
        <div className="flex justify-between items-baseline gap-3">
          <span className="text-nav font-bold text-bass-dark">{event.date}</span>
          <span className="text-nav text-right text-bass-grey-med">
            {event.support}
          </span>
        </div>
        <div className="h-[3px] w-12 bg-primary transition-all duration-300 group-hover:w-full" />
      </div>
    </Link>
  );
}
