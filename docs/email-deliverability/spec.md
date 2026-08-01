# Spec: Transactional Email Deliverability

**Status:** In Review

## What

Make transactional ticket email deliverable to real customers. Today the app sends from Resend's shared onboarding address (`onboarding@resend.dev`), which only delivers to the Resend account owner — real ticket buyers receive nothing. This spec covers the code-side hardening and documents the human ops tasks (domain verification, DNS, env config) that the agent cannot perform.

## Context

- `lib/resend.ts` — `RESEND_FROM` falls back to `'BASSMENT <onboarding@resend.dev>'` when `RESEND_FROM_EMAIL` is unset. Local `.env` sets only `RESEND_API_KEY`.
- `app/api/stripe-webhook/route.ts` — calls `sendTicketEmail` after `payment_intent.succeeded`; on send failure it returns 500 so Stripe retries. Delivery failure at the Resend account level (unverified recipient under onboarding sender) surfaces as a Resend API error → 500 → retries that can never succeed → lost ticket email after retry exhaustion.
- `.env` is local-only; production env lives in Netlify (per comments in the webhook route).
- Research: Resend requires a verified domain you own and recommends sending from a **subdomain** (e.g., `tickets.example.com`) to isolate sender reputation. DKIM/SPF records are issued in the Resend dashboard; verification window is 72h. `resend` npm latest is 6.18.1; project is on `^6.18.0` — current, no upgrade needed.

## Requirements

1. Production ticket email must be sent from an address on a domain verified in Resend: `BASSMENT <tickets@tickets.clubbassment.com>` (sending subdomain of the production domain `clubbassment.com`).
2. Missing `RESEND_FROM_EMAIL` in production must **fail loudly** (throw), not silently fall back to the onboarding address. Non-production may keep the onboarding fallback (delivers to the account owner — useful for local testing) with a warning log.
3. From-address resolution stays centralized in `lib/resend.ts`; no call-site changes.
4. Human ops tasks (below) are documented so they can be executed and checked off independently.

## Design

### Code change

`lib/resend.ts`: replace the module-level `RESEND_FROM` constant with a `getFromAddress()` resolver (called per send):

```ts
function getFromAddress(): string {
  const from = process.env.RESEND_FROM_EMAIL
  if (from) return from
  if (process.env.NODE_ENV === 'production') {
    throw new Error('RESEND_FROM_EMAIL not configured — refusing to send from the onboarding address in production')
  }
  console.warn('RESEND_FROM_EMAIL not set — using Resend onboarding address (delivers only to the account owner)')
  return 'BASSMENT <onboarding@resend.dev>'
}
```

`sendEmail` calls `getFromAddress()` per send. The throw propagates through `sendTicketEmail` → webhook returns 500 → Stripe retries — which is correct behavior for a misconfiguration (loud, retried, visible in logs) rather than a silent drop.

Call sites updated from the removed `RESEND_FROM` constant: `lib/resend.ts` (`sendEmail`), `app/actions/contact.ts`, `app/actions/newsletter.ts` — the two server actions send through the same onboarding fallback and had the same silent-drop risk. Also corrected the `CONTACT_TO` fallback in `app/actions/contact.ts` from `hello@bassment.com` (a domain the venue does not own) to `hello@clubbassment.com`.

### Human ops checklist (cannot be done by the agent)

1. Add the sending subdomain in Resend: dashboard → Domains → Add `tickets.clubbassment.com` → publish the DKIM and SPF records at the DNS provider for `clubbassment.com` → click Verify (allow up to 72h; usually minutes).
3. Add a DMARC record on the subdomain: `v=DMARC1; p=none;` (monitoring mode; tighten to `quarantine` after delivery is proven).
4. Set `RESEND_FROM_EMAIL="BASSMENT <tickets@tickets.clubbassment.com>"` in Netlify production env (and `RESEND_API_KEY` if not already present there).
5. Verify: make a Stripe test-mode purchase with an email address that is **not** the Resend account owner; confirm delivery in that inbox and the send appears as "delivered" in Resend → Logs.

## Decisions

- **Sending identity: `tickets.clubbassment.com` subdomain, from-address `BASSMENT <tickets@tickets.clubbassment.com>`** — per Resend's documented recommendation to send from a subdomain; isolates transactional reputation from any future marketing sends on the root domain. Domain confirmed by the site owner. Reversible (add another verified domain/subdomain later).
- **Fail loud in production** — a thrown misconfig produces Stripe retries and error logs; a silent onboarding fallback produces permanently lost tickets. The former is detectable, the latter is not. Informed by the webhook's existing retry-on-500 design.
- **No SDK upgrade** — `resend@^6.18.0` is within one patch of latest (6.18.1, checked npm registry); nothing in this spec depends on newer APIs.
- **No template engine** — the inline HTML in `lib/ticket-email.ts` is fine at this volume; templating is out of scope.

## Error Behavior

| Failure | Behavior |
|---|---|
| `RESEND_API_KEY` missing | `getResend()` throws → webhook 500 → Stripe retries (existing behavior, unchanged) |
| `RESEND_FROM_EMAIL` missing in production | `getFromAddress()` throws → webhook 500 → Stripe retries; error is explicit in logs |
| `RESEND_FROM_EMAIL` missing in dev/test | Warn + onboarding fallback (owner-deliverable) |
| Resend API rejects send (bad domain, bounced) | `sendEmail` throws with Resend's message → webhook 500 → Stripe retries |

## Testing Strategy

1. `NODE_ENV=production` without `RESEND_FROM_EMAIL` → calling `sendEmail` throws the explicit error (node one-liner against a build).
2. Dev without `RESEND_FROM_EMAIL` → warning logged, send attempts onboarding path (unchanged from today).
3. With `RESEND_FROM_EMAIL` set → from-address is used verbatim.
4. Post-DNS: end-to-end test purchase to a non-owner inbox (ops checklist step 5).
5. Automated unit tests for the resolver land with the CI/tests spec (queue item #2) — this spec predates the test runner.

## Out of Scope

- Bounce/delivery webhooks and alerting (covered by the observability spec).
- Email template redesign or branding changes.
- DMARC enforcement policy beyond monitoring mode.
- Marketing/broadcast email.
