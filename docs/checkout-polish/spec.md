# Spec: Checkout Polish — Stripe Link Prefill + Add-to-Calendar

**Status:** Approved

## What

Two small UX upgrades that finish the professional checkout:

1. **Stripe Link prefill** — the email the buyer types into our "Where should we send your ticket?" field is passed into the Payment Element as `defaultValues.billingDetails.email`. Link (Stripe's wallet) then recognizes returning buyers with *verified* saved emails/payment methods and offers one-click checkout — less typing, fewer typos, higher conversion.
2. **Add to calendar** — the confirmation page offers an `.ics` download for the purchased event (works with Apple/Google/Outlook — no third-party dependency).

## Context

- `components/stripe-checkout-form.tsx` owns the email state and renders `<PaymentElement />` (inside `<Elements>` with `appearance: night`).
- Stripe Elements behavior that shapes the design: changing the `options` prop of `<PaymentElement />` **recreates the element** — so feeding the email on every keystroke would remount the card form and drop focus/state. Research: `defaultValues.billingDetails.email` is a documented PaymentElement option; Link availability is controlled by dashboard payment-method settings + `automatic_payment_methods` (already enabled on our PaymentIntents).
- The confirmation page (`app/events/[slug]/confirmation/page.tsx`) already verifies the PaymentIntent server-side and shows the order ref; it does not currently fetch event details.
- Venue address is hardcoded in `lib/ticket-email.ts` ("70 Pine Street, Manhattan") — the `.ics` uses the same (see Open Questions on centralizing).

## Requirements

### A. Link prefill (`components/stripe-checkout-form.tsx`)

1. Pass the typed email to `<PaymentElement options={{ defaultValues: { billingDetails: { email } } }} />` — but **only commit a new options object on email-field blur** (or when the email first becomes valid), never per keystroke, so the element remounts at most once before the buyer reaches the card form.
2. No change to the submit flow, validation, or `/api/payment/email` attach — the prefill is additive (Link detection + billing autofill).
3. Appearance/theme unchanged.

### B. Add to calendar (confirmation page)

4. Server-side: fetch `{ title, date, doorsOpen }` for the event by slug (existing `client` is fine — public data) and pass to a client component.
5. New `components/add-to-calendar.tsx` (client): button styled like the existing secondary action; on click, builds an `.ics` and triggers a download (`<event-slug>.ics`) via Blob + object URL.
6. New `lib/calendar.ts` (pure, unit-tested): `buildIcs({ title, start, end, location, description })` —
   - RFC 5545: `DTSTART`/`DTEND` in UTC basic format (`YYYYMMDDTHHMMSSZ`), `DTSTAMP`, `UID` (order ref + domain), text escaping (`\` `,` `;` newlines)
   - Start = `doorsOpen` ?? `date`; end = start + 5 hours (club night default; noted as an assumption)
   - Location = `BASSMENT, 70 Pine Street, Manhattan`; description includes the order reference
7. Rendered only for `verified` purchases (alongside the order ref), not for failed/unknown states.
8. Unit tests for `buildIcs`: UTC formatting, escaping, doorsOpen-vs-date precedence, +5h end.

## Design

- **Blur-commit for the prefill** — the only moment a remount is safe: the buyer has finished the email field and hasn't focused the card form yet. Implementation: keep `emailOptions` in state, set it on blur when the email matches the validation regex; pass to `<PaymentElement options={emailOptions} />`.
- **`.ics` over "Add to Google Calendar" URL** — one artifact covers Apple, Google (import), and Outlook; no external redirect; testable pure builder. A Google URL could be added later for one-click convenience.
- **No new dependencies** — both features are config + ~60 lines.

## Decisions

- **Link enabled state is a dashboard setting** (human task below) — code ships the prefill regardless; without Link enabled it simply prefills billing details, harmless.
- **+5h default duration** — `Assumption:` club nights run ~22:00–03:00; events have no end-time field today (adding one is out of scope).
- **Address stays hardcoded** in both email and ICS for now — centralizing venue info into site settings is folded into the pending `lib/data.ts` consolidation item.

## Error Behavior

| Failure | Behavior |
|---|---|
| Event doc missing for a verified purchase | Calendar button hidden; rest of confirmation unchanged (calendar is additive) |
| `date`/`doorsOpen` missing | Calendar button hidden |
| Email never blurred/invalid | PaymentElement mounts once with no prefill — identical to today |

## Testing Strategy

1. `pnpm test` — `buildIcs` unit tests pass.
2. Manual/E2E on preview:
   - Buy page: type email → blur → card form intact (single remount, no focus weirdness); complete a purchase with test card.
   - Confirmation page: "Add to Calendar" downloads a valid `.ics`; opening it creates an event at the right NYC time with venue + order ref.
3. `pnpm typecheck`, `pnpm lint`, `pnpm build`, CI green.

## Human tasks

1. Stripe dashboard → Settings → Payment methods: confirm **Link is enabled** (test mode + live mode when launching).

## Out of Scope

- End-time field on events (would tighten the ICS end)
- Google-Calendar one-click URL variant
- Apple Wallet / Google Wallet passes
- Centralizing venue address into site settings (tracked under the `lib/data.ts` consolidation item)
