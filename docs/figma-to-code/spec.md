# UI Refinement Spec

**Feature slug**: `ui-refinement`
**Source**: Design audit of Figma-to-code v1-latest prototype

## What

Refine the BASSMENT prototype from a desktop-only hardcoded wireframe into a pixel-perfect, responsive, interactive site. Replace inline styles with semantic CSS utilities, migrate static markup to shadcn components, add form validation and email forwarding, and centralize all data ahead of the Sanity CMS integration.

## Context

The current prototype has 10 pages and 55 Figma-exported images. It builds and runs but:
- Uses raw Tailwind classes and hardcoded hex colors everywhere instead of the 40+ semantic typography utilities and CSS variables already defined in `globals.css`
- Data is scattered inline across pages rather than in `lib/data.ts`
- Forms and accordions are static markup without validation or interactivity
- Hero image red overlays aren't rendering
- Venue photo grid images aren't displaying
- No responsive breakpoints exist — everything is fixed at 1728px

The site will eventually integrate Sanity CMS. The data strategy must preserve that migration path.

## Requirements

1. **Zero hardcoded colors.** Every color in every component must reference a CSS custom property from `globals.css`. No `text-white`, `bg-[#090102]`, `bg-[#333]`, etc.
2. **Semantic typography everywhere.** Every text element must use a `.text-*` utility class from `@layer utilities` in `globals.css`. No raw Tailwind font-size/weight/line-height combinations.
3. **Single data source.** All page content (events, FAQ items, venue stats, gallery images, sound specs, nav links, form fields, social links) lives in `lib/data.ts` with TypeScript interfaces. Pages import and render data only — no hardcoded text.
4. **Hero red overlays render correctly** on home, sound system, and venue pages. The overlay must layer between the image and the text content in z-order.
5. **Venue "Space Today" photo grid shows all 6 images** in the 2×3 layout.
6. **FAQ page uses shadcn Accordion** with expand/collapse interaction.
7. **Resident DJ section uses shadcn Carousel** with working arrows, dots, and all 7 DJs from Figma (DJ Storm, Lemon D, Doc Scott, Flight, Mantra, Double O, Ant TC1).
8. **Contact form uses react-hook-form + zod + shadcn Form components** following the pattern from https://ui.shadcn.com/docs/forms/react-hook-form. Fields: Full Name (required), Email Address (required, valid email), Message (required, min 10 chars).
9. **Newsletter form uses react-hook-form + zod + shadcn Form components.** Single field: email (required, valid email). Shows success/error toast via shadcn Sonner.
10. **Both forms forward submissions via Resend** to the site owner's email. Server actions handle the Resend API call. Success/error states communicated via toast.
11. **Responsive.** All 10 pages work at 375px, 768px, 1440px, and 1728px widths without horizontal overflow. Header collapses to hamburger on mobile. Event grids, venue split, gallery masonry, and footer all stack or adapt.
12. **Footer BASSMENT text renders at Figma size** — 128px ExtraBold uppercase in grey-med color, using the `.text-display` utility class.
13. **No dead code.** Unused exports from `lib/data.ts` and unused `components/shared/event-card.tsx` are either integrated or removed.

## Design

### Color Tokens

Add two tokens to `globals.css` `@theme inline`:
- `--color-bass-black: hsl(0, 0%, 0%)` — used by pages with `#000000` background (events, detail, sound, venue)
- `--color-bass-bg: hsl(351, 80%, 2%)` — used by pages with `#090102` background (home, gallery, faq, contact, 404)

Pages reference these as `var(--color-bass-black)` / `var(--color-bass-bg)`.

### Typography Mapping

Replace raw Tailwind combinations with semantic classes. Key mappings:

