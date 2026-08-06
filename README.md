# BASSMENT

**Live site:** [clubbassment.com](https://clubbassment.com)

[![CI](https://github.com/charley81/bassment/actions/workflows/ci.yml/badge.svg)](https://github.com/charley81/bassment/actions/workflows/ci.yml)
![Lighthouse](https://img.shields.io/badge/lighthouse-100%20perf%20%C2%B7%2094%20a11y%20%C2%B7%20100%20bp%20%C2%B7%20100%20seo-brightgreen)

Marketing site and ticketing platform for BASSMENT, an underground electronic
music venue in Manhattan. Content-managed, with a fully custom embedded
checkout: buyers purchase tickets with Stripe, receive a branded email ticket,
and can self-serve recover it — no third-party ticketing middleman.

## Highlights

- **Custom ticketing flow** — embedded Stripe Payment Element checkout, order
  persistence in Sanity CMS, branded transactional email via Resend
- **Idempotent webhook architecture** — every purchase becomes a `ticket`
  document keyed by the Stripe PaymentIntent ID; ticket creation and capacity
  increment commit in one atomic transaction, so Stripe retries and duplicate
  deliveries can never double-sell, double-email, or lose an order
- **Self-serve ticket recovery** — non-enumerating resend flow with durable,
  infrastructure-free throttling
- **Capacity management** — per-event capacity with automatic sold-out
- **Content-managed** — events, artists, FAQs, gallery, and pages edited in
  Sanity Studio
- **Performance** — 100 Lighthouse performance; image pipeline optimized from
  335MB of source PNGs to 53MB of right-sized JPGs

## Tech Stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, ISR), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| CMS | Sanity (Studio embedded at `/studio`) |
| Payments | Stripe (Payment Element, webhooks) |
| Email | Resend (transactional, verified sending domain) |
| Hosting | Netlify (deploy previews on every PR) |
| Testing | Vitest (unit), API-level integration script, GitHub Actions CI |

## Architecture: the purchase loop

```
Buyer → /events/[slug]/buy
  │  email field (validated) + Stripe Payment Element
  ▼
POST /api/payment          → PaymentIntent created (price/status/capacity from Sanity)
POST /api/payment/email    → delivery email attached as metadata.customerEmail
stripe.confirmPayment      → card/wallet charge
  ▼
POST /api/stripe-webhook (payment_intent.succeeded)
  │  1. transaction { create ticket(_id = PaymentIntent ID) ‖ inc ticketsSold }
  │     → duplicate delivery conflicts and aborts both halves (no drift, no dupes)
  │  2. send branded ticket email (order ref BSMT-XXXXXX)
  │  3. patch emailSentAt — a failed send retries safely via (1) + (3)
  │  4. at capacity → event flips itself to soldOut
  ▼
Confirmation page          → delivery address, order ref, add-to-calendar (.ics),
                             resend + contact support paths
```

Recovery: `/tickets/resend` re-sends tickets for an email with an identical
response whether or not tickets exist (no enumeration), throttled durably via
`lastResentAt` on the order itself. Support can fix a typo'd email directly in
Sanity Studio.

Design and implementation specs for each feature live in `docs/<feature>/spec.md`.

## Getting Started

Requires Node 22+ and pnpm.

```bash
git clone https://github.com/charley81/bassment.git
cd bassment
cp .env.example .env   # fill in keys (every var is documented inline)
pnpm install
pnpm dev               # http://localhost:3000
```

Sanity Studio is at `/studio`. A CMS webhook posts to `/api/revalidate` on
content publish, which refreshes ISR pages. On Netlify this on-demand
revalidation requires a **`NETLIFY_PURGE_API_TOKEN`** env var (site-scoped
or personal access token) — without it the origin re-renders but the CDN
keeps serving stale pages until the ISR timer expires.

## Scripts

```bash
pnpm dev               # dev server
pnpm build             # production build
pnpm start             # serve production build
pnpm lint              # eslint
pnpm typecheck         # tsc --noEmit
pnpm test              # vitest unit tests
pnpm test:integration  # full purchase loop against a running server
```

`test:integration` creates a real Stripe test-mode PaymentIntent, attaches the
delivery email, confirms with a test card, and fires a signed webhook —
asserting every step including validation and replay tolerance. Set
`TEST_TICKET_EMAIL` in `.env` (see `.env.example`).

## Project Structure

```
app/                 routes (pages, API: payment, webhooks, server actions)
components/          sections, forms, ui (shadcn), layout
lib/                 domain logic: orders, tickets, calendar, dates,
                     sanity client/queries, stripe, resend — with unit tests
sanity/              schemas (event, artist, ticket, faq, …) + Studio structure
docs/                feature specs (design decisions, error behavior, testing)
scripts/             test-checkout-flow.mjs (E2E purchase loop)
.github/workflows/   CI: lint + typecheck + unit tests on every PR
```

## Conventions

- **Spec-driven changes** — features start as a reviewed spec in `docs/`
- **Conventional Commits**, one PR per branch, CI must pass
- **Fail loud on misconfiguration** — missing production env throws (visible,
  retried) instead of silently degrading
- **No in-memory state for correctness** — idempotency and throttling are
  durable (Sanity), surviving serverless cold starts and instances
