# Spec: Self-Serve Ticket Resend

**Status:** Approved

## What

A "didn't get your ticket?" recovery flow. The buyer enters their email at `/tickets/resend`; if any `ticket` documents exist for that address, the original branded ticket email(s) are re-sent. The response is identical whether or not tickets exist (no email enumeration), and resends are durably throttled per email address. This is Phase 2 of the professional checkout plan — it closes the "I typo'd / I lost it / it went to spam" gap without human support.

## Context

- `ticket` documents (Phase 1, merged) carry `email`, `eventSlug`, `eventTitle`, `amount`, `orderRef`, `emailSentAt`.
- `lib/ticket-email.ts#sendTicketEmail(email, eventSlug, amount, orderRef)` renders the branded ticket email — reused as-is for resends.
- Existing form/action pattern to match: `app/actions/contact.ts` + `components/forms/contact-form.tsx` (server action, zod, honeypot, generic errors).
- Links to the page already exist in spirit: the confirmation page and ticket email footer both say "wrong email or nothing arrived? Contact us" — those gain a pointer to this self-serve flow.
- No Redis/KV infra exists; throttling must be built on what we have.

## Requirements

1. **Page** `/tickets/resend`: header/footer layout matching other pages, short explainer copy, single email field + submit. Client form component in `components/forms/resend-ticket-form.tsx` following the contact-form pattern (react-hook-form + zod + honeypot).
2. **Server action** `app/actions/resend-ticket.ts`:
   - zod-validates the email; honeypot field silently discards bots (fake success, matching the contact action)
   - lowercases the input; queries `*[_type == "ticket" && email == $email]` (emails stored lowercased — see req 5)
   - **Generic response always**: "If we have tickets for that email, they're on their way." — identical for found / not found / throttled
   - If tickets found and throttle allows: re-send each via `sendTicketEmail` with its own `orderRef`, then patch each doc's `lastResentAt`
3. **Durable throttle**: new optional `lastResentAt` (datetime) field on the `ticket` schema. A resend is allowed only if **no** ticket for that email has a `lastResentAt` within the last **5 minutes**. Throttled attempts return the same generic success (bots/abusers learn nothing), with a server-side log. Extract the decision as a pure, tested function: `resendAllowed(lastResentAt: string[], now: Date): boolean` in `lib/tickets.ts`.
4. **Links to the flow**:
   - Confirmation page support line: "Contact us" → "resend your ticket" link to `/tickets/resend` (keep contact as secondary)
   - Ticket email footer: point to `clubbassment.com/tickets/resend` first, contact form second
5. **Email normalization going forward**: webhook lowercases `email` before writing the ticket doc; the resend action lowercases the lookup input. (Existing docs are already lowercase; a mixed-case legacy doc would just miss — acceptable, test-mode data only.)
6. **Unit tests**: `resendAllowed` (never resent → allow; resent 1 min ago → deny; resent 10 min ago → allow; multiple tickets, newest wins); plus email-lowercasing behavior of the lookup input if extracted.

## Design

- **Non-enumeration by construction**: the action never branches its user-facing response on lookup results. The only observable difference is that emails actually arrive — visible only to the mailbox owner. The throttle also returns generic success so abuse attempts can't probe the rate limit.
- **Abuse model**: entering a victim's email sends the victim their *own* tickets — no data leaks to the attacker. The residual harm is inbox spam, bounded by the 5-minute durable throttle per email address.
- **Why `lastResentAt` on the ticket doc (not a counter collection, not in-memory)**: zero new infra, survives cold starts/instances (the lesson from the webhook dedupe), and the audit trail lives on the order itself. Downside (multiple writes per resend) is irrelevant at this volume.
- **`emailSentAt` untouched by resends** — it remains the original-send guard from Phase 1; `lastResentAt` is the resend audit.
- **Server action over API route** — matches the existing contact/newsletter pattern; no new endpoint surface.

## Decisions

- **5-minute throttle window** — long enough to deter spam, short enough that a panicked buyer can retry after checking spam/promotions tabs. Reversible: one constant.
- **Resend ALL tickets for the email** (not per-order selection) — a buyer who lost one email usually lost the thread; re-sending each ticket with its own order ref is simplest and unambiguous. Volume per email is tiny.
- **Reuse `sendTicketEmail` unchanged** — the resend is semantically "the same email again"; a divergent template would drift. No code change to the template except the footer link (req 4).

## Error Behavior

| Failure | Behavior |
|---|---|
| Invalid email | Client-side zod message; server returns the same validation error shape as contact action |
| Honeypot filled | Fake success, no work (bot learns nothing) |
| Sanity query/write fails | Generic "something went wrong, try the contact form" error to user; logged server-side |
| Resend send fails for one ticket | That ticket's `lastResentAt` not patched (retryable on next attempt); others proceed; user still sees generic success, failure logged |
| `SANITY_API_WRITE_TOKEN` missing | Fail loud server-side (throw → logged); user gets the generic error |

## Testing Strategy

1. `pnpm test` — new `resendAllowed` unit tests pass.
2. E2E against local dev server: run `pnpm test:integration` (creates a fresh ticket to `TEST_TICKET_EMAIL`) → submit `/tickets/resend` form (or invoke the action via curl-equivalent POST) → branded ticket email arrives again → `lastResentAt` patched on the doc → immediate second submission is throttled (log line, no second email, generic success).
3. Lookup with uppercase variant of the email → still finds the ticket (normalization works).
4. Unknown email → generic success, no email, no error.
5. `pnpm typecheck`, `pnpm lint`, `pnpm build` clean; CI green on the PR.

## Out of Scope

- Per-order resend UI, account/login, ticket PDF/QR/wallet passes
- Changing the buyer email self-serve (that stays a support action via Studio)
- IP-based rate limiting (would need new infra; the durable per-email throttle covers the realistic abuse)
- Phase 3 items (Link, add-to-calendar, capacity)
