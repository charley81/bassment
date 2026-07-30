# Stripe Ticketing — Spec

## What

Replace the placeholder "Tickets Coming Soon" CTAs with a Stripe Elements checkout flow. Users buy tickets directly on the site through a custom dark-themed payment form. Server creates PaymentIntents via Stripe API. Confirmation page on success.

## Context

The site currently has a `TicketCta` component that shows "Tickets Coming Soon" (no URLs set). The user wants Stripe Elements — custom UI matching the BASSMENT design — not Stripe Checkout (hosted page). Test mode only for now.

**Relevant files:**
- `components/ticket-cta.tsx` — placeholder CTA
- `components/sections/featured-event.tsx` — home page CTA
- `components/sections/event-detail-hero.tsx` — detail page CTA
- `lib/sanity/types.ts` — SanityEvent (needs `ticketPrice`)
- `sanity/schemas/event.ts` — event schema (needs `ticketPrice` field)

## Requirements

1. **Stripe Elements form** — dark-themed card input (number, expiry, CVC) matching site design
2. **Server-side PaymentIntent** — API route creates intent with amount from Sanity event
3. **Confirmation page** — `/events/[slug]/confirmation` shows success + order details
4. **Error handling** — card declined, network error, invalid input
5. **Test mode only** — `sk_test_` / `pk_test_` keys, Stripe test cards
6. **Price in Sanity** — new `ticketPrice` field on event schema (cents, e.g. 2500 = $25.00)
7. **Price display** — show price on the ticket CTA (e.g. "Get Tickets — $25")

## Design

### Flow

```
┌──────────┐   click    ┌──────────────┐   submit    ┌──────────┐
│ TicketCta │ ────────► │ Stripe        │ ─────────► │ API Route │
│ "Get      │           │ Elements Form │            │ /api/     │
│  Tickets  │           │ (client side) │            │ payment   │
│  — $25"   │           └──────────────┘            └──────────┘
└──────────┘                                              │
                                                    creates PaymentIntent
                                                          │
                                                          ▼
                                                  ┌──────────────┐
                                                  │ Return       │
                                                  │ clientSecret │
                                                  └──────────────┘
                                                          │
                                                    confirm payment
                                                          │
                                                          ▼
                                                  ┌──────────────┐
                                                  │ Confirmation │
                                                  │ Page         │
                                                  └──────────────┘
```

### Component Architecture

```
components/
  ticket-cta.tsx              — wrapper: shows "Get Tickets — $25" button
  stripe-checkout-form.tsx    — 'use client': Elements provider + card form
  stripe-confirmation.tsx     — 'use client': success message after payment

app/
  api/payment/route.ts        — POST: creates PaymentIntent via Stripe SDK
  events/[slug]/buy/page.tsx  — checkout page with form
  events/[slug]/confirmation/ — success page

lib/
  stripe.ts                   — server-only Stripe client
```

### Sanity Schema Addition

Add to `event` schema:
```ts
defineField({ name: 'ticketPrice', title: 'Ticket Price (cents)', type: 'number' })
```

Example: 2500 = $25.00, 5000 = $50.00.

### Stripe Elements Form Design

Dark theme matching the site:
- Background: `bg-bass-dark` (`hsl(351, 80%, 2%)`)
- Input border: `border-bass-border` (`hsl(0, 0%, 40%)`)
- Text: `text-bass-text` (`hsl(0, 0%, 93%)`)
- Submit button: same as site CTA buttons (`bg-primary`, `text-bass-white`)

## Decisions

### D1: Stripe Elements over Stripe Checkout

**Choice:** Custom Elements form, not hosted Checkout.

**Why:** User explicitly requested it. Elements lets us match the BASSMENT design language exactly — dark theme, industrial typography, no Stripe branding. The tradeoff is more code (Elements form + error handling + confirmation page) vs Checkout (one redirect).

**Reversible:** No — switching to Checkout would be a different architecture.

### D2: PaymentIntent flow over PaymentElement

**Choice:** `PaymentIntent` with individual Elements (`CardNumberElement`, `CardExpiryElement`, `CardCvcElement`).

**Why:** Per-element control gives us pixel-perfect design matching. `PaymentElement` is simpler but renders a combined card input with less styling control.

**Reversible:** Yes — both use intents.

### D3: Price in Sanity event schema

**Choice:** Add `ticketPrice` field (number, in cents) to the Sanity event document.

**Alternatives:** Hardcoded price, Stripe Products/Prices API.

**Why:** Each event may have different pricing ($25 GA, $50 VIP). Storing in Sanity lets promoters set prices per event without touching Stripe. Stripe Products/Prices API is more powerful but overkill for a single-price-per-event model.

**Reversible:** Yes — can migrate to Stripe Products later.

### D4: Dedicated checkout page per event

**Choice:** `/events/[slug]/buy` as the checkout page, not a modal.

**Why:** Full-page checkout gives room for the form, order summary, and error states. Modals add complexity for no benefit — buying tickets is the primary conversion.

**Reversible:** Yes.

### D5: Test mode only, no webhooks

**Choice:** No Stripe webhooks in MVP. Confirmation page shown immediately after successful PaymentIntent confirmation.

**Why:** Webhooks are needed for async payment confirmation (e.g., 3D Secure, bank transfers) but add complexity. For test mode with card payments, the synchronous `confirmCardPayment` response is sufficient.

**Reversible:** Yes — add webhooks later for production.

## Versions

| Package | Version | Source |
|---|---|---|
| `@stripe/stripe-js` | 9.12.1 | npm registry (latest) |
| `@stripe/react-stripe-js` | 6.8.0 | npm registry (latest) |
| `stripe` | 22.4.0 | npm registry (latest) |

## Invariants

- `STRIPE_SECRET_KEY` never exposed to client — verified with `grep` of `.next/static/`
- Payment amounts come from Sanity, not client-side input
- Card data never touches our server — Stripe Elements handles it
- Confirmation page only accessible after successful payment

## Error Behavior

- **Card declined:** Show Stripe error message below the card input
- **Network error:** "Payment failed. Please try again." with retry button
- **Invalid amount:** "Tickets not available for this event" (price = 0 or missing)
- **Expired PaymentIntent:** Refresh the page to create a new one
- **Missing Stripe keys:** "Payment not configured" message

## Testing Strategy

- `next build` passes
- Use Stripe test cards: `4242 4242 4242 4242` (success), `4000 0000 0000 0002` (declined)
- Verify confirmation page shows after successful payment
- Verify error messages display for declined cards
- Verify `STRIPE_SECRET_KEY` does not appear in client bundle

## Out of Scope

- Stripe webhooks (async confirmation, refunds)
- Multiple ticket tiers (GA vs VIP) in one purchase
- Ticket quantity selection (always buys 1 for MVP)
- Order history or email receipts
- Production mode (live keys, real payments)
