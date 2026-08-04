/*
 * BASSMENT — Event Card
 * Source: Figma node "event-card" #85:67
 * Responsive: fills grid column width, fixed heights
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
        group relative flex flex-col overflow-hidden rounded-lg
        h-[300px] md:h-[380px]
        ${faded ? "opacity-50" : ""}
      `}
    >
      {/* Event image */}
      <Image
        src={event.image}
        alt={event.title}
        fill
        className="object-cover grayscale"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />

      {/* Primary tint overlay */}
      <div className="absolute inset-0 bg-primary/10 z-1" />

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-[180px] z-1 bg-gradient-to-b from-transparent to-black/85" />

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-5 flex flex-col gap-1.5 z-2">
        <span className="text-heading text-bass-white leading-tight">
          {event.title}
        </span>
        <div className="flex justify-between">
          <span className="text-nav text-bass-grey-light">{event.date}</span>
          <span className="text-nav text-bass-grey-light">{event.support}</span>
        </div>
      </div>
    </Link>
  );
}
