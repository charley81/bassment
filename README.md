# BASSMENT

Website for BASSMENT — Brooklyn-style techno/house venue in Manhattan. Next.js 16 (App Router), Sanity CMS, Stripe ticketing, Resend transactional email, Netlify hosting.

## Development

Requires Node 22+ and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

### Checks

```bash
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest unit tests
pnpm test:integration # full purchase loop against a running server
```

`test:integration` expects the dev (or prod) server running and uses Stripe
test-mode keys from `.env`. It creates a real PaymentIntent, attaches the
delivery email, confirms with a test card, and fires a signed webhook —
asserting each step. Set `TEST_TICKET_EMAIL` to the Resend account owner's
address (the onboarding sender only delivers there). Override the target
with `BASE_URL=http://localhost:3100`.

CI (`.github/workflows/ci.yml`) runs lint, typecheck, and unit tests on every
PR. Builds are verified by Netlify deploy previews.

## Specs

Design/implementation specs live in `docs/<feature>/spec.md`.
