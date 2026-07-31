# Animations — Spec

## What

Add motion to the site matching the industrial, bass-heavy aesthetic. Three layers: (1) DJ carousel with smooth slide transitions via Framer Motion, (2) scroll-driven section reveals via GSAP ScrollTrigger, (3) subtle micro-interactions on hover/focus. All animations are client-side only — no layout shift, no CLS impact, accessible with `prefers-reduced-motion`.

## Context

The site is currently static — no motion, no transitions. The project overview specifies Framer Motion for interaction animations and GSAP ScrollTrigger for scroll-driven animations. The design aesthetic is industrial, dark, built around the physicality of bass frequencies. Animations should feel heavy and deliberate, not bouncy or playful.

**Relevant files:**
- `components/sections/resident-djs.tsx` — DJ carousel (Embla Carousel currently)
- All section components under `components/sections/` — scroll reveal targets
- `components/ui/carousel.tsx` — Embla carousel (may be replaced or wrapped)
- `app/page.tsx`, `app/venue/page.tsx`, etc. — page-level components

## Requirements

### A. DJ Carousel Animation

1. Replace Embla Carousel with a Framer Motion-powered carousel
2. Auto-advance every 5 seconds with a smooth slide transition
3. Manual navigation via previous/next buttons interrupts auto-advance, resets timer
4. Transition: horizontal slide with subtle scale (0.95 → 1) and opacity fade
5. Infinite loop — last DJ wraps to first seamlessly

### B. Scroll-Driven Section Reveals

1. Sections animate in as they enter the viewport (trigger at 20% visibility)
2. Animation: fade up + slight vertical movement (translateY 40px → 0)
3. Staggered children: grid items (event cards, gallery images) reveal one at a time (50ms stagger)
4. Stats/specs: numbers count up from 0 to final value on scroll into view
5. One-time animation — elements stay visible after reveal, no re-trigger on scroll back

### C. Micro-Interactions

1. Button hover: subtle scale (1.02) + brightness shift on primary buttons
2. Link hover: color transition (already partially done)
3. Event card hover: image scale (1.05) with gradient darken
4. Navigation: active indicator underline transition

## Design

### Animation Philosophy

**Heavy, deliberate, industrial.** Animations use `ease-out` timing with no bounce. Durations are 0.5s–0.8s — feels weighty, like a bass transient. No spring physics (bouncy = wrong vibe for drum & bass / industrial).

```
Timing:      easeOut, 0.6s duration
Distance:    translateY(40px → 0)
Stagger:     50ms between children
Scale:       0.95 → 1.0 (subtle, grounded)
```

### Component Architecture

```
components/
  animations/
    scroll-reveal.tsx        — wrapper: animates children on scroll enter
    count-up.tsx             — animates number from 0 → target
    dj-carousel.tsx          — Framer Motion carousel for resident DJs
  
  sections/
    resident-djs.tsx          — replaces Embla with DjCarousel
    featured-event.tsx        — wraps in ScrollReveal
    upcoming-events.tsx       — wraps cards in ScrollReveal (staggered)
    venue-teaser.tsx          — wraps in ScrollReveal
    newsletter-signup.tsx     — wraps in ScrollReveal
    venue-stats.tsx           — uses CountUp for stat values
    sound-specs.tsx           — uses CountUp for spec values
    venue-history.tsx         — wraps in ScrollReveal
    sound-history.tsx         — wraps in ScrollReveal
```

### ScrollReveal Component

```tsx
'use client'
import { motion } from 'framer-motion'

// Wraps children, animates on scroll into view
<ScrollReveal stagger?: boolean>
  {children}
</ScrollReveal>
```

Props: `stagger` (boolean, 50ms stagger per child), `delay` (number)

### DjCarousel Component

Replaces Embla Carousel. Uses Framer Motion `AnimatePresence` + `motion.div` for slide transitions. Auto-advance via `useEffect` + `setInterval`.

### CountUp Component

```tsx
'use client'  
import { useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

// Animates number from 0 → target when in view
<CountUp target={96} suffix="k" />
```

## Decisions

### D1: Framer Motion for carousel, GSAP for scroll

**Choice:** Mix libraries. Framer Motion for carousel (see above), GSAP ScrollTrigger for section reveals.

**Why:** Framer Motion's `AnimatePresence` is perfect for carousel transitions. GSAP's ScrollTrigger is the industry standard for scroll-driven animations — better performance, finer control, and `scrub` support for future parallax effects.

**Reversible:** Yes — both are portable.

### D2: Keep Embla as carousel base, add Framer Motion for transitions

**Choice:** Wrap Embla with Framer Motion transitions rather than rebuilding the carousel from scratch.

**Why:** Embla handles touch/swipe, keyboard navigation, accessibility, and responsive breakpoints. Rebuilding all of that with Framer Motion is unnecessary work. Instead: use Embla for carousel logic, and add Framer Motion for the slide animation (fade/scale on each slide change).

**Reversible:** Yes — can swap to pure Framer Motion later.

### D3: `prefers-reduced-motion` respected

**Choice:** All animations check `prefers-reduced-motion` media query. When active, elements render instantly at their final state.

**Why:** Accessibility requirement. Users with motion sensitivity should not see animations.

**Reversible:** No — removing this would break accessibility.

### D4: One-time reveals, no re-trigger

**Choice:** ScrollReveal triggers once when the element first enters the viewport. Does not animate again on subsequent scrolls.

**Why:** Re-triggering animations on every scroll is distracting and unconventional for content sections. Once revealed, content stays.

**Reversible:** Yes.

## Versions

| Package | Version | Source |
|---|---|---|
| `framer-motion` | 12.43.0 | npm registry (latest) |
| `gsap` | 3.15.0 | npm registry (latest) |

## Invariants

- No layout shift — all animations use `transform` only, no layout-affecting properties
- Accessible — `prefers-reduced-motion: reduce` disables all animations
- Performance — GSAP runs off main thread where possible, Framer Motion uses hardware-accelerated transforms
- Embla carousel functionality preserved (touch, swipe, keyboard, responsive)

## Testing Strategy

- `next build` passes
- DJ carousel auto-advances every 5 seconds
- Section reveals trigger on scroll down, not on page load
- Enable `prefers-reduced-motion: reduce` in OS settings → animations disabled
- Mobile: carousel swipe still works

## Out of Scope

- Page transitions (route change animations)
- Parallax effects
- Sound/music-reactive animations
- 3D or WebGL effects
