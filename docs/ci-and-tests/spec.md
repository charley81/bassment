# Spec: CI & Automated Testing

**Status:** In Review

## What

Introduce the automated safety net: Vitest unit tests for the high-stakes pure logic, a codified end-to-end checkout integration script (replacing the by-hand verification done in recent sessions), and a GitHub Actions CI workflow that runs lint + typecheck + unit tests on every PR.

## Context

- Zero tests exist today; no test runner, no CI (`.github/` is empty). Every recent change (payments, webhook, email, checkout) was verified manually with one-off scripts.
- Package manager is **pnpm** (`pnpm-lock.yaml`); local Node is **v22.14.0**.
- Research: Vitest latest is **4.1.10** (checked npm registry), supports Node 20/22/24. No Next.js-specific plugin needed for pure-logic tests; the `@/` path alias is wired via `vitest.config.ts`.
- Netlify already builds every PR (deploy previews), so `next build` in CI would duplicate existing coverage — CI stays fast and secret-free.
- Payment-critical logic with no current coverage: webhook recipient-email precedence (`app/api/stripe-webhook/route.ts`), from-address resolution (`lib/resend.ts`), date/time formatting (`lib/dates.ts` — timezone-pinned, renders wrong if broken), mappers and portable-text helpers.

## Requirements

1. **Vitest 4** configured for the repo: `vitest.config.ts` with `@/` alias, node environment. Scripts in `package.json`: `test` (run once), `test:watch`, `typecheck` (`tsc --noEmit`).
2. **Unit tests** (colocated `*.test.ts` beside source):
   - `lib/dates.ts` — short/long/upper/time formats; NYC timezone pinning holds regardless of host TZ (run one case with `TZ=UTC` forced inside the test)
   - `lib/portable-text.ts` — `toParagraphs`/`toPlainText`: block arrays, strings, null/garbage input
   - `lib/sanity/image.ts` — url present / missing asset / null → fallback; custom fallback
   - `lib/mappers.ts` — `mapEvent`: slug vs `_id` fallback, missing date → `TBA`, image fallback
   - `lib/resend.ts` — `getFromAddress`: env set → verbatim; unset + `NODE_ENV=production` → throws; unset + non-production → onboarding fallback (mutate `process.env` per case, restore after)
   - **Webhook recipient precedence** — requires a small refactor: extract the pure decision from `app/api/stripe-webhook/route.ts` into `lib/ticket-email.ts` as `resolveTicketRecipient(intent, billingEmail?)` (metadata.customerEmail → receipt_email → billingEmail → null); route calls it; tests cover the precedence table
3. **Integration script** — `scripts/test-checkout-flow.mjs` + `pnpm test:integration`: codifies the manual E2E loop against a locally running server: create intent via `POST /api/payment` → attach email via `POST /api/payment/email` → confirm with `pm_card_visa` via Stripe SDK → POST a locally signed `payment_intent.succeeded` to `/api/stripe-webhook` → assert 200. Prints a step-by-step pass/fail summary; exits non-zero on failure. Requires the dev/prod server running + `.env` test keys; documented in README. **Not run in CI** (needs secrets, live external APIs, sends a real test email).
4. **CI workflow** — `.github/workflows/ci.yml`: on `pull_request` and push to `main`; Node 22 + pnpm (via `pnpm/action-setup`, `--frozen-lockfile`); steps: `eslint .`, `tsc --noEmit`, `vitest run`. No secrets required.
5. **README** gains a short "Development" section: install (pnpm), dev, test, test:integration, lint/typecheck.

## Decisions

- **Vitest over Jest** — first-class ESM/TS support without transform config; the standard pairing for modern Next.js repos; faster cold runs. Research-informed: v4.1.10 current, Node 22 supported.
- **No `next build` in CI** — Netlify deploy previews already prove the build on every PR; duplicating it in Actions would need Sanity/Stripe secrets in GitHub and double build time. CI = lint + types + unit tests (fast, secret-free). Reversible one-liner later.
- **API-level integration script over Playwright** (considered, deferred): the highest-risk path (payment → webhook → email) is exercised more reliably at the API level — no browser flakiness, no 150MB browser download, no CI secrets. Browser-level E2E adds value when UI regressions become the risk; deferred until then.
- **Colocated tests** (`lib/foo.test.ts` beside `lib/foo.ts`) — matches Next.js ecosystem convention; keeps context local. Test files are excluded from the app build by Next automatically (not in `app/`).
- **Refactor-for-testability is in scope** — extracting `resolveTicketRecipient` from the webhook route is the minimal change that makes the most dangerous decision (who gets the ticket) testable. Route behavior unchanged.
- **Node 22 pinned in CI** — matches local (v22.14.0); `package.json` gains `engines.node: ">=22"` to make it explicit.

## Error Behavior

- Test failures exit non-zero locally and in CI (workflow fails the PR check).
- Integration script asserts each step and reports which step failed with the server response body.
- Missing `.env` keys when running the integration script → immediate clear error naming the missing variable.

## Testing Strategy

The tests are the deliverable; verification of this spec is:

1. `pnpm test` green locally (all new unit tests pass).
2. `pnpm test:integration` green against a local prod build (full purchase loop).
3. The CI workflow passes **on this spec's own PR** — the PR is the proof the workflow works.
4. `pnpm typecheck`, `pnpm lint` clean.

## Out of Scope

- Playwright/browser E2E (deferred, see Decisions)
- Component/React testing (@testing-library) — no component logic currently warrants it
- Coverage thresholds/reporting
- Tests for the ticket-orders spec (#1) — lands with that implementation, using this harness
- Branch protection rules on GitHub (human task, optional: require the CI check before merge)
