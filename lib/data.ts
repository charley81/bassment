/* BASSMENT — Hardcoded UI copy for the shell (nav, footer, newsletter,
 * contact, 404). Page content (events, FAQs, gallery, venue, sound system)
 * lives in Sanity — see lib/sanity/. */

import type { NavItem, SocialLink } from '@/lib/types'

/* ── Shared: Navigation + Social ── */
export const navItems: NavItem[] = [
  { label: 'Events', href: '/events' },
  { label: 'Sound System', href: '/sound-system' },
  { label: 'Venue', href: '/venue' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export const socialLinks: SocialLink[] = [
  { label: 'IG', href: 'https://www.instagram.com/' },
  { label: 'FB', href: 'https://www.facebook.com/' },
  { label: 'YT', href: 'https://www.youtube.com/' },
]

/* ── Home Page ── */
export const heroData = {
  eyebrow: 'DRUM & BASS | TECHSTEP | DRUMFUNK | JUNGLE',
  headline: 'FEEL THE BASS',
  description:
    "Manhattan's only Valve Sound System venue. 96,000 watts of hand-built analog power.",
  cta: 'Get Tickets',
  image: '/images/hero-bg-home-3ab357.jpg',
}

export const venueHomeData = {
  eyebrow: 'THE SPACE',
  title: 'Built beneath the city. Tuned to the subway.',
  description:
    'Located four stories beneath 70 Pine Street, BASSMENT is a reinforced concrete chamber designed for physical frequency. No decor, no distractions, just the largest analog sound system in North America.',
  cta: 'Explore the Venue →',
  image: '/images/venue-space-ab4185.jpg',
}

export const newsletterData = {
  title: 'GET EARLY ACCESS',
  description: "Tickets drop to our mailing list first. Don't get locked out.",
  placeholder: 'your@email.com',
  cta: 'Subscribe',
  disclaimer: 'Unsubscribe at any time',
}

/* ── Events Page ── */

/* ── Event Detail Page ── */
export const eventDetailData = {
  backLabel: '← Back to Events',
  title: 'DILLENJA — VALVE SOUND SYSTEM TAKEOVER',
  setTimes: [
    { label: 'DOORS', time: '10:00 PM' },
    { label: 'FIRST ACT', time: '11:00 PM' },
    { label: 'HEADLINER', time: '1:00 AM' },
  ],
  dateLine: 'Friday, 24 October 2025',
  countdown: [
    { num: '12', label: 'DAYS' },
    { num: '08', label: 'HRS' },
    { num: '45', label: 'MIN' },
    { num: '22', label: 'SEC' },
  ],
  cta: 'Get Tickets — $25 GA / $50 VIP',
  badge: 'ON SALE NOW',
  lineup: [
    { name: 'Dillenja', time: '11PM–1AM' },
    { name: 'Lemond', time: '1AM–2:30AM' },
    { name: 'DJ Marq', time: '2:30AM–4AM' },
    { name: 'DJ Storme', time: '4AM–Close' },
  ],
  description: [
    "BASSMENT presents an exclusive all-night takeover featuring the legendary Valve Sound System. Designed and built by Dillenja and Lemond, this is more than a sound system; it's the physical embodiment of jungle and drum & bass history.",
    'The Valve Sound System was created to provide the ultimate listening experience for the low-frequency sounds of the underground. With 96,000 watts of hand-built analog power, every frequency is tuned to perfection, ensuring that the bass is felt as much as it is heard.',
    "Join us for a journey through the foundation of the sound. Expect unreleased dubplates, classic anthems, and the purest technical execution from the scene's most respected pioneers. This event is strictly for those who know.",
  ],
  venueInfo: {
    label: 'VENUE INFO',
    name: '70 Pine Street, Manhattan',
    details: [
      'Nearest subway: 2/3 Wall St, 4/5 Fulton St',
      'Doors: 10PM | 21+ with valid ID | Coat check available',
    ],
    faqLink: 'View full FAQ →',
  },
}

/* ── Venue Page ── */
export const venuePlanData = {
  title: 'PLAN YOUR VISIT',
  items: [
    '• 70 Pine Street, Manhattan. Entrance on Pine Street side.',
    '• Subway: 2/3 Wall St, 4/5 Fulton St, J/Z Broad St. All within 3 blocks.',
    '• Doors 10PM. Music until 4AM. Headliners typically 1AM–3AM.',
    '• 21+ with valid government ID. No exceptions.',
    '• Coat check: $5 cash or Venmo.',
    '• No large bags. No professional cameras without approval.',
  ],
  mapLabel: '70 PINE STREET, NEW YORK, NY 10005',
  cta: "See What's On →",
}

/* ── 404 Page ── */
export const notFoundData = {
  code: '404',
  title: 'LOST IN THE BASS',
  description:
    "This page doesn't exist. Maybe it never did. The bass can disorient.",
  cta: 'Back to Home →',
}

/* ── Contact Page ── */
export const contactData = {
  title: 'CONTACT US',
  subtitle: 'Get in touch with the BASSMENT team',
}

/* ── Footer ── */
export const footerData = {
  socialsLabel: 'SOCIAL',
  subscribeLabel: 'SUBSCRIBE',
  newsletterCta: 'GET OUR NEWSLETTER',
  brandName: 'BASSMENT',
  copyright: '© BASSMENT 2026',
  designerCredit: 'DESIGNED & DEVELOPED: CHRISTOPHER HARLEY',
  columns: [
    {
      title: 'BASSMENT',
      links: [
        { label: 'EVENTS', href: '/events' },
        { label: 'VENUE', href: '/venue' },
        { label: 'SOUND SYSTEM', href: '/sound-system' },
        { label: 'GALLERY', href: '/gallery' },
      ],
    },
    {
      title: 'COMMUNITY',
      links: [
        { label: 'FAQ', href: '/faq' },
        { label: 'CONTACT', href: '/contact' },
        { label: 'TICKET HELP', href: '/tickets/resend' },
        { label: 'ABOUT', href: '/venue' },
        { label: '212-567-0500', href: 'tel:+12125670500' },
      ],
    },
  ],
}
