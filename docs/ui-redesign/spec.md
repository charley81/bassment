# Spec: Section Redesigns — Residents, Footer, Newsletter

**Status:** In Review

## What

Modernize three sections that feel dated or visually muddled: (1) the resident DJ carousel becomes a static, staggered grid of all residents with hover animation, (2) the footer gets a distinct darker treatment with a red accent so it reads as its own band, and (3) the index newsletter becomes a floating card so it no longer blends into the footer.

## Context

- **Residents** (`components/sections/resident-djs-client.tsx`): an Embla carousel that auto-advances every 5s, showing one DJ at a time with a circular grayscale avatar, name, description, and tag pills. Only one of 7 residents is visible at a time; autoplay is aggressive and the one-at-a-time carousel buries the lineup.
- **Footer** (`components/layout/footer.tsx`): `bg-bass-grey-dark` band with social icons, a "GET OUR NEWSLETTER" link, two link columns, a huge `BASSMENT` display wordmark, and the copyright row. The newsletter section directly above it on the index is also `bg-bass-grey-dark` — the two bands merge into one indistinct slab. The footer's warm gray (`hsl(357,16%,28%)`) reads muddy.
- **Newsletter** (`components/sections/newsletter-signup.tsx`): a full-width `bg-bass-grey-dark` band on the index, directly above the footer — same background color, so it reads as part of the footer.
- Framer Motion 13 is installed and used for `Reveal`/`Marquee`. Embla Carousel (`embla-carousel-react` 8.6.0) is used **only** in the resident DJ slider.

## Requirements

