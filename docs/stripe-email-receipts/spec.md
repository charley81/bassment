# Stripe Email Receipts — Spec

## What

When a ticket purchase completes, send a confirmation email to the buyer via Resend. Hook into Stripe webhooks to trigger the email automatically after a successful PaymentIntent. The email includes event name, date, price paid, and venue details.

## Context

The Stripe checkout flow works: user clicks "Get Tickets → $25", fills in PaymentElement, and lands on a "You're In." confirmation page. But no email is sent. Resend is already configured (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_CONTACT_EMAIL`).

The PaymentElement collects the buyer's email as part of the payment form. This email is available in the PaymentIntent's `receipt_email` or attached payment method's `billing_details.email`.

## Requirements

1. Stripe webhook endpoint at `/api/stripe-webhook` receives `payment_intent.succeeded` events
2. Webhook verifies signature using `STRIPE_WEBHOOK_SECRET`
3. Extracts buyer email and event metadata from the PaymentIntent
4. Sends a styled HTML email via Resend with event details
5. Email includes: event name, date, price paid, venue name, venue address
6. Webhook is idempotent — duplicate events don't send duplicate emails

## Design

### Flow

```
┌──────────┐  payment     ┌──────────┐  webhook     ┌───────────┐
│ Stripe    │  succeeds   │ /api/     │  verified   │ Resend     │
│ Payment   │ ──────────► │ stripe-   │ ──────────► │ Email to   │
│ Intent    │             │ webhook   │             │ buyer      │
└──────────┘             └───────────┘            └───────────┘
```

### Email Content

```
Subject: You're In — [Event Name] at BASSMENT

Your ticket is confirmed.

Event: Dillinja — Valve Sound System Takeover  
Date: Friday, October 24, 2026  
Price: $25.00  
Venue: 70 Pine Street, Manhattan  

We'll see you there.
— BASSMENT
```

### Files

| File | Action |
|---|---|
| `app/api/stripe-webhook/route.ts` | Create — webhook handler |
| `lib/stripe-webhook.ts` | Create — verify signature + process event |
| `lib/resend.ts` | Create — Resend client (extract from newsletter action) |
| `app/actions/send-ticket-email.ts` | Create — server action for sending receipt |
| `components/stripe-checkout-form.tsx` | No change — PaymentElement already collects email |

## Decisions

### D1: Webhook-driven, not client-driven

**Choice:** Stripe webhook → Resend, rather than sending email from the confirmation page.

**Why:** The confirmation page doesn't have the buyer's email directly (it's handled inside PaymentElement). The webhook receives it reliably. Also, webhooks handle edge cases: the user might close the browser after payment before reaching the confirmation page.

**Reversible:** Yes — can add client-side email collection later.

### D2: `payment_intent.succeeded` event

**Choice:** Listen for `payment_intent.succeeded` rather than `checkout.session.completed`.

**Why:** We're using PaymentIntent flow (not Checkout Session), so the relevant event is `payment_intent.succeeded`. This fires when the card payment is confirmed.

**Reversible:** Yes.

### D3: Resend HTML email

**Choice:** Use Resend's HTML email API with inline styles.

**Why:** Resend is already configured. HTML gives better presentation control than plain text. Inline styles ensure consistent rendering across email clients.

**Reversible:** Yes — can switch to React Email or other templates later.

### D4: Idempotency via payment intent ID

**Choice:** Use the PaymentIntent ID as a deduplication key. If we've already sent an email for this PaymentIntent, skip.

**Why:** Stripe may retry webhooks. Without deduplication, the buyer gets duplicate emails. Simple in-memory or database check using the PI ID.

**Reversible:** Yes.

## What you need to provide

1. **Stripe webhook signing secret** — from Stripe Dashboard → Developers → Webhooks → Add endpoint:
   - URL: `https://your-site.netlify.app/api/stripe-webhook`
   - Events: `payment_intent.succeeded`
   - Copy the signing secret (starts with `whsec_`)

## Invariants

- `STRIPE_WEBHOOK_SECRET` is server-only, never exposed to client
- Webhook route returns 200 quickly — email is sent synchronously but Stripe expects a response within 20s
- Duplicate events are silently ignored

## Out of Scope

- Ticket QR codes or barcodes
- Calendar invites (.ics files)
- Refund/cancellation emails
- Order history page
