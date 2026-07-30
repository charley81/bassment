# Ticket Fairy / Ticketing CTA — Spec

## What

A reusable `TicketCta` component that renders the correct call-to-action based on an event's `ticketStatus` and `ticketUrl` from Sanity. Replaces hardcoded "Get Tickets" links on the home page featured event and event detail page.

## Context

The Sanity `event` schema already has `ticketStatus` (enum: onSale, lowTickets, soldOut, atDoor, past) and `ticketUrl` (URL string). All 17 events currently have `ticketStatus: 'onSale'` and no URL set. The CTA on the featured event and event detail page is hardcoded.

The Ticket Fairy integration is a link-out pattern — promoters paste the Ticket Fairy event URL into Sanity, and the site links to it. No embedded widget, no API calls.

## Requirements

1. Component reads `ticketStatus` and `ticketUrl` from the event
2. Renders the correct UI for each status
3. Handles the "no URL set" state gracefully
4. Wired into FeaturedEvent (home page) and EventDetailHero (detail page)

### Status Mapping

| Status | UI | Behavior |
|---|---|---|
| `onSale` | "Get Tickets" primary button | Links to `ticketUrl` in new tab |
| `lowTickets` | "Low Tickets — Get Yours" pulsing button | Links to `ticketUrl` in new tab |
| `soldOut` | "Sold Out" disabled badge | Non-interactive |
| `atDoor` | "At Door Only" disabled badge | Non-interactive |
| `past` | Nothing | Component returns null |
| No URL | "Tickets Coming Soon" muted button | Non-interactive |

## Design

```
┌──────────────────────────────────────────┐
│  [Get Tickets]  [ON SALE NOW]            │  ← onSale + badge
│  [Low Tickets — Get Yours]  [LOW]        │  ← lowTickets (pulse)
│  [Sold Out]                              │  ← disabled badge
│  [Tickets Coming Soon]                   │  ← no URL set
└──────────────────────────────────────────┘
```

### Component

```
components/ticket-cta.tsx              — new, 'use client' for pulse animation only
components/sections/featured-event.tsx — replace hardcoded CTA
components/sections/event-detail-hero.tsx — replace hardcoded CTA
app/events/[slug]/page.tsx            — pass ticketStatus + ticketUrl
```

## Decisions

### D1: Link-out pattern, no embedded widget

**Choice:** Ticket Fairy URL opens in a new tab. No embedded checkout, no modal, no API calls.

**Why:** The Ticket Fairy widget/API integration is a separate scope. This is the MVP: promoters paste a URL, users click it. Simpler to build, easier to maintain, works with any ticketing platform.

**Reversible:** Yes — can layer widget/API on top later.

### D2: Pulse animation on lowTickets via Tailwind

**Choice:** `animate-pulse` class on the button.

**Why:** No additional dependencies. Simple, visible urgency cue without being distracting.

**Reversible:** Yes.

### D3: `TicketCta` is a server component for now (no 'use client')

**Choice:** The component doesn't need client-side state — the pulse animation is CSS-only via Tailwind's `animate-pulse`.

**Why:** Fewer client bundles, faster page loads. Can add 'use client' later if needed.

**Reversible:** Yes.

## Invariants

- Past events render no CTA at all
- Missing `ticketUrl` shows the placeholder, not a broken link
- Links open in new tab with `rel="noopener noreferrer"`

## Out of Scope

- Ticket Fairy API integration (checking real-time availability, webhooks)
- Embedded checkout modal or widget
- Ticket quantity selection or pricing display
