# UI Refinement Plan

**Source**: Audit of current Figma-to-code v1-latest prototype (10 pages, 55 images)
**Goal**: Pixel-perfect, maintainable, responsive, no hardcoded values

## Decision: Data Strategy

**Go with `lib/data.ts` as single source of truth.** Knowing Sanity CMS is coming later, a typed data file is the right call:
- All page content in one typed file makes the Sanity migration a single-file swap later
- Pages stay clean — data shape matches Sanity schemas
- Avoids inline data scattered across 10 pages that would need hunting down later

---

## Phase 1: Foundation — Colors, Typography & Data

**Goal**: Zero hardcoded colors, all pages use semantic typography utilities, single data source

### Task 1: Add missing CSS color tokens

- **Context**: Pages use `text-white`, `bg-[#090102]`, `bg-[#333]`, `text-[#EEE]`, `bg-white`, `text-[#090102]` directly
- **Files**: `app/globals.css`
- **Approach**: Add `--color-bass-black` (pure `#000000` for events/detail/sound/venue pages) and `--color-bass-bg` (`#090102` for home/gallery/faq/contact). Already have `--color-bass-white`, `--color-bass-text`, etc. Ensure all variants exist.
- **Acceptance**: `rg "text-white|bg-white|bg-\[#|text-\[#" app/` returns zero results
- **Verify**: `npm run build && npm run lint`

### Task 2: Replace raw Tailwind typography with semantic utility classes

- **Context**: 40+ `.text-hero`, `.text-body`, `.text-heading` etc. defined in `globals.css` `@layer utilities` but zero pages use them
- **Files**: All `app/**/page.tsx`, `components/**/*.tsx`
- **Approach**: Replace every `text-[128px] font-extrabold leading-none text-white` with `text-hero text-bass-white`, `text-[36px] font-bold` with `text-subtitle`, etc. Map each Figma style to its utility class.
- **Acceptance**: Typography is consistent across pages; visual output unchanged
- **Verify**: `npm run build && npm run lint`, visual comparison to Figma

### Task 3: Centralise all page data into `lib/data.ts`

- **Context**: Each page defines its own inline data objects. `lib/data.ts` has typed interfaces but isn't used.
- **Files**: `lib/data.ts`, all page files
- **Approach**: Move all events, FAQ items, venue stats, gallery images, contact form fields, sound specs into `lib/data.ts` with proper TypeScript interfaces. Pages import and render only.
- **Acceptance**: Pages contain zero hardcoded text strings (except aria-labels/alt text)
- **Verify**: `npm run build && npm run lint`, all pages render same content

---

## Phase 2: Components — Fixes & shadcn Migration

**Goal**: Shared components used everywhere, shadcn for accordions/forms/slider, broken things fixed

### Task 4: Fix hero image red overlays

- **Context**: User reports red overlay `rgba(211,31,40,0.1)` isn't rendering on hero images. Current code uses `bg-[var(--color-primary)]/10` which should work but may be positioned behind the image
- **Files**: `app/page.tsx`, `app/sound-system/page.tsx`, `app/venue/page.tsx`
- **Approach**: Ensure overlay div is **after** the Image in DOM order and has `absolute inset-0 z-[1]`. Image should fill the container. Content sits above with `z-[2]`.
- **Acceptance**: Red tint visible over hero images on home, sound, and venue pages
- **Verify**: Visual check — hero images have visible red tint matching Figma

### Task 5: Fix venue "Space Today" images not showing

- **Context**: Venue photo grid images exist at correct paths but may not render due to container sizing
- **Files**: `app/venue/page.tsx`
- **Approach**: Verify image paths match public directory. Add explicit `relative w-full h-full` containers with `sizes` prop on Next.js Image for proper responsive loading. Debug if needed by adding temp border to containers.
- **Acceptance**: All 6 venue photos render in the 2×3 grid
- **Verify**: `npm run build`, visual check

### Task 6: Migrate FAQ to shadcn Accordion

- **Context**: Current FAQ is static inline markup with +/− symbols. Should be interactive shadcn Accordion.
- **Files**: `app/faq/page.tsx`
- **Approach**: Replace static FAQ list with `<Accordion type="single" collapsible>`. Each FAQ item becomes an `<AccordionItem>` with `<AccordionTrigger>` (question) and `<AccordionContent>` (answer). Wire data from `lib/data.ts`.
- **Acceptance**: Clicking questions expands/collapses answers with smooth animation
- **Verify**: `npm run build`, visual check

