# Sanity CMS Integration — Spec

## What

Replace all static content in `lib/data.ts` with Sanity CMS. Embed Sanity Studio at `/studio` for non-technical promoters to manage events, artists, FAQs, gallery, venue, and sound system content. Add ISR with on-demand revalidation triggered by Sanity webhooks.

## Context

Currently all site content lives in `lib/data.ts` (524 lines of hardcoded TypeScript objects). Every content change requires a code edit and redeploy. Promoters cannot manage events, artists, or FAQ items themselves. The project overview specifies Sanity as the CMS, with ISR + webhook revalidation.

**Relevant files:**
- `lib/data.ts` — current static data
- `lib/types.ts` — TypeScript interfaces for all content types
- All page components under `app/` — consume static data via direct imports
- All section components under `components/sections/` — consume static data via props
- `.pi/AGENTS.md` — tech stack and conventions
- `context/project-overview.md` — rendering strategy and integration docs

**Current state:** Next.js 16.2.10, App Router, Tailwind v4, deployed on Netlify.

## Requirements

1. **All content types** from `lib/data.ts` must be editable in Sanity Studio
2. **Sanity Studio** embedded at `/studio` route, authenticated, accessible only to project members
3. **Server Components** fetch data from Sanity using `next-sanity` client + GROQ queries
4. **ISR** with `cacheLife` profiles — events revalidate every hour, static pages every day
5. **On-demand revalidation** via Sanity webhook → Netlify API route → `revalidateTag`
6. **Images** served through Sanity's image CDN via `@sanity/image-url`
7. **API token** is server-only (`SANITY_API_READ_TOKEN`), never exposed to client
8. **Preview mode** (optional, post-launch) using `@sanity/visual-editing`
9. **Zero TypeScript errors** — all Sanity schema types map to existing TS interfaces
10. **Netlify build** must pass — the Sanity client is server-only, no client-side bundle impact

## Design

### Architecture

```
┌─────────────┐     GROQ query     ┌──────────────┐
│  Next.js     │ ◄───────────────► │  Sanity CDN   │
│  Server      │   server-side     │  (cached)     │
│  Components  │                   │               │
└──────┬───────┘                   └──────▲────────┘
       │                                  │
       │ ISR revalidate                   │ webhook on publish
       ▼                                  │
┌──────────────┐                   ┌──────┴────────┐
│  Netlify      │ ◄────────────────│  Sanity        │
│  API Route    │   POST /api/     │  Webhook       │
│              │   revalidate      │                │
└──────────────┘                   └──────▲────────┘
                                          │
                                          │ publishes content
                                          │
                                   ┌──────┴────────┐
                                   │  Sanity        │
                                   │  Studio        │
                                   │  /studio       │
                                   └───────────────┘
```

### Component Architecture

```
lib/sanity/
  client.ts          — next-sanity client (server-only)
  queries.ts         — GROQ queries for each content type
  types.ts           — generated/augmented Sanity types

app/
  (studio)/
    studio/
      [[...tool]]/
        page.tsx      — Sanity Studio (client component, loads Studio at /studio)
  layout.tsx          — base layout (unchanged)
  page.tsx            — fetches hero + featured event from Sanity
  events/page.tsx     — fetches events from Sanity
  ...

components/
  sections/           — receive typed data as props (unchanged contract)

sanity/
  schemas/            — Sanity schema definitions
    siteSettings.ts
    event.ts
    artist.ts
    faq.ts
    galleryImage.ts
    venuePage.ts
    soundSystemPage.ts
  index.ts            — exports schema array
  structure.ts        — Studio structure (singleton + list ordering)

lib/
  data.ts             — REMOVED after migration
  types.ts            — kept, updated to match Sanity schemas
```

### Data Flow

1. **Build time:** Server Components run `await client.fetch(query)` → Sanity CDN returns cached JSON → page renders. `cacheLife('hours')` for events, `cacheLife('days')` for static pages.
2. **On publish:** Sanity webhook → `POST /api/revalidate` → `revalidateTag('sanity')` → CDN cache purged, next request gets fresh data.
3. **Dev time:** `stale-if-error` ensures the site renders cached data even if Sanity is unreachable.

### File Changes

