# Event System — Spec

## What

Three connected features for the event lifecycle: auto-featured next event on the home page, upcoming/past filtering on the events page, and a live countdown on event detail pages. All powered by Sanity event dates.

## Context

The site currently shows Dillinja as the featured event (hardcoded `featured: true` flag in Sanity). The events page shows all upcoming events with a tab bar that doesn't function yet. The event detail page shows static countdown numbers.

**Relevant files:**
- `app/page.tsx` — home page, renders FeaturedEvent
- `components/sections/featured-event.tsx` — uses `getFeaturedEvent()`
- `app/events/page.tsx` — events page with non-functional tabs
- `app/events/[slug]/page.tsx` — event detail page
- `lib/sanity/queries.ts` — `FEATURED_EVENT_QUERY`, `UPCOMING_EVENTS_QUERY`, `PAST_EVENTS_QUERY`
- `lib/sanity/fetch.ts` — data accessors

## Requirements

### A. Auto Next Event (Home Page)

1. The home page "Next Event" section shows the **closest upcoming event by date**, not a manually flagged one.
2. When today passes an event's date, the home page automatically shows the next one.
3. Promoters can still **override** by marking a specific event as featured (e.g., for marketing pushes).
4. Logic: if an event is marked `featured: true`, show it. Otherwise, show the event with the earliest `date >= now()`.

### B. Upcoming / Past Events (Events Page)

1. Two tabs: **Upcoming** and **Past**.
2. Upcoming: all events where `date >= now()`, sorted ascending by date.
3. Past: all events where `date < now()`, sorted descending by date.
4. Empty state for each tab when no events match.
5. Default tab is Upcoming.
6. URL reflects the active tab (e.g., `/events?filter=past`) so deep-linking works.

### C. Countdown (Event Detail Page)

1. For future events: live countdown showing days, hours, minutes, seconds until `date`.
2. For past events: static message "This event has ended."
3. Countdown updates every second client-side without full page reload.
4. Handles edge cases: event happening right now (countdown at zero), event date far in the future.

## Design

### A. Auto Next Event — How it updates

The home page is statically generated with ISR. The update path is:

```
┌────────────┐    ┌──────────────┐    ┌────────────┐
│ Sanity      │    │ Netlify       │    │ Next.js     │
│ content     │───▶│ API Route     │───▶│ ISR cache   │
│ published   │    │ /api/revalidate│   │ regenerated │
└────────────┘    └──────────────┘    └────────────┘
```

1. **Time-based ISR:** Home page has `revalidate = 3600` (1 hour). Every hour, Next.js regenerates the page and re-queries Sanity. If the previous event's date has passed, the next one surfaces.

2. **On-demand (webhook):** When a promoter publishes/updates an event in Sanity, the webhook fires → `revalidatePath('/', 'layout')` → home page regenerates immediately.

3. **Client-side navigation:** When a user navigates to the home page after the ISR cache expires, Next.js serves the stale page and regenerates in the background (stale-while-revalidate).

**Gross timing:**
- Worst case without a webhook: 1 hour after an event ends, the home page updates
- With webhook + promoter publishes a new event: instant
- Event date passes silently: picked up at next ISR interval or webhook

**Fallback query if `featured` is not set:**
```groq
*[_type == "event" && date >= now()] | order(date asc)[0]
```

**Combined logic in code:**
```ts
const featured = await getFeaturedEvent()  // fetches featured:true
const nextEvent = featured || await getNextEvent()  // fallback to closest
```

### B. Upcoming / Past — Implementation

The events page becomes a client component (or uses `searchParams`) for tab state:

```
/events              → default: upcoming tab
/events?tab=past     → past tab
```

**Approach:** Use a client component wrapper around the tab bar that controls which panel is visible. Both dataset queries run server-side (via the page or parallel async calls), and the client just toggles visibility.

```
┌──────────────────────────────────┐
│ [Upcoming]  Past                 │  ← client component (tab state)
├──────────────────────────────────┤
│                                  │
│  Event Grid (upcoming or past)   │  ← server-rendered, client-toggled
│                                  │
└──────────────────────────────────┘
```

