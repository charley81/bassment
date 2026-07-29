# bassment

<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->


## Project Overview
BASSMENT is a high-fidelity, design-driven website for a fictional world-class Drum & Bass venue located in the basement of 70 Pine Street, Manhattan. The venue features the legendary 96,000-watt Valve Sound System — a custom analog rig hand-built by Dillinja and Lemon D in 2001. The main priority of this site is to sell tickets to fans. There secondary goals are to advertise events, bring fans into shows, sell drinks and tickets at the door. 

## Context Files
Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **CMS:** Sanity (headless, all content editable by non-technical promoters)
- **Animation:** Framer Motion + GSAP ScrollTrigger
- **Hosting:** Netlify
- **Ticketing:** Ticket Fairy (external API/widget)

## Business Goals

1. **Sell tickets** — Primary conversion. Every page funnels toward ticket purchase via Ticket Fairy integration.
2. **Drive venue attendance** — Get people physically to the venue.
3. **Mailing list signups** — Secondary conversion. Capture users for future event marketing and early ticket access.

## Target Audience

Dedicated junglists and bass music purists, ages 21–50. Vinyl enthusiasts, audiophiles, crate-diggers, and underground club culture participants. They care deeply about sound quality, artist authenticity, and the cultural heritage of Drum & Bass.

## Quick start
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Code conventions
- This is a Next.js 16 app — use App Router with `app/` directory.
- Components in `app/` with co-located CSS modules or Tailwind utility classes.
- TypeScript strict mode is enabled.
- Keep pages and components minimal; extract logic into lib/hooks.