| Raw | Semantic |
|-----|----------|
| `text-[128px] font-extrabold leading-none uppercase text-center` | `text-display` |
| `text-[128px] font-extrabold leading-none` | `text-hero` |
| `text-[72px] font-extrabold` | `text-h1` |
| `text-[64px] font-extrabold leading-none` | `text-h2` |
| `text-[56px] font-extrabold uppercase` | `text-h3` |
| `text-[48px] font-bold uppercase` | `text-section-heading` |
| `text-[48px] font-bold` | `text-section-title` |
| `text-[48px] font-extrabold leading-tight` | `text-h5` |
| `text-[36px] font-bold` | `text-subtitle` |
| `text-[36px] font-bold text-center` | `text-subtitle-center` |
| `text-[30px] font-bold uppercase` | `text-heading` |
| `text-[30px] font-extrabold` | `text-stat` |
| `text-[28px] font-bold` | `text-artist-name` |
| `text-[28px] font-extrabold` | `text-more-events` |
| `text-base font-bold` | `text-btn` |
| `text-base font-medium uppercase` | `text-label-medium` |
| `text-base leading-relaxed` | `text-body` |
| `text-base leading-6` | `text-body-sm` |
| `text-base font-bold uppercase` | `text-label` |
| `text-base font-medium` | `text-btn-ghost` |
| `text-base underline` | `text-link` |
| `text-sm` | `text-caption` |
| `text-xl leading-7` | `text-quote` |
| `text-lg leading-7` | `text-body-large` |
| `text-lg font-bold` | `text-body-bold` |
| `text-base font-normal` | `text-nav` |

Color classes (`text-bass-white`, `text-bass-grey-light`, `text-bass-grey-med`, `text-bass-text`, `text-bass-muted`) are applied as separate classes alongside typography classes.

### Data Architecture

```typescript
// lib/data.ts — single source of truth

interface Event { id: string; title: string; date: string; support: string; image: string; }
interface FaqItem { question: string; answer: string; }
interface VenueStat { value: string; label: string; }
interface NavItem { label: string; href: string; }
interface GalleryImage { src: string; }
interface SoundSpec { value: string; label: string; }
interface ResidentDj { name: string; description: string; tags: string[]; image: string; }
interface HomeData { hero: {...}; featuredEvent: {...}; upcomingEvents: Event[]; venue: {...}; residentDjs: ResidentDj[]; newsletter: {...}; }
// ... etc for each page

export const homeData: HomeData = { ... };
export const eventsData: Event[] = [ ... ];
// etc.
```

Pages import the typed data objects and map over them.

### Hero Overlay Fix

Current (broken):
```tsx
<Image src="..." fill className="object-cover" />
<div className="absolute inset-0 bg-[var(--color-primary)]/10" />
```

The overlay div must render **after** the Image. Next.js Image with `fill` creates a positioned element. The fix ensures proper stacking:
```tsx
<div className="relative h-[900px]">
  <Image src="..." fill className="object-cover" />
  <div className="absolute inset-0 bg-[var(--color-primary)]/10 z-[1]" />
  <div className="relative z-[2] ...">content</div>
</div>
```

### File Changes

```
Modified:
  app/globals.css                     — add --color-bass-black, --color-bass-bg tokens
  app/layout.tsx                      — any font adjustments needed
  app/page.tsx                        — full rewrite with semantic classes, data imports, carousel
  app/events/page.tsx                 — typography + data migration
  app/events/[slug]/page.tsx          — typography + data migration
  app/sound-system/page.tsx           — typography + data migration + overlay fix
  app/venue/page.tsx                  — typography + data + image fix + overlay fix
  app/gallery/page.tsx                — typography + data migration
  app/faq/page.tsx                    — accordion migration
  app/contact/page.tsx                — form migration
  app/not-found.tsx                   — typography migration
  components/layout/header.tsx        — typography + responsive hamburger
  components/layout/footer.tsx        — use .text-display class
  lib/data.ts                         — complete rewrite with all page data

Created:
  components/forms/contact-form.tsx   — react-hook-form + zod + shadcn
  components/forms/newsletter-form.tsx — react-hook-form + zod + shadcn
  app/actions/contact.ts             — Resend server action
  app/actions/newsletter.ts          — Resend server action

Installed:
  react-hook-form, @hookform/resolvers, zod, resend, sonner
  shadcn: carousel, form, textarea, sonner, sheet (mobile nav)
```

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| **Data strategy** | `lib/data.ts` as single source | Typed, single-file swap to Sanity later. Avoids hunting inline data across 10 pages. |
| **Typography approach** | Use existing `@layer utilities` classes + compose color separately | Keeps typography and color concerns separate. Matches Figma where text style and fill are independent variables. |
| **Home page color token** | `--color-bass-bg` not `--color-bass-dark` | `--color-bass-dark` already set to `#090102`. Home, gallery, faq, contact, 404 all use this. Differentiate only the pure black `--color-bass-black` for events/detail/sound/venue pages. |
| **Carousel library** | shadcn Carousel (embla-carousel-react) | User requested shadcn slider. shadcn Carousel is the built-in option. |
| **Form library** | react-hook-form + zod | User specified. Industry standard for Next.js + shadcn forms. |
| **Email service** | Resend | User specified. Simple API, good Next.js integration via server actions. |
| **EventCard component** | Integrate into pages rather than delete | Event cards appear on home, events, and detail pages. Worth keeping as shared component. |
| **Mobile nav** | shadcn Sheet (drawer) | Simple, accessible, matches shadcn patterns. |
| **Color reference style** | `var(--color-bass-*)` for bass tokens, `var(--color-*)` for shadcn tokens | Bass tokens are direct HSL values; shadcn tokens are CSS variables that shadcn components already reference. |