No URL for tab state needed — simple client-side toggle. Both datasets are fetched at page load.

### C. Countdown — Implementation

Client component (`Countdown`). Receives `targetDate: string` (ISO). Uses `useState` + `setInterval(1000)` to compute remaining time.

```
┌─────────────────────────────────┐
│ 12 DAYS  08 HRS  45 MIN  22 SEC │  ← live countdown (client)
├─────────────────────────────────┤
│ This event has ended.           │  ← past event (server knows, renders static)
└─────────────────────────────────┘
```

**States:**
- `targetDate > now` → active countdown
- `targetDate <= now` → "This event has ended"  
- `targetDate` is `null/undefined` → nothing rendered

**Edge case:** `targetDate` is within 1 minute → show "Happening now" instead of countdown.

## Component Changes

| File | Action |
|---|---|
| `lib/sanity/queries.ts` | Add `NEXT_EVENT_QUERY` (closest by date) |
| `lib/sanity/fetch.ts` | Add `getNextEvent()` |
| `components/sections/featured-event.tsx` | Try featured first, fallback to next by date |
| `app/events/page.tsx` | Add tab state, fetch both lists, toggle |
| `components/event-countdown.tsx` | Create new client component |
| `app/events/[slug]/page.tsx` | Pass `date` to Countdown |

## Decisions

### D1: `featured` flag overrides auto-selection

**Choice:** `featured: true` takes precedence over chronological order.

**Why:** Promoters may want to pin a specific event for marketing regardless of its date. The auto-selection is the fallback.

**Reversible:** Yes.

### D2: Tab state is client-side only, no URL param

**Choice:** Simple `useState` toggle for upcoming/past tabs. No URL persistence.

**Why:** Avoids unnecessary URL complexity. Users rarely need to share a "past events" link. Can add `searchParams` later if needed.

**Reversible:** Yes.

### D3: Countdown is a client component

**Choice:** `'use client'` component with `setInterval`.

**Why:** Server Components can't run intervals. The countdown must update every second. Simple `useState` + `useEffect` is the lightest approach. No need for a heavy library.

**Reversible:** Yes.

### D4: Home page ISR at 1 hour

**Choice:** `revalidate = 3600` on the home page.

**Why:** Events don't change minute-to-minute. 1 hour is frequent enough for event transitions. Webhook provides instant updates when content is published.

**Reversible:** Yes, just change the number.

## Versions

No new dependencies.

## Next.js Docs Alignment

Checked against `node_modules/next/dist/docs/01-app/` (Next.js 16.2.10):

- **ISR:** Our `export const revalidate` uses the previous caching model (no `cacheComponents: true` config). This is documented and supported at `app/guides/caching-without-cache-components`. The recommended new model (`'use cache'` + `cacheLife`) would require the config flag — not worth changing for this PR.
- **Server/Client split:** Per `05-server-and-client-components.md`, the countdown uses `'use client'` for `setInterval` + `useState` while the page remains a Server Component — exactly the pattern recommended.
- **Tab state:** Client-side `useState` for tab toggle — avoids `searchParams` runtime API complexity. Documented as the correct pattern for purely presentational state.
- **Streaming:** Not used here. ISR is the right fit for event data that changes at most hourly.

## Invariants

- Home page never shows a past event as "Next Event"
- Switching tabs on events page does not trigger a full page reload
- Countdown reaches zero and transitions to "This event has ended" without negative numbers

## Testing Strategy

- `next build` passes
- Visit home page → "Next Event" shows an event with `date >= now()`
- Visit `/events` → toggle Past → shows events with `date < now()`
- Visit an event detail page for a future event → countdown ticking
- Visit an event detail page for a past event → "This event has ended"

## Out of Scope

- Ticket Fairy integration (Phase 3)
- Google Maps on event detail (Phase 3)
- Event detail sub-sections (lineup, description, related events) migration — still static
