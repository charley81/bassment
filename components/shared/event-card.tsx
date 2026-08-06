/*
 * BASSMENT — Event Card
 * Just the event artwork: full poster in its native aspect ratio,
 * rounded, with a subtle shadow for separation on the dark background.
 */
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/lib/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group relative block overflow-hidden rounded-lg shadow-[0_4px_14px_rgba(9,1,2,0.35)]"
    >
      {/* Full artwork, aspect-matched to the 768x1376 posters */}
      <div className="relative w-full aspect-[768/1376]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
    </Link>
  );
}