| File | Action | Purpose |
|---|---|---|
| `lib/sanity/client.ts` | Create | Server-only Sanity client |
| `lib/sanity/queries.ts` | Create | All GROQ queries |
| `lib/sanity/types.ts` | Create | Sanity document types |
| `sanity/schemas/*.ts` | Create | 7 schema files |
| `sanity/index.ts` | Create | Schema registry |
| `sanity/structure.ts` | Create | Studio structure config |
| `app/(studio)/studio/[[...tool]]/page.tsx` | Create | Studio route |
| `app/api/revalidate/route.ts` | Create | Webhook handler |
| `app/page.tsx` | Modify | Fetch from Sanity |
| `app/events/page.tsx` | Modify | Fetch from Sanity |
| `app/events/[slug]/page.tsx` | Modify | Fetch from Sanity |
| `components/sections/*.tsx` | Modify | Remove static data imports |
| All page components | Modify | Fetch from Sanity, pass as props |
| `lib/data.ts` | Delete | No longer needed |
| `lib/types.ts` | Modify | Align with Sanity schemas |
| `.env` | Modify | Already has `SANITY_API_READ_TOKEN` |
| `next.config.ts` | Modify | Add Sanity image hostname |
| `netlify.toml` | Create | Netlify config if needed |
| `package.json` | Modify | Add `next-sanity`, `@sanity/image-url`, `sanity` |

## Decisions

### D1: `next-sanity` v13 over raw `@sanity/client`

**Choice:** Use `next-sanity` v13.2.3.

**Alternatives:** Raw `@sanity/client` v7.25.0, or `@sanity/core-loader`.

**Why:** `next-sanity` provides `createClient()` with Next.js-specific defaults (App Router compatibility, draft mode helpers, `defineLive()` for preview), visual editing integration, and is the official Sanity package for Next.js.

**Reversible:** Yes — it wraps `@sanity/client`, so switching costs are low.

**Research:** Latest stable `next-sanity` is v13.2.3 (npm registry).

### D2: Server Components with `cacheLife` over `fetch` + `revalidate` option

**Choice:** Use `'use cache'` directive + `cacheLife()` in data-fetching functions.

**Alternatives:** `fetch(url, { next: { revalidate: 3600 } })`, or the old `export const revalidate = 3600`.

**Why:** Next.js 16 documentation recommends the `cacheLife` / `cacheTag` model. It gives finer control over stale/revalidate/expire windows and integrates with `revalidateTag` for on-demand invalidation.

**Reversible:** Yes — just wrapping patterns.

### D3: GROQ queries over the Sanity JavaScript API client

**Choice:** Use GROQ query strings for all data fetching.

**Why:** GROQ is more efficient for retrieving shaped data in a single request. The JS client API requires multiple chained calls for the same result. GROQ is also the pattern used in official Sanity + Next.js examples.

**Reversible:** No — changing would require rewriting all queries.

### D4: One Sanity project, one dataset (`production`) for now

**Choice:** Single Sanity project (`cp66glrr`), single `production` dataset.

**Alternatives:** Separate `development` and `production` datasets.

**Why:** Adding a dev dataset adds complexity (separate tokens, seed data, Studio switching). We can add a dev dataset later when content testing becomes a need.

**Reversible:** Yes — add dataset anytime.

### D5: Server-only token (no `NEXT_PUBLIC_`)

**Choice:** `SANITY_API_READ_TOKEN` is server-only, used only in Server Components and API routes.