### Task 7: Replace Resident DJ carousel with shadcn Carousel

- **Context**: Current DJ section has static dots and non-functional arrows. User wants shadcn slider.
- **Files**: `app/page.tsx`
- **Approach**: Install `npx shadcn@latest add carousel`. Wire with resident DJ data (add remaining DJs from Figma: Lemon D, Doc Scott, Flight, Mantra, Double O, Ant TC1). Arrows and dots use shadcn Carousel controls.
- **Acceptance**: Arrows cycle through DJs, dots show position, auto-advance optional
- **Verify**: `npm run build`, visual check

### Task 8: Build contact + newsletter forms with react-hook-form + zod + shadcn

- **Context**: Both forms are static markup. User wants proper form handling following https://ui.shadcn.com/docs/forms/react-hook-form
- **Files**: `app/contact/page.tsx`, `app/page.tsx` (newsletter section)
- **Approach**: Install `react-hook-form @hookform/resolvers zod`. Create `components/forms/newsletter-form.tsx` and `components/forms/contact-form.tsx`. Use shadcn Form, Input, Textarea. Define zod schemas. Wire submit handlers (console.log for now — Resend integration is next task).
- **Acceptance**: Forms validate on submit, show error messages, prevent empty/invalid submission
- **Verify**: `npm run build && npm run lint`, test form validation

### Task 9: Integrate Resend for email forwarding

- **Context**: Form submissions should forward to personal email via Resend
- **Files**: `app/actions/contact.ts`, `app/actions/newsletter.ts`, forms
- **Approach**: Install `resend`. Create server actions that call Resend API. Wire to form `onSubmit`. Add success/error toast with shadcn Sonner. Use `RESEND_API_KEY` env var.
- **Acceptance**: Submitting contact form sends email; newsletter signup sends confirmation
- **Verify**: Submit forms, check email delivery, check error handling

---

## Phase 3: Responsive Design

**Goal**: All pages work at 375px, 768px, 1440px, 1728px without horizontal overflow

### Task 10: Add responsive breakpoints to all pages

- **Context**: All pages hardcoded at desktop widths. Container widths, padding, font sizes, and grid layouts need responsive variants.
- **Files**: All `app/**/page.tsx`, `components/layout/*.tsx`
- **Approach**:
  - Header: hamburger menu on mobile, stacked nav
  - Hero: `clamp()` font sizes already in utilities, adjust padding
  - Event grids: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
  - Venue split: stack vertically on mobile
  - Gallery masonry: single column on mobile
  - Footer: stack sections vertically
- **Acceptance**: No horizontal scroll at any breakpoint; layouts adapt naturally
- **Verify**: Resize browser to 375/768/1440/1728, check each page

---

## Phase 4: Polish & Cleanup

**Goal**: Dead code removed, everything consistent, ready to ship

### Task 11: Remove dead code and unused imports

- **Context**: `components/shared/event-card.tsx` not used, unused exports in `lib/data.ts`
- **Files**: `components/shared/event-card.tsx`, `lib/data.ts`
- **Approach**: Either delete unused EventCard or refactor pages to use it. Clean up unused type exports. Remove any unused imports across all files.
- **Acceptance**: Zero unused exports/imports; build and lint pass
- **Verify**: `npm run build && npm run lint`

### Task 12: Ensure footer BASSMENT text matches Figma

- **Context**: User says footer BASSMENT is "supposed to be large like in the figma"
- **Files**: `components/layout/footer.tsx`
- **Approach**: Footer already uses `text-[128px]` — verify it's rendering at correct size. Check for font-weight (should be 800 ExtraBold), text-transform uppercase, and color `var(--color-bass-grey-med)`. The `.text-display` utility class already matches this — use it.
- **Acceptance**: Footer BASSMENT matches Figma (128px, ExtraBold, uppercase, grey-med color)
- **Verify**: Visual comparison

---

## Order of Execution

```
Phase 1 (Foundation):  Task 1 → Task 2 → Task 3
Phase 2 (Components):  Task 5 → Task 4 → Task 6 → Task 7 → Task 8 → Task 9
Phase 3 (Responsive):  Task 10
Phase 4 (Polish):      Task 11 → Task 12
```

Phase 1 must come first because all other tasks depend on having clean color tokens, typography, and data. Phase 2 fixes visual bugs and adds interactivity. Phase 3 is separable — can run parallel with Phase 2 but better after since component changes affect markup. Phase 4 is final polish.
