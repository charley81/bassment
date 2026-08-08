# bassment

## About
BASSMENT is a fictional Drum & Bass venue website at 70 Pine Street, Manhattan. Content is editable in Sanity CMS by non-technical users. Primary goal: sell tickets via Stripe.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **CMS:** Sanity (headless)
- **Animation:** Framer Motion
- **Hosting:** Netlify
- **Ticketing:** Stripe (Payment Element, webhooks)
- **Testing:** Vitest (colocated `*.test.ts`, 90 tests)
- **Package manager:** pnpm

## Quick start
- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm lint` — ESLint
- `pnpm typecheck` — tsc --noEmit
- `pnpm test` — vitest (unit)
- `pnpm test:integration` — full purchase loop (needs running server + .env keys)

## Code conventions
- App Router with `app/` directory. Components colocated.
- Keep pages and components minimal; extract reusable logic into `lib/`.
- All pure-logic changes need tests matching the existing colocated `*.test.ts` pattern.
- Sanity queries live in `lib/sanity/queries.ts`, fetchers in `lib/sanity/fetch.ts`.
- UI/styling-only changes are exempt from test requirements.