**Why:** The token has read access to all content. The client never needs direct Sanity access — all data flows through Server Components. `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are public (needed for image URLs and Studio).

**Reversible:** No — exposing a read token on the client is a security issue.

### D6: Nav items and social links stay in code

**Choice:** Navigation structure and social links remain in `lib/data.ts` (or a config file). Only content managed in Sanity.

**Why:** The user confirmed "fixed, keep in code." Navigation structure changes are infrequent and a developer concern.

## Schemas

### `siteSettings` (singleton)

| Field | Type | Validation | Notes |
|---|---|---|---|
| siteName | string | required | |
| newsletterTitle | string | | "GET EARLY ACCESS" |
| newsletterDescription | text | | Signup copy |
| newsletterPlaceholder | string | | "your@email.com" |
| newsletterDisclaimer | string | | "Unsubscribe at any time" |
| venueAddress | string | | For maps |
| venueLat | number | | |
| venueLng | number | | |

### `event`

| Field | Type | Validation | Notes |
|---|---|---|---|
| title | string | required | |
| slug | slug (source: title) | required, unique | |
| date | datetime | required | Core for countdown + filtering |
| doorsOpen | datetime | | |
| supportText | string | | Fallback text if no artist refs |
| lineup | array(ref → artist) | | References to artist docs |
| description | block content | | Rich text |
| image | image + alt | required | |
| ticketUrl | url | | Ticket Fairy link |
| ticketStatus | string (list) | required | onSale, lowTickets, soldOut, atDoor, past |
| featured | boolean | | Only one should be featured |
| badge | string | | "ON SALE NOW", "LOW TICKETS", etc. |

### `artist`

| Field | Type | Validation | Notes |
|---|---|---|---|
| name | string | required, unique | |
| slug | slug (source: name) | required, unique | |
| role | string (list) | required | resident, guest |
| description | block content | | Rich text bio |
| tags | array(string) | | "Jungle", "Amen", "Techstep" |
| image | image + alt | required | |
| instagram | url | | |
| soundcloud | url | | |

### `faq`

| Field | Type | Validation | Notes |
|---|---|---|---|
| question | string | required | |
| answer | block content | required | Rich text |
| order | number | required | Sort order |

### `galleryImage`

| Field | Type | Validation | Notes |
|---|---|---|---|
| image | image + alt | required | |
| size | string (list) | required | tall, short |
| order | number | required | |

### `venuePage` (singleton)

| Field | Type | Validation |
|---|---|---|
| heroHeadline | string | required |
| heroSubtitle | string | |
| heroImage | image | required |
| historyLabel | string | |
| historyBody | block content | |
| stats | array({ value: string, label: string }) | |
| photoGrid | array(image) | |
| mapFallbackImage | image | |
| ctaLabel | string | |

### `soundSystemPage` (singleton)

| Field | Type | Validation |
|---|---|---|
| heroImage | image | required |
| heroEyebrow | string | |
| heroHeadline | string | required |
| heroQuote | string | |
| heroDescription | string | |
| historyLabel | string | |
| historyBody | block content | |
| historyImage | image | |
| specs | array({ value: string, label: string }) | |
| subwayQuote | string | |
| subwayImage | image | |
| ctaLabel | string | |

## Versions

| Package | Version | Source |
|---|---|---|
| `next-sanity` | 13.2.3 | npm registry (latest) |
| `sanity` | 6.7.0 | npm registry (latest) |
| `@sanity/image-url` | latest stable | peer dep of next-sanity |
| `next` | 16.2.10 | package.json |
| `react` | 19.2.4 | package.json |

## Invariants

- `SANITY_API_READ_TOKEN` never appears in client bundles — verify with `grep -r SANITY_API_READ_TOKEN .next/static/`
- All existing TypeScript types in `lib/types.ts` have corresponding Sanity schemas
- Netlify build must pass after migration — no build failures
- Home page "next event" query returns the correct event (closest future date)
- All images continue to render at correct sizes

## Error Behavior

- **Sanity unreachable:** Server Component should catch fetch errors and render a fallback. Use `try/catch` in data-fetching functions, return empty arrays for lists, placeholder content for singletons.
- **Missing image:** Sanity image URL returns a placeholder or null → `Image` component handles with fallback.
- **Empty state:** Lists (events, FAQs, gallery) render an appropriate empty state message.
- **Webhook failure:** Sanity webhook to Netlify fails → stale cache serves until manual redeploy or `cacheLife` expiry.

## Testing Strategy

- `next build` passes with zero errors
- `npm run dev` renders all pages from Sanity data
- `npm run lint` passes
- Manual: Sanity Studio loads at `/studio`
- Manual: Edit content in Sanity → publish → verify page updates after webhook revalidation
- Manual: Verify `SANITY_API_READ_TOKEN` is not in `.next/static/` bundle

## Out of Scope

- Visual editing / live preview (`@sanity/visual-editing`)
- Draft mode / preview URLs
- Dev dataset / content sandbox
- Sanity Scheduled Publishing
- Migration of existing static data (manual entry or a seed script — TBD)
