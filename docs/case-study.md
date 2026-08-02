# BASSMENT — Case Study

---

## Hero Section

![Hero Mockup Image](../docs/assets/hero-mockup.png)
<!-- TODO: replace with a real hero capture of clubbassment.com (home hero, dark room + red glow) -->

# BASSMENT

---

## About the Project

BASSMENT is an underground electronic music venue in Manhattan, home to a
hand-built Valve sound system and a rotating cast of world-class selectors.
We designed and built the venue's entire digital presence — and then went
further: instead of handing ticket sales to a third-party platform (fees,
off-brand redirects, zero customer data), we engineered a **fully custom
ticketing platform** inside the site itself. Buyers check out with an
embedded Stripe flow that never leaves the brand, receive a branded email
ticket within seconds, and can recover it self-serve — while the venue
manages events, artists, capacity, and attendee lists from its own CMS.

### Project Details

| Field | Value |
| :--- | :--- |
| **Title** | BASSMENT |
| **Industry** | Music & Nightlife / Live Events |
| **Category** | Web Design, Web Application, E-commerce (Ticketing) |
| **Tech Stack** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Sanity CMS, Stripe, Resend, Netlify, Vitest, GitHub Actions, Figma |
| **Live Link** | [https://clubbassment.com](https://clubbassment.com) |

---

## Introduction
> *“The making of the new BASSMENT website”*

BASSMENT's identity lives in a basement: low ceilings, subway tile, and a
Valve sound system that people travel across boroughs to hear. The brand
had physical gravity but no digital presence to match — and its ticketing
options all involved sending hyped customers away to a generic platform at
the exact moment of highest intent.

The brief was twofold. First, a marketing site that feels like the room:
dark, loud typography, photography that smells like fog machine. Second —
and the real engineering challenge — **own the entire purchase loop**:
sell tickets on-site, deliver them reliably by email, and give both buyers
and the venue the tools to handle everything that goes wrong in real life
(lost emails, typos, sellouts) without middleware taking a cut.

Constraints: non-developers had to run everything after launch (events,
lineups, FAQs, gallery); the site had to be fast on a phone outside the
club at 1am; and the checkout had to be trustworthy enough to put a credit
card into.

---

## About the Design

The design system is the venue, translated to tokens. Near-black reds
(`hsl(351, 80%, 2%)`) form the canvas — the color of a dark room lit by a
single exit sign — with a saturated red primary (`hsl(357, 74%, 47%)`)
used sparingly for calls to action, like light catching a surface.
Typography is loud and compressed: uppercase, tight word-spacing, scale
that reads from across the room. The recurring headline motif — **"You're
In."** — works as both confirmation and invitation, and carries from the
site into the ticket email verbatim.

Photography does the atmospheric work: grainy, high-ISO shots of DJs and
dance floors, mostly desaturated, so the red UI elements feel like light
sources. The Sound System page treats the Valve rig like a product page —
spec sheets, heritage copy, and subway-tile textures that root the brand
in New York. The interface system was designed in Figma and implemented as
a token-driven Tailwind theme with shadcn/ui primitives, so every page
draws from the same dark vocabulary.

### Design Mockups

![Laptop Mockup](../docs/assets/laptop-mockup.png)
<!-- TODO: homepage + event detail on laptop -->
![Mobile/Detail Screens](../docs/assets/mobile-screens.png)
<!-- TODO: buy flow, confirmation with order ref, /tickets/resend on mobile -->

---

## Development

- **Frontend Architecture:** Next.js 16 (App Router) with React 19 and
  TypeScript. Marketing pages are statically generated with ISR and
  revalidated instantly via a Sanity content webhook; transactional paths
  (payment, webhook, email) are uncached and server-only. The image
  pipeline was rebuilt after profiling showed 15–19MB source PNGs causing
  6.7-second cold image optimization — sources were re-encoded to
  right-sized JPGs (335MB → 53MB) and every `fill` image given a correct
  `sizes` attribute. Result: Lighthouse **100 Performance**.

- **Content Management:** Sanity CMS with an embedded Studio at `/studio`.
  Events, artists, FAQs, gallery, venue, and sound-system pages are all
  editor-managed — including a **Tickets** collection the venue uses as a
  live attendee list, and per-event **capacity** that flips events to
  sold-out automatically.

- **Key Challenges & Solutions:**

  **1. The ticket that never arrived.** Early testing surfaced a silent
  failure: buyers weren't receiving tickets at all. Root-caused through
  the whole chain — the checkout never captured an email (the Stripe
  billing-details field only appears for payment methods that require it,
  which is never for cards), and the sending domain wasn't verified, so
  the email provider rejected every non-owner recipient. The fix became a
  redesign of the purchase loop: a validated email field at checkout, the
  address attached to the Stripe PaymentIntent, a verified sending
  subdomain with DKIM/SPF, and configuration that *fails loudly* in
  production instead of silently dropping customer email.

  **2. Payments without a database.** Tickets needed order records, but
  the stack had no database — so Sanity became the order store. Every
  purchase is a `ticket` document whose ID **is** the Stripe PaymentIntent
  ID. The webhook writes the ticket and increments the event's
  `ticketsSold` counter in **one atomic transaction**: Stripe retries and
  duplicate webhook deliveries conflict on the ID and abort both halves,
  making double-sells, duplicate emails, and counter drift structurally
  impossible — no Redis, no in-memory state, no lost orders. An
  `emailSentAt` guard recovers the "recorded but email failed" case on
  automatic retry. *(Spec: `docs/ticket-orders/spec.md`)*

  **3. Recovery without a support desk.** Real buyers typo emails and lose
  threads. The self-serve flow at `/tickets/resend` re-sends tickets with
  a deliberately identical response whether or not the email exists
  (no account enumeration), throttled durably by a timestamp on the order
  itself. A deterministic order reference (`BSMT-XXXXXX`, derived from the
  PaymentIntent) appears on the confirmation page and in the email, so any
  support conversation starts with a lookup key. *(Spec:
  `docs/ticket-resend/spec.md`)*

  **4. Trust through tests.** The payment logic grew a safety net from
  zero: 57 Vitest unit tests covering the who-gets-the-ticket decisions,
  an API-level integration script that runs a complete purchase against a
  running server (intent → email attach → test-card confirm → signed
  webhook → replay tolerance), and GitHub Actions CI gating every PR.
  Every feature in the checkout was built spec-first, with the specs kept
  in the repo (`docs/`). *(Spec: `docs/ci-and-tests/spec.md`)*

---

## Conclusion
> *“A Website as Good as the Sound System”*

BASSMENT now owns its entire front door: brand, content, and revenue. The
venue publishes events and watches attendee lists fill in its own CMS;
buyers get a checkout that never leaves the room's aesthetic and a ticket
in their inbox seconds later, with self-serve recovery when life happens.

Measured outcomes:

- **Lighthouse: 100 Performance · 94 Accessibility · 100 Best Practices · 100 SEO**
- Image payload: **335MB → 53MB**; cold-start image optimization **6.7s → 0.3s**
- Purchase loop verified end-to-end in production: buy → persisted order →
  branded ticket email delivered from the venue's own domain
- **57 automated tests + CI** guarding every merge; spec-driven
  development with design docs for each feature
- Zero ticketing-platform fees per sale

---

## Other Projects

### [Project 1 Name]
![Thumbnail](https://via.placeholder.com/300x200/999999/ffffff?text=Project+1)
*Tags:* `[Web Design]`, `[Branding]`
[Brief description of project 1.]

### [Project 2 Name]
![Thumbnail](https://via.placeholder.com/300x200/888888/ffffff?text=Project+2)
*Tags:* `[UI/UX]`, `[Animation]`
[Brief description of project 2.]

### [Project 3 Name]
![Thumbnail](https://via.placeholder.com/300x200/777777/ffffff?text=Project+3)
*Tags:* `[SaaS]`, `[Productivity]`
[Brief description of project 3.]

---

## Let’s Weave Your Vision Together

Have a project in mind? Let’s chat about how we can bring it to life.

**Find me at:**
- Email: `chrisharley81@gmail.com`
- LinkedIn: `[linkedin.com/in/your-profile]`
- Portfolio: `[your-portfolio.com]`

**Leave a message:**
- **Name:** [Enter your name]
- **Email:** [Enter your email]
- **Message:** [Enter your message]

[Button: Schedule a call]

---

*Designed & developed by Christopher Harley*
*© 2026*
