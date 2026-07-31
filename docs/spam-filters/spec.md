# Netlify Forms Spam Filters — Spec

## What

Add spam protection to the contact and newsletter forms using Netlify's built-in honeypot field. Bots auto-fill hidden fields; humans don't. If the honeypot field has a value, Netlify silently discards the submission.

## Context

Both the contact form and newsletter form submit to Netlify Forms via AJAX POST to `/__forms.html`. Neither has spam protection. The contact form already gets some real traffic. Honeypot is the simplest, zero-dependency approach — no API keys, no CAPTCHA challenges for users.

**Relevant files:**
- `components/forms/contact-form.tsx` — contact form
- `components/forms/newsletter-form.tsx` — newsletter form
- `public/__forms.html` — static form definitions for Netlify detection

## Requirements

1. Add a hidden honeypot field (`name="bot-field"`) to both forms
2. The field is visually hidden from humans (CSS `hidden` or `opacity-0 absolute`)
3. Bots auto-fill the field; humans leave it empty
4. Netlify's form handling automatically rejects submissions with a filled honeypot
5. No API keys or external services required
6. The field is included in `__forms.html` for deploy-time detection

## Design

### Honeypot Field

```html
<input name="bot-field" type="text" class="hidden" tabindex="-1" autocomplete="off" />
```

- `class="hidden"` — not visible to humans
- `tabindex="-1"` — excluded from keyboard navigation
- `autocomplete="off"` — prevents browser autofill
- Netlify's form handler checks `bot-field` — if it has any value, the submission is flagged as spam

### Implementation

Two small changes to each form component:

1. Add the honeypot input inside the `<form>` tag
2. Add the field name to `__forms.html`

No server-side changes. No new dependencies.

## Decisions

### D1: Honeypot over reCAPTCHA

**Choice:** Honeypot field only. No reCAPTCHA.

**Why:** reCAPTCHA requires a Google API key, adds a visual challenge that interrupts the user experience, and is overkill for a venue site. Honeypot catches 95%+ of automated spam with zero friction.

**Reversible:** Yes — can add reCAPTCHA later if needed.

### D2: Single honeypot field name

**Choice:** `name="bot-field"` — Netlify's documented honeypot convention.

**Why:** Netlify's form handler automatically checks this field name. No custom validation needed.

**Reversible:** Yes.

## Invariants

- Honeypot field is not visible or focusable by keyboard
- Legitimate form submissions are not affected
- Both forms have the honeypot field in their React component AND in `__forms.html`

## Testing Strategy

- `next build` passes
- Submit each form as a human → succeeds
- Submit each form with `bot-field` filled → Netlify rejects silently
- Verify the hidden field is not focusable via Tab key

## Out of Scope

- reCAPTCHA integration
- Custom spam rules or rate limiting
- Submission logging or analytics
