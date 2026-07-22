/*
 * ═══════════════════════════════════════════════════════════
 * BASSMENT — Event Card
 * Source: Figma node "event-card" #85:67
 * Layout: layout_6a9038f7
 *   mode: column
 *   alignItems: stretch
 *   sizing: fixed 296×380 (home) / 405×380 (events)
 *   borderRadius: 4px (wireframe) / 8px (hi-fi: layout_cd275c26)
 *
 * Structure:
 *   1. card-bg (absolute, 0,0) — 296×380, fill #333333
 *   2. gradient-overlay (absolute, 0,200) — 296×180, linear-gradient
 *   3. text-overlay (absolute, 0,260) — 20px padding, gap 6px
 *      - Title: style_d3c3a0bb (Bold 700, 30px, UPPERCASE)
 *      - Date: style_8a69d696 (Regular 400, 16px)
 *      - Support: style_8a69d696 (Regular 400, 16px, muted)
 * ═══════════════════════════════════════════════════════════
 */

import Link from "next/link";
import type { Event } from "@/lib/data";

interface EventCardProps {
  event: Event;
  variant?: "home" | "events";
  faded?: boolean;
}

export function EventCard({
  event,
  variant = "home",
  faded = false,
}: EventCardProps) {
  const isHome = variant === "home";

  return (
    <Link
      href={`/events/${event.id}`}
      className={`
        group relative flex flex-col overflow-hidden rounded-lg
        ${isHome ? "h-[380px] w-[296px]" : "h-[380px] w-[405px]"}
        ${faded ? "opacity-50" : ""}
      `}
    >
      {/* Card background — fill #333333 */}
      <div className="absolute inset-0 bg-bass-card" />

      {/* Placeholder for image — shows music note */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-note text-bass-muted">♪</span>
      </div>

      {/* Gradient overlay — from transparent to 85% black */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[180px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Text overlay — positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-5 flex flex-col gap-1.5 z-10">
        {/* Event title — style_d3c3a0bb: Bold 700, 30px, UPPERCASE */}
        <span className="text-heading text-bass-text leading-tight">
          {event.title}
        </span>

        {/* Date & support row — style_8a69d696 */}
        <div className="flex justify-between items-center">
          <span className="text-nav text-bass-muted">{event.date}</span>
          <span className="text-nav text-bass-muted">{event.support}</span>
        </div>
      </div>
    </Link>
  );
}
