/* BASSMENT — Event Detail Hero Section */
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { eventDetailData } from "@/lib/data";
import { Countdown } from "@/components/event-countdown";
import { TicketCta } from "@/components/ticket-cta";
import { formatEventDateLong, formatEventTime } from "@/lib/dates";

interface EventDetailHeroProps {
  event: Event;
  targetDate?: string;
  doorsOpen?: string;
  badge?: string;
  ticketStatus?: string;
  ticketSlug?: string;
  ticketPrice?: number;
}

export function EventDetailHero({ event, targetDate, doorsOpen, badge, ticketStatus, ticketSlug, ticketPrice }: EventDetailHeroProps) {
  const details = [
    targetDate && { label: 'DATE', value: formatEventDateLong(targetDate) },
    doorsOpen && { label: 'DOORS', value: formatEventTime(doorsOpen) },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <>
      <Link
        href="/events"
        className="text-nav text-bass-grey-light hover:text-bass-white transition-colors"
      >
        {eventDetailData.backLabel}
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-center gap-8 md:gap-12">
        <div className="w-full md:w-[739px] aspect-[768/1376] relative shrink-0 rounded-lg overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 739px"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-6 md:gap-8 flex-1">
          <div className="flex flex-col gap-6 md:gap-8">
            <h1 className="text-h5 text-bass-white">
              {event.title.toUpperCase()}
            </h1>
            {details.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-12">
                  {details.map((d) => (
                    <div key={d.label} className="flex flex-col gap-1">
                      <span className="text-btn text-bass-grey-light">
                        {d.label}
                      </span>
                      <span className="text-nav text-bass-grey-med">
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>
                <hr className="border-bass-border" />
              </div>
            )}
            {targetDate && <Countdown targetDate={targetDate} />}
          </div>
          <div className="flex flex-col gap-4">
            <TicketCta status={ticketStatus} slug={ticketSlug} ticketPrice={ticketPrice} />
            {badge && (
              <span className="inline-flex self-start px-3 py-1.5 rounded-full bg-bass-dark border border-bass-grey-med text-label text-bass-grey-med">
                {badge}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