## Versions

| Dependency | Version | Source |
|-----------|---------|--------|
| Next.js | 16.2.10 | package.json |
| React | 19.2.4 | package.json |
| Tailwind CSS | 4 | package.json |
| shadcn/ui | latest | npx shadcn@latest |
| react-hook-form | ^7.54 | npm (latest stable) |
| zod | ^3.23 | npm (latest stable) |
| @hookform/resolvers | ^3.9 | npm (latest stable) |
| resend | ^4.1 | npm (latest stable) |
| sonner | ^1.7 | npm (latest stable) |
| embla-carousel-react | ^8.5 | npm (shadcn carousel dependency) |

## Invariants

1. **Build must pass with zero errors and zero warnings** at every phase boundary.
2. **All 10 routes must still generate** — no route regressions.
3. **All 55 images must still render** — no broken image paths.
4. **Visual output must match Figma** at 1728px — typography, colors, spacing unchanged from current correct state.
5. **No hardcoded colors remain** — verified by `rg "text-white|bg-white|bg-\[#|text-\[#" app/` returning zero results.
6. **No raw typography remains** — verified by `rg "text-\[[0-9]+px\]|text-sm|text-xl|text-lg|font-bold|font-extrabold|font-medium|font-normal|leading-\[|uppercase" app/` returning only class definitions, not usage.

## Error Behavior

- **Image load failure**: Next.js Image shows alt text. The overlay and placeholder content render normally.
- **Form validation failure**: Fields show inline error messages via shadcn FormMessage. Submit button remains enabled so the user can correct and retry.
- **Resend API failure**: Server action returns error. Toast shows `Failed to send. Please try again.` The form retains submitted values.
- **Resend API key missing**: Build-time warning in server action. At runtime, form submission returns a generic error toast.
- **Carousel JS failure**: Fallback to static display of first DJ. No crash.

## Testing Strategy

1. **Build check**: `npm run build && npm run lint` — zero errors, zero warnings.
2. **Hardcoded color grep**: `rg "text-white|bg-white|bg-\[#|text-\[#" app/` — zero results.
3. **Hardcoded typography grep**: `rg "text-\[[0-9]+px\]|font-bold|font-extrabold|uppercase" app/` — zero results in page files.
4. **Visual verification (per page at 1728px)**:
   - Check hero overlays render with red tint
   - Check venue photo grid shows 6 images
   - Check footer BASSMENT matches Figma (128px, ExtraBold, uppercase)
   - Check accordion expands/collapses on FAQ page
   - Check carousel arrows cycle through DJs
5. **Form validation**: Submit empty forms — verify error messages. Submit invalid email — verify error. Submit valid data — verify success toast.
6. **Responsive**: Resize to 375px, 768px, 1440px, 1728px. Check no horizontal overflow on any page. Check hamburger menu on mobile.

## Out of Scope

- Sanity CMS integration (future phase)
- Ticket Fairy ticketing integration
- Framer Motion / GSAP animations
- Image optimization pipeline (beyond Next.js Image defaults)
- SEO metadata refinement
- Analytics
- Dark/light mode toggle (site is dark-only per design)
- Actual email templates for Resend (use plain text for now)
