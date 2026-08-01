# Spec: Ticket Order Persistence

**Status:** In Review

## What

Persist every successful ticket purchase as a `ticket` document in Sanity, keyed deterministically by the Stripe PaymentIntent ID. The Stripe webhook becomes *write-then-send*: create the order record, then send the ticket email — idempotently, so Stripe retries and duplicate webhook endpoints can never create duplicates or double-email. The confirmation page and ticket email gain an order reference and a support path.

This is Phase 1 of the professional checkout plan. It also replaces the in-memory webhook dedupe Set (queue item #4) with durable idempotency, and lays the data foundation for self-serve resend (Phase 2) and capacity tracking (Phase 3).

## Context

- Today a purchase exists only as a Stripe PaymentIntent. There is no order record: nothing to resend from, nothing to support against, no way to fix a typo'd email.
- `app/api/stripe-webhook/route.ts` dedupes with an in-memory `Set` (unreliable across serverless instances/cold starts — its own comment says so) and sends the ticket email via `lib/ticket-email.ts`.
- Sanity schema pattern: `sanity/schemas/*.ts` (`defineType`), registered in `sanity/index.ts`; desk customization in `sanity/structure.ts`.
- `lib/sanity/client.ts` exposes `client` (CDN) and `clientUncached` (transactional reads), both using `SANITY_API_READ_TOKEN`. **No write token exists yet** — mutations require one (human task below).
- Research notes: `sanity@^6.7.0` / `next-sanity@^13.2.3` are current major versions, no upgrades needed. Sanity's `create()` mutation rejects when a document with the same `_id` already exists — this is the idempotency primitive.

## Requirements

1. **New `ticket` schema type** (`sanity/schemas/ticket.ts`) with fields:
   - `_id` = Stripe PaymentIntent ID (deterministic — the idempotency key)
   - `event` — weak reference to `event` (survives event deletion) + denormalized `eventSlug` and `eventTitle` strings so resends work even if the event doc is gone
   - `email` (string, required, email-format validation — Studio editing this is the typo-fix path)
   - `amount` (number, cents), `currency` (string)
   - `orderRef` (string, e.g. `BSMT-X7K2PQ`)
   - `status` — string list: `paid` (initial), `refunded` (future)
   - `purchasedAt` (datetime, from the PaymentIntent)
   - `emailSentAt` (datetime, nullable — the send guard)
2. **Webhook write-then-send** (`app/api/stripe-webhook/route.ts`), replacing the in-memory Set:
   1. Signature verify + `payment_intent.succeeded` check (unchanged)
   2. Extract email (existing precedence: `metadata.customerEmail` → `receipt_email` → billing details); if none, warn + 200 (unchanged)
   3. `create()` the ticket doc with `_id` = PaymentIntent ID
      - **Conflict (already exists):** fetch the doc; if `emailSentAt` is set → duplicate delivery → 200, done. If `emailSentAt` is null → a previous attempt created the record but the email failed → proceed to send.
      - **Created:** proceed to send.
   4. Send the ticket email; on success `patch` the doc with `emailSentAt: now`; on failure return 500 (Stripe retries; the retry finds the doc with null `emailSentAt` and retries the send — no duplicate, no loss)
   5. Missing `SANITY_API_WRITE_TOKEN` → throw → 500 → Stripe retries (fail-loud, same pattern as the email resolver)
3. **Shared order reference** (`lib/orders.ts`): `orderRefFor(paymentIntentId)` → `'BSMT-' + last 6 chars uppercased`. Deterministic, so webhook, confirmation page, and email all derive the same ref from the same ID. Used in the email template, the confirmation page, and stored on the doc.
4. **Confirmation page** (`app/events/[slug]/confirmation/page.tsx`): on `verified`, show the order ref under the heading (e.g. "Order BSMT-X7K2PQ") and a support line: "Wrong email or nothing arrived? [Contact us](/contact) with your order reference."
5. **Ticket email** (`lib/ticket-email.ts`): add an Order row (the ref) and a footer line: "Wrong email or didn't receive this? Contact us at clubbassment.com/contact with your order reference."
6. **Studio**: `ticket` registered in `sanity/index.ts` and added to `sanity/structure.ts` as a "Tickets" list (newest first). Email field editable (support typo-fix path); other fields effectively read-only in practice.
7. **Types**: add `SanityTicket` to `lib/sanity/types.ts` (hand-maintained; typegen remains a separate queue item).

## Design

```
payment_intent.succeeded
        │
        ▼
  create ticket doc (_id = PI id)
        │
   ┌────┴─────────────┐
   │ conflict         │ created
   ▼                  ▼
 emailSentAt?      send email
 yes → 200 (dup)     │ success
 no  → send email    ▼
                    patch emailSentAt → 200
                    │ failure
                    ▼
                    500 → Stripe retries (guard catches it)
```

- **Why `create()`+conflict over `createIfNotExists()`:** the conflict is the signal. `createIfNotExists` succeeds silently either way, forcing a read-then-check race; the conflict path makes "first delivery wins" atomic at the Sanity API level.
- **Why `emailSentAt` on the doc (not "create only after send"):** creating only after a successful send reintroduces the failure mode where a crash between send and create double-emails on retry. The guard field makes send-and-record recoverable in either order of failure.
- **Denormalized `eventSlug`/`eventTitle`:** the email must render correctly even if the event is later edited or deleted; the reference exists for Studio grouping, not for rendering the email.

## Decisions

- **Sanity as the order store** — the project already runs Sanity with Studio; a `ticket` type gives attendee lists, typo-fix editing, and future capacity counts with zero new infrastructure. Alternatives (Postgres/Supabase, Vercel KV): more moving parts for no benefit at this scale; KV lacks the Studio admin UI. Reversible: the doc shape is a plain record, exportable anytime.
- **Deterministic `_id` = PaymentIntent ID** — Stripe guarantees PI uniqueness; the dedupe key needs no coordination. Research-informed: Sanity `create()` conflict on existing `_id` is documented API behavior.
- **Order ref = derived, not stored-only** — deterministic derivation means the confirmation page can show it without a Sanity read (it already has the PI), and support can match refs to PIs trivially.
- **Read token stays read-only; new `SANITY_API_WRITE_TOKEN`** — least privilege. The write client is constructed webhook-side only (`clientUncached` config + write token), never imported by page code.
- **In-memory `processedEvents` Set removed** — superseded by durable idempotency; keeping both adds a second source of truth that can disagree.

## Error Behavior

| Failure | Behavior |
|---|---|
| `SANITY_API_WRITE_TOKEN` missing/invalid | Throw → webhook 500 → Stripe retries; explicit log |
| Duplicate delivery (retry or duplicate endpoint) | `create()` conflict → `emailSentAt` set → 200, no second email |
| Email send fails after doc created | 500 → Stripe retry finds doc with null `emailSentAt` → resend, then patch |
| No email on the PaymentIntent | Warn + 200, doc **not** created (matches today's behavior; nothing to deliver to) |
| Sanity unavailable | Throw → 500 → Stripe retries |

## Testing Strategy

E2E with real Stripe test-mode objects and a local prod build (same method used for the checkout spec):

1. Create intent via `/api/payment` → attach email via `/api/payment/email` → confirm with `pm_card_visa` → signed webhook POST → **ticket doc exists** in Sanity (query by `_id` via read token) with correct fields + email sent (Resend log) + `emailSentAt` patched.
2. **Replay the identical signed event** → 200, still exactly one doc, Resend log shows no second send.
3. **Email-failure recovery:** run prod server without `RESEND_FROM_EMAIL` → webhook 500, but doc created with null `emailSentAt`. Restart with it set → replay → email sent, `emailSentAt` patched, one doc total.
4. Studio: ticket appears in the Tickets list; email field editable.
5. Confirmation page renders the order ref + support line for the verified purchase.
6. `tsc`, `eslint`, `next build` clean.

## Human tasks (agent cannot do)

1. Sanity → manage.sanity.io → project `cp66glrr` → API → Tokens → **Add token** with Editor (write) permissions on `production` dataset → set as `SANITY_API_WRITE_TOKEN` in local `.env` **and** Netlify env → redeploy.
2. (Still open from the email spec) `RESEND_FROM_EMAIL="BASSMENT <tickets@contact.clubbassment.com>"` in Netlify + redeploy — required before any of this works in production.

## Out of Scope

- Self-serve "resend my ticket" page (Phase 2)
- Capacity tracking / auto-soldOut (Phase 3)
- Refunds, `status` transitions beyond initial `paid`
- Stripe Link, add-to-calendar, quantity > 1
- Migrating pre-existing purchases (test-mode data; starts clean from merge)
