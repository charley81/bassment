/*
 * ═══════════════════════════════════════════════════════════
 * BASSMENT — Mock Data
 * Shapes match future Sanity CMS schemas.
 * Content extracted from Figma nodes:
 *   Canvas: High-fidelity Work > home (#187:178)
 * ═══════════════════════════════════════════════════════════
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  support: string;
  imageRef: string;
  soldOut?: boolean;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface TagItem {
  label: string;
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

/* ── Navigation ── */
export const navItems: NavItem[] = [
  { label: "Events", href: "/events" },
  { label: "Sound System", href: "/sound-system" },
  { label: "Venue", href: "/venue" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/* ── Social Links ── */
export const socialLinks = [
  { label: "IG", href: "#" },
  { label: "SC", href: "#" },
  { label: "RA", href: "#" },
];

/* ── Hero Section ── */
export const heroData = {
  eyebrow: "DRUM & BASS | TECHSTEP | DRUMFUNK | JUNGLE",
  headline: "FEEL THE BASS",
  description:
    "Manhattan's only Valve Sound System venue. 96,000 watts of hand-built analog power.",
  cta: "Get Tickets",
};

/* ── Featured Event ── */
export const featuredEvent = {
  date: "FRI / 24 OCT",
  title: "Dillinja — Valve Sound System Takeover",
  support: "with Lemon D, Goldie, and DJ Storm",
  description:
    "A legendary sound system meets its creators. The Valve Sound System returns to its spiritual Manhattan home for an all-night exploration of the foundation.",
  badge: "ON SALE NOW",
  cta: "Get Tickets",
};

/* ── Upcoming Events ── */
export const upcomingEventsTitle = {
  heading: "UPCOMING",
  viewAllLabel: "View All Events →",
};

export const upcomingEvents: Event[] = [
  {
    id: "dlr-b2b-break",
    title: "DLR b2b Break",
    date: "Sat 01 Nov",
    support: "with SP:MC, Hydro",
    imageRef: "event-dlr",
  },
  {
    id: "goldie-timeless",
    title: "Goldie - Timeless Set",
    date: "Fri 07 Nov",
    support: "with MC GQ",
    imageRef: "event-goldie",
  },
  {
    id: "calibre-deep-cuts",
    title: "Calibre - Deep Cuts",
    date: "Sat 15 Nov",
    support: "All Night Long",
    imageRef: "event-calibre",
  },
  {
    id: "sully-tim-reaper",
    title: "Sully b2b Tim Reaper",
    date: "Fri 21 Nov",
    support: "Jungle Special",
    imageRef: "event-sully",
  },
];

/* ── Venue Section ── */
export const venueData = {
  eyebrow: "THE SPACE",
  title: "Built beneath the city. Tuned to the subway.",
  description:
    "Located four stories beneath 70 Pine Street, BASSMENT is a reinforced concrete chamber designed for physical frequency. No decor, no distractions, just the largest analog sound system in North America.",
  cta: "Explore the Venue →",
};

/* ── Resident DJ Section ── */
export const residentDj = {
  label: "RESIDENT",
  name: "DJ STORM",
  description:
    "The First Lady of Drum & Bass. A master of the techstep and jungle foundations, curating the BASSMENT sound since night one.",
  tags: ["Jungle", "Amen", "Techstep"],
};

/* ── Newsletter Section ── */
export const newsletterData = {
  title: "GET EARLY ACCESS",
  description:
    "Tickets drop to our mailing list first. Don't get locked out.",
  placeholder: "your@email.com",
  cta: "Subscribe",
  disclaimer: "Unsubscribe at any timE",
};

/* ── Footer ── */
export const footerData = {
  brandName: "BASSMENT",
  copyright: "© BASSMENT 2026",
  designerCredit: "DESIGNED & DEVELOPED: CHRISTOPHER HARLEY",
  socialsLabel: "SOCIAL",
  subscribeLabel: "SUBSCRIBE",
  newsletterCta: "GET OUR NEWSLETTER",
  linkGroups: [
    {
      title: "BASSMENT",
      links: [
        { label: "CALENDAR", href: "#" },
        { label: "NEWS", href: "#" },
      ],
    },
    {
      title: "COMMUNITY",
      links: [
        { label: "FAQ & CONTACT", href: "#" },
        { label: "ABOUT", href: "#" },
        { label: "OUR THESIS", href: "#" },
        { label: "VIP INFO: +34 917234510", href: "#" },
      ],
    },
  ],
};

/* ── Venue Stats ── */
export const venueStats: StatItem[] = [
  { value: "400", label: "CAPACITY" },
  { value: "10PM–4AM", label: "HOURS" },
  { value: "21+ with ID", label: "AGE" },
  { value: "Valve System", label: "SOUND" },
];