### 1. Resident DJs
- All residents visible at once (no one-at-a-time carousel, no autoplay).
- Responsive grid: 1 col mobile, 2 col tablet, 4 col desktop (7 residents = 4+3).
- Each resident: circular avatar (grayscale), name, description, tag pills — same data, same Sanity source.
- Staggered entrance via the existing `Reveal` primitive (80ms stagger per item).
- Hover: avatar shifts from grayscale to full color (drop the `grayscale` class on hover via `group-hover:grayscale-0`), subtle lift (`translateY` or scale).
- The red tint overlay on avatars stays (matches the site-wide treatment).
- Framer-motion only for the hover/entrance; no new carousel library. Remove Embla usage from this section (leave the package installed — it's a dependency, just no longer referenced here; dependency removal can be a separate chore).

### 2. Footer
- Footer background becomes the near-black `bg-bass-bg` (matches body) instead of the warm gray — clean separation from any section above it.
- Add a `border-t border-primary` (2px red top border) as the industrial accent that signals "this is the footer band."
- Keep existing content: social icons, newsletter CTA link, link columns, BASSMENT wordmark, copyright. No content changes.
- The wordmark stays as-is (already a strong display text); optionally add a subtle `text-bass-grey-dark` tone shift if it helps hierarchy — minor.

### 3. Newsletter
- The newsletter becomes a **floating card** on the dark background instead of a full-width band: centered, `max-w-[720px]`, `bg-bass-grey-dark`, `border border-bass-grey-med`, `rounded-lg`, generous padding.
- Card content unchanged: title, description, `NewsletterForm`.
- The section wrapper keeps the page's dark background (`bg-bass-bg`/transparent) with vertical padding, so the card clearly sits *on* the page, not *in* the footer.

## Design

### Residents — new grid layout
Replace the Embla carousel in `resident-djs-client.tsx` with a grid. The section is client-side (needs framer-motion `Reveal` + hover `group` classes). Structure:

```
<section class="py-20 md:py-120 px-4 lg:px-20 flex flex-col items-center gap-4">
  <p class="text-label-medium text-primary">RESIDENT</p>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
    <Reveal delay={i * 0.08}>
      <div class="group flex flex-col items-center gap-4">
        <div class="w-[180px] h-[180px] relative rounded-full overflow-hidden">
          <Image class="object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-105" />
          <div class="absolute inset-0 bg-primary/10" />
        </div>
        <h3>{dj.name}</h3>
        <p>{description}</p>
        <div class="tags">...</div>
      </div>
    </Reveal>
  </div>
</section>
```

Key changes: grid replaces carousel; remove `useEmblaCarousel`, autoplay interval, and prev/next buttons; add `group` hover classes; wrap each resident in `Reveal` with stagger.

### Footer — darker band + red top border
- `footer.tsx`: `bg-bass-grey-dark` → `bg-bass-bg`, add `border-t-2 border-primary`.
- Optionally the wordmark: `text-bass-grey-med` → keep (existing tone) or shift to `text-bass-grey-dark` for subtlety. Decision: keep current tone (`text-bass-grey-med`) — it reads fine against the darker band.

### Newsletter — floating card
- `newsletter-signup.tsx`: section becomes `py-20 md:py-120 flex justify-center px-4 lg:px-20` (transparent/dark page bg), containing a card `div` with `w-full max-w-[720px] bg-bass-grey-dark border border-bass-grey-med rounded-lg p-8 md:p-12 flex flex-col items-center gap-6 md:gap-8`. Content unchanged.

## Decisions

- **Grid over carousel for residents.** Alternatives: (a) keep Embla with framer-motion transitions — rejected: one-at-a-time hides 6 of 7 residents and autoplay is aggressive; (b) horizontal marquee of DJ cards — rejected: the site already has one marquee and a second reads as noise. A grid shows the full lineup, which is the point of a residents section. Reversible: the carousel code can be restored from git history.
- **Footer darker than the newsletter card.** The newsletter keeps the lighter `bg-bass-grey-dark`; the footer goes to near-black `bg-bass-bg`. This flips the current "two gray slabs" into "light card on dark page" — clear separation. Reversible (one class change).
- **Newsletter as a card, not a band.** Alternatives: (a) keep the band but change its color — rejected: a differently-colored band still reads as a section boundary, not a distinct CTA; (b) move the newsletter into the footer — rejected: the user wants them visually *separate*, and a card floating above the footer achieves that. Reversible.
- **Framer-motion only for new animation.** No GSAP, no new libraries. The `Reveal` primitive already exists and handles the stagger; hover effects are CSS transitions (`group-hover`). Embla stays installed but unreferenced — removing the package is a separate chore (dependency audit), not part of this spec.
- **No content/data changes.** Sanity data, Sanity queries, and `lib/data.ts` copy stay as-is. This is presentation-only.

## Invariants

- The site must build clean: `pnpm typecheck`, `pnpm lint`, `pnpm test` (90 tests) all pass.
- No Sanity schema or data changes — the site must render identically from the CMS's perspective.
- `prefers-reduced-motion` must keep everything static (Reveal already handles it).
- The carousel removal must not break any other component — Embla is only used in `resident-djs-client.tsx` (verified by grep).

## Error Behavior

- If the residents array is empty, the section returns `null` (same as today).
- If an avatar image is missing, the existing `/images/placeholder.png` fallback applies (same as today).

## Testing Strategy

- `pnpm typecheck`, `pnpm lint`, `pnpm test` (90/90) must pass — no new logic is added, so no new unit tests required per AGENTS.md (this is presentation-only; the Reveal primitive is already covered).
- Visual verification on localhost: index (newsletter card, residents grid), all pages (footer band + red border). Check mobile and desktop breakpoints.
- Hover interactions on residents: grayscale → color, lift.

## Out of Scope

- Removing the Embla package (dependency audit — separate chore).
- Any Sanity schema, data, or copy changes.
- New content for the footer (columns, links) or newsletter.
- The "more events" / event card grids — those are already done in the tablet work.
- The SoundQuote / hero sections — not part of this pass.

## Implementation order

1. `resident-djs-client.tsx` — grid + stagger + hover (biggest change)
2. `footer.tsx` — darker band + red top border
3. `newsletter-signup.tsx` — floating card
4. Verify locally at all breakpoints
