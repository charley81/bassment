/*
 * BASSMENT — Event Card
 * White card: image on top (native colors, no tint), white bottom fade,
 * dark info strip with primary-red accents. No show title — the flyer
 * artwork carries it.
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
        h-[300px] md:h-[380px] transition-colors
        hover:bg-bass-grey-light
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

        {/* Bottom fade into the white body (no red tint) */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white z-1" />
      </div>

      {/* Info strip — dark text, red accents, no title */}
      <div className="relative z-2 px-4 md:px-5 pt-3 pb-4 md:pb-5 flex flex-col gap-2.5">
        <div className="flex justify-between items-baseline gap-3">
          <span className="text-nav font-bold text-primary">{event.date}</span>
          <span className="text-nav text-right text-bass-dark">
            {event.support}
          </span>
        </div>
        <div className="h-[3px] w-10 bg-primary" />
      </div>
    </Link>
  );
}
