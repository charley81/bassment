# BASSMENT — Project Overview

## Project Summary

BASSMENT is a high-performance, headless website for a fictional world-class Drum & Bass venue in Manhattan. The site is the portfolio centerpiece for a senior UX Engineer transitioning into the agency world. It must demonstrate production-grade architecture, polished interactions, and meticulous attention to every application state.

## Business Goals

1. **Sell tickets** — Primary conversion. Users purchase tickets via Ticket Fairy integration.
2. **Drive venue attendance** — Get people physically to the venue.
3. **Mailing list signups** — Secondary conversion. Capture emails for future event marketing and early ticket access.

## Target Audience

Dedicated Drum & Bass fans and underground club culture participants, ages 21–50. They care about sound quality, artist authenticity, and the cultural credibility of the venue.

---

## Tech Stack

| Layer         | Technology           | Purpose                                                          |
| ------------- | -------------------- | ---------------------------------------------------------------- |
| Frontend      | Next.js (App Router) | React framework, server components, ISR                          |
| Language      | TypeScript           | Type safety throughout                                           |
| CMS           | Sanity               | Headless content management for all site content                 |
| Design System | shadcn/ui            | Component primitives, themed to brand                            |
| Styling       | Tailwind CSS         | Utility-first styling                                            |
| Animation     | Framer Motion + GSAP | Scroll-driven and interaction animations                         |
| Ticketing     | Ticket Fairy         | External ticket sales via API/widget integration                 |
| Email         | Resend               | Transactional email delivery (newsletter confirmation, waitlist) |
| Maps          | Google Maps API      | Embedded venue location map                                      |
| Hosting       | Vercel               | Deployment, edge functions, analytics                            |
| Design Source | Figma (MCP)          | Design specs and assets consumed via Figma MCP integration       |

---

### Rendering Strategy

- **Server Components** for all data fetching from Sanity (GROQ queries)
- **Client Components** for interactivity: ticket purchase flows, newsletter forms, gallery lightbox, map
- **ISR** with on-demand revalidation triggered by Sanity webhooks
- **Static generation** for content that rarely changes (venue info, FAQ, sound system page)

---

## Integrations

### Ticket Fairy

- **Purpose:** Sell tickets for events
- **Implementation:** External API integration. Event detail pages feature a "Get Tickets" CTA that opens the Ticket Fairy purchase flow — either via redirect, embedded widget, or modal depending on API capabilities
- **States to handle:** Link active (tickets available), link disabled (sold out), link absent (at door only, past event)
- **Ticket status mapping:** On Sale, Low Tickets, Sold Out, At Door Only, Past — surfaced from either Sanity (manual) or Ticket Fairy API (if real-time status available)

### Sanity CMS

- **Purpose:** All site content editable by non-technical promoters
- **Studio:** Customized Sanity Studio with simplified inputs, field-level validation, and scheduled publishing
- **Content types:** Events, Artists, FAQs, Gallery, Pages (with flexible block builder for Home), Site Settings
- **Webhooks:** Trigger Vercel on-demand revalidation on publish/update
- **Preview:** Vercel Preview Deployments for draft content review

### Resend

- **Purpose:** Send transactional emails
- **Use cases:**
  - Newsletter signup confirmation
  - Waitlist confirmation (for sold-out events)
  - (Future) Ticket purchase confirmation if Ticket Fairy webhooks are consumed
- **Implementation:** Server Actions or API Routes in Next.js, calling Resend SDK

### Google Maps

- **Purpose:** Display venue location
- **Pages:** Venue page, Event Detail page
- **Implementation:** Client-side Google Maps component, static map fallback for users who decline cookies
- **Data:** Venue address, coordinates stored in Sanity Site Settings

---

## Application States

Every interactive component must handle these states:

| State              | Description                                                                   |
| ------------------ | ----------------------------------------------------------------------------- |
| Loading            | Skeleton loaders matching content shape                                       |
| Empty              | Contextual empty state messages with next action                              |
| Error              | Error boundaries with retry mechanisms                                        |
| Success            | Confirmation messages for form submissions                                    |
| Active/Hover/Focus | Visible interactive states on all elements                                    |
| Disabled           | Muted state for unavailable actions (sold out, past events)                   |
| Edge Cases         | Timezone handling for event dates, countdown expiration, sold-out transitions |

---
