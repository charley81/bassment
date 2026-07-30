/* BASSMENT — Event Detail Hero Section */
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { eventDetailData } from "@/lib/data";
import { Countdown } from "@/components/event-countdown";
import { TicketCta } from "@/components/ticket-cta";

interface EventDetailHeroProps {
  event: Event;
  targetDate?: string;
  ticketStatus?: string;
  ticketSlug?: string;
  ticketPrice?: number;
}

export function EventDetailHero({ event, targetDate, ticketStatus, ticketSlug, ticketPrice }: EventDetailHeroProps) {
  return (
    <>
      <Link
        href="/events"
        className="text-nav text-bass-grey-light hover:text-bass-white transition-colors"
      >
        {eventDetailData.backLabel}
      </Link>

      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="w-full md:w-[739px] h-[500px] md:h-[990px] relative shrink-0">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-6 md:gap-8 flex-1">
          <div className="flex flex-col gap-6 md:gap-8">
            <h1 className="text-h5 text-bass-white">
              {event.title.toUpperCase()}
            </h1>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                {eventDetailData.setTimes.map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <span className="text-btn text-bass-grey-light">
                      {s.label}
                    </span>
                    <span className="text-nav text-bass-grey-med">
                      {s.time}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="border-bass-border" />
            </div>
            <p className="text-btn text-bass-grey-med">
              {eventDetailData.dateLine}
            </p>
            {targetDate && <Countdown targetDate={targetDate} />}
          </div>
          <div className="flex flex-col gap-4">
            <TicketCta status={ticketStatus} slug={ticketSlug} ticketPrice={ticketPrice} />
            <span className="inline-flex self-start px-3 py-1.5 rounded-full bg-bass-dark border border-bass-grey-med text-label text-bass-grey-med">
              {eventDetailData.badge}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
