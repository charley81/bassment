# Google Maps — Spec

## What

Embed an interactive Google Map on the venue page with the site's dark theme styling, a static image fallback for users without JavaScript, and the hero-style overlay tint matching the rest of the site.

## Context

The venue page currently shows a static map image. The project overview specifies Google Maps with a static fallback. Coordinates are stored in the Sanity `siteSettings` singleton (lat: 40.7071, lng: -74.0081).

## Requirements

1. Venue page shows an interactive Google Map centered on 70 Pine Street
2. Dark theme styling matches the site's visual language
3. Static image renders server-side and remains visible for no-JS users
4. Map loads on top of the static image when JavaScript is available
5. Red marker pin at venue location
6. Hero-style overlay tint (`bg-primary/10`) on top of the map
7. API key is `NEXT_PUBLIC_` prefixed (required for Maps JS API) and restricted by HTTP referrer in Google Cloud Console

## Design

```
┌─────────────────────────────────────┐
│  [ Static map image ]               │  ← server-rendered, always visible
│  [ Google Map overlay ]             │  ← client-only, loads on hydration
│  [ bg-primary/10 tint ]             │  ← overlay matching hero images
│  "70 PINE STREET, NEW YORK..."      │  ← address label
└─────────────────────────────────────┘
```

### Component Architecture

- `components/google-map.tsx` — `'use client'` component, loads Maps API via script injection, renders map + marker
- `components/sections/venue-map.tsx` — server component, renders static fallback + GoogleMap overlay
- `app/venue/page.tsx` — fetches `siteSettings` for coordinates, passes to VenueMap

### Dark Theme Map Styles

```json
[
  { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#666666' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#111111' }] },
]
```

## Decisions

### D1: Maps API loaded on demand via script injection

**Choice:** `document.createElement('script')` in `useEffect` rather than `@next/third-parties/google` or `@googlemaps/js-api-loader`.

**Why:** Avoids adding a dependency for a single component. The script loader is 20 lines of straightforward code.

**Reversible:** Yes.

### D2: Static image always rendered, map on top

**Choice:** Both elements in the DOM. Static image always visible. Google Map positioned absolutely on top.

**Why:** Graceful fallback. Static image works without JS, with cookies blocked, or if the API fails. Map replaces it visually when loaded.

**Reversible:** Yes.

### D3: API key uses `NEXT_PUBLIC_` prefix

**Choice:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in env + Netlify.

**Why:** The Maps JavaScript API key is inherently client-side — it goes in a `<script>` tag URL. HTTP referrer restriction in Google Cloud Console is the security mitigation, not hiding the key.

**Reversible:** No — this is how the API works.

## Invariants

- Map does not render without JavaScript — static image is always visible
- Coordinates come from Sanity (`siteSettings.venueLat`, `siteSettings.venueLng`)
- `@types/google.maps` installed as dev dependency for TypeScript

## Out of Scope

- Event detail page map (future)
- Multiple markers or custom info windows
- Geolocation or directions
