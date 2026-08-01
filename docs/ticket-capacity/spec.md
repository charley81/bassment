# Spec: Ticket Capacity & Auto-Sold-Out

**Status:** Approved

## What

Events gain an optional `capacity`. Every purchase atomically increments a `ticketsSold` counter on the event (same Sanity transaction as the ticket creation — no drift, retry-safe). When the counter reaches capacity, the event flips itself to `soldOut`, and the payment endpoint refuses new PaymentIntents for sold-out events by counter, not just by manual status.

## Context

- Today `ticketStatus` is set by hand in Studio (`onSale`, `lowTickets`, `soldOut`, `atDoor`, `past`) — nothing stops 500 sales for a 200-cap room.
- `app/api/payment/route.ts` gates on `ticketStatus` + `ticketPrice` via `PRICE_QUERY` (uncached read).
- The webhook creates the `ticket` doc with `_id` = PaymentIntent ID (Phase 1) — the create-conflict is the idempotency primitive.
- Research: `@sanity/client@7.25.0` supports `transaction().create(doc).patch(id, p => p.inc(n)).commit()` — atomic across documents. Verified against the installed type definitions.
- One ticket per purchase (no quantity selection) — increment is always 1.

## Requirements

1. **Event schema** gains:
   - `capacity` (number, optional, min 1 — unset = unlimited)
   - `ticketsSold` (number, initialValue 0, readOnly — counter owned by the webhook)
2. **Webhook** (`app/api/stripe-webhook/route.ts`): when the event has a known `_id` (it always does — `EVENT_LOOKUP` already fetches it), create ticket + increment in **one transaction**:
   `transaction().create(ticketDoc).patch(eventId, p => p.setIfMissing({ ticketsSold: 0 }).inc({ ticketsSold: 1 })).commit()`
   - Conflict on the ticket `_id` fails the whole transaction → existing duplicate-delivery path handles it (no double increment, no double email).
   - After a successful transaction: if `capacity` is set and `ticketsSold + 1 >= capacity`, patch the event to `ticketStatus: 'soldOut'` (read the fresh count via a quick projection or compute from the pre-read value + 1).
   - Events without capacity: same transaction (counter still tracked — useful data), never auto-flips.
3. **Payment gate** (`app/api/payment/route.ts`): `PRICE_QUERY` also fetches `capacity` and `ticketsSold`; reject with 400 "Sold out" when `capacity` is set and `ticketsSold >= capacity` — even if the manual status hasn't flipped yet. Extract the decision as a pure, tested function: `canSell(status, price, capacity, ticketsSold)` in `lib/tickets.ts` (used by the route, unit-tested).
4. **Unit tests** for `canSell`: onSale/lowTickets sell; soldOut/atDoor/past don't; missing/zero price doesn't; capacity unset sells at any count; under capacity sells; at/over capacity doesn't.
5. **Studio**: `capacity` editable; `ticketsSold` visible read-only on the event form (attendance at a glance).

## Design

- **Why the counter (not GROQ `count()` per request):** the payment gate and sold-out flip need a cheap, atomic target. `inc` inside the same transaction as the ticket `create` makes counter and record impossible to desync through webhook retries — the transaction is all-or-nothing and the conflict aborts both. The `ticket` docs remain the source of truth; the counter is a consistent projection of them.
- **Known and accepted race:** two buyers can both pass the gate for the last seat and both pay (Stripe holds no inventory). The webhook still records both; the event flips sold out after the first. This is the industry-standard tradeoff without inventory locks — oversell is handled manually (refund + apology). Documented here so it's a decision, not a surprise.
- **Refunds:** out of scope (no refund flow exists). The counter only increments; a manual refund today = manually set ticket `status: 'refunded'` and decrement `ticketsSold` in Studio. Noted in the schema field description.
- **No auto `lowTickets` flip** — manual statuses stay meaningful; only `soldOut` is automated, and only upward from a purchasable state (never overrides a manual `past`/`atDoor`).

## Decisions

- **Auto-flip only from purchasable states** — the webhook patches `ticketStatus: 'soldOut'` only when current status is `onSale`/`lowTickets`; a manually `past` or `atDoor` event is left alone.
- **Counter increments even without capacity** — free attendance analytics; zero cost.
- **Backfill:** existing test tickets predate the counter (their events read `ticketsSold: 0`). Test-mode data — acceptable; the E2E test sets the counter explicitly before exercising the flip.

## Error Behavior

| Failure | Behavior |
|---|---|
| Transaction conflicts (duplicate delivery) | Whole transaction aborts → existing dedupe path (no double inc/email) |
| Transaction fails (Sanity down) | 500 → Stripe retries → succeeds on retry (idempotent by `_id`) |
| Sold-out flip patch fails | Logged; counter is still correct, payment gate still blocks by counter — the flip is a courtesy, not the gate |
| Event doc deleted after purchase | Ticket recorded without reference/counter (existing `eventDoc ?` guard); email still sends |

## Testing Strategy

1. `pnpm test` — `canSell` matrix passes.
2. E2E (local prod server, real Stripe test objects, write token):
   - Pick a test event; set `capacity` = current ticket count + 1 and `ticketsSold` = current count (write token).
   - Full purchase via integration script → succeeds; assert event `ticketsSold` incremented by exactly 1 and `ticketStatus` flipped to `soldOut`.
   - `POST /api/payment` for the same event → 400 "Sold out".
   - Replay the webhook event → counter unchanged (no double increment).
   - Cleanup: restore `capacity` unset on the test event.
3. `pnpm typecheck`, `pnpm lint`, `pnpm build`, CI green.

## Out of Scope

- Refund flow / counter decrements (manual in Studio for now)
- Quantity > 1 per purchase
- Inventory locking / perfect oversell prevention (see accepted race)
- Auto `lowTickets` threshold
- Waitlists
