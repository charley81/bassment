/* BASSMENT — Central Data (v1-latest)
 * Single source of truth for all page content.
 * Swap this file for Sanity CMS later. */

/* ── Types ── */
export interface NavItem { label: string; href: string; }
export interface SocialLink { label: string; href: string; }
export interface Event { id: string; title: string; date: string; support: string; image: string; }
export interface FaqItem { question: string; answer: string; }
export interface VenueStat { value: string; label: string; }
export interface GalleryImage { src: string; }
export interface SoundSpec { value: string; label: string; }
export interface ResidentDj { name: string; description: string; tags: string[]; image: string; }

/* ── Shared: Navigation + Social ── */
export const navItems: NavItem[] = [
  { label: "Events", href: "/events" },
  { label: "Sound System", href: "/sound-system" },
  { label: "Venue", href: "/venue" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks: SocialLink[] = [
  { label: "IG", href: "#" },
  { label: "SC", href: "#" },
  { label: "RA", href: "#" },
];

/* ── Home Page ── */
export const heroData = {
  eyebrow: "DRUM & BASS | TECHSTEP | DRUMFUNK | JUNGLE",
  headline: "FEEL THE BASS",
  description: "Manhattan's only Valve Sound System venue. 96,000 watts of hand-built analog power.",
  cta: "Get Tickets",
  image: "/images/hero-bg-home-3ab357.png",
};

export const featuredEvent = {
  date: "FRI / 24 OCT",
  title: "Dillinja — Valve Sound System Takeover",
  support: "with Lemon D, Goldie, and DJ Storm",
  description: "A legendary sound system meets its creators. The Valve Sound System returns to its spiritual Manhattan home for an all-night exploration of the foundation.",
  badge: "ON SALE NOW",
  cta: "Get Tickets",
  image: "/images/dillinja-valve-featured.png",
};

export const upcomingEvents: Event[] = [
  { id: "dlr-b2b-break", title: "DLR b2b Break", date: "Sat 01 Nov", support: "with SP:MC, Hydro", image: "/images/event-dlr.png" },
  { id: "goldie-timeless", title: "Goldie - Timeless Set", date: "Fri 07 Nov", support: "with MC GQ", image: "/images/event-goldie.png" },
  { id: "calibre-deep-cuts", title: "Calibre - Deep Cuts", date: "Sat 15 Nov", support: "All Night Long", image: "/images/event-calibre.png" },
  { id: "sully-tim-reaper", title: "Sully b2b Tim Reaper", date: "Fri 21 Nov", support: "Jungle Special", image: "/images/event-sully.png" },
];

export const venueHomeData = {
  eyebrow: "THE SPACE",
  title: "Built beneath the city. Tuned to the subway.",
  description: "Located four stories beneath 70 Pine Street, BASSMENT is a reinforced concrete chamber designed for physical frequency. No decor, no distractions, just the largest analog sound system in North America.",
  cta: "Explore the Venue →",
  image: "/images/venue-space-ab4185.png",
};

export const residentDjs: ResidentDj[] = [
  { name: "DJ STORM", description: "The First Lady of Drum & Bass. A master of the techstep and jungle foundations, curating the BASSMENT sound since night one.", tags: ["Jungle", "Amen", "Techstep"], image: "/images/dj-storm.png" },
  { name: "LEMON D", description: "Co-founder of Valve Sound System. A pioneer who shaped the sound of drum & bass from its earliest days.", tags: ["Valve", "Techstep", "Foundation"], image: "/images/dj-storm.png" },
  { name: "DOC SCOTT", description: "Founder of 31 Records. A selector whose sets span the full spectrum of drum & bass history.", tags: ["31 Records", "Jungle", "Drumfunk"], image: "/images/dj-storm.png" },
  { name: "FLIGHT", description: "One of the most respected voices in drum & bass. A selector with an encyclopedic knowledge of the music.", tags: ["Jungle", "Amen", "Deep Cuts"], image: "/images/dj-storm.png" },
  { name: "MANTRA", description: "Co-founder of Rupture. Championing the deeper, darker side of drum & bass since 2006.", tags: ["Rupture", "Techstep", "Amen"], image: "/images/dj-storm.png" },
  { name: "DOUBLE O", description: "Rupture co-founder. Pushing the boundaries of jungle and drumfunk with every selection.", tags: ["Jungle", "Drumfunk", "Rupture"], image: "/images/dj-storm.png" },
  { name: "ANT TC1", description: "Founder of Dispatch Recordings. A tastemaker whose imprint defines the cutting edge of drum & bass.", tags: ["Dispatch", "Techstep", "Deep"], image: "/images/dj-storm.png" },
];

export const newsletterData = {
  title: "GET EARLY ACCESS",
  description: "Tickets drop to our mailing list first. Don't get locked out.",
  placeholder: "your@email.com",
  cta: "Subscribe",
  disclaimer: "Unsubscribe at any timE",
};

/* ── Events Page ── */
export const eventsPageData: Event[] = [
  { id: "dlr-b2b-break", title: "DLR b2b Break", date: "Sat 01 Nov", support: "with SP:MC, Hydro", image: "/images/event-dlr-events.png" },
  { id: "goldie-timeless", title: "Goldie - Timeless Set", date: "Fri 07 Nov", support: "with MC GQ", image: "/images/event-goldie-events.png" },
  { id: "calibre-deep-cuts", title: "Calibre - Deep Cuts", date: "Sat 15 Nov", support: "All Night Long", image: "/images/event-calibre-events.png" },
  { id: "sully-tim-reaper", title: "Sully b2b Tim Reaper", date: "Fri 21 Nov", support: "Jungle Special", image: "/images/event-sully-events.png" },
  { id: "alix-perez", title: "Alix Perez", date: "Fri 28 Nov", support: "1985 Music Night", image: "/images/event-alix-perez.png" },
  { id: "doc-scott", title: "Doc Scott", date: "Sat 06 Dec", support: "31 Records Showcase", image: "/images/event-doc-scott.png" },
  { id: "om-unit", title: "Om Unit", date: "Fri 12 Dec", support: "with Skeptical", image: "/images/event-om-unit.png" },
  { id: "digital-spirit", title: "Digital & Spirit Tribute", date: "Fri 05 Sep", support: "Phantom Force", image: "/images/event-digital.png" },
  { id: "dj-storm-friends", title: "DJ Storm & Friends", date: "Wed 31 Dec", support: "New Year's Eve", image: "/images/event-storm.png" },
  { id: "loxy-b2b-ink", title: "Loxy b2b Ink", date: "Sat 25 Apr", support: "Renegade Hardware", image: "/images/event-loxy.png" },
  { id: "special-request", title: "Special Request", date: "Sat 09 May", support: "Spectral Frequency", image: "/images/event-special-request.png" },
  { id: "dbridge", title: "dBridge", date: "Sat 14 Feb", support: "Exit Records Night", image: "/images/event-dbridge.png" },
  { id: "ivy-lab", title: "Ivy Lab", date: "Sat 28 Feb", support: "20/20 LDN Takeover", image: "/images/event-ivy-lab.png" },
  { id: "commix", title: "Commix", date: "Sat 14 Mar", support: "Call to Mind Live", image: "/images/event-commix.png" },
  { id: "marcus-intalex", title: "Marcus Intalex", date: "Sat 28 Mar", support: "Foundation Night", image: "/images/event-marcus-intalex.png" },
  { id: "dom-roland", title: "Dom & Roland", date: "Sat 11 Apr", support: "Dubs from the Dungeon", image: "/images/event-dom-roland.png" },
];

/* ── Event Detail Page ── */
export const eventDetailData = {
  backLabel: "← Back to Events",
  image: "/images/dillinja-valve-detail.png",
  title: "DILLINJA — VALVE SOUND SYSTEM TAKEOVER",
  setTimes: [
    { label: "DOORS", time: "10:00 PM" },
    { label: "FIRST ACT", time: "11:00 PM" },
    { label: "HEADLINER", time: "1:00 AM" },
  ],
  dateLine: "Friday, 24 October 2025",
  countdown: [
    { num: "12", label: "DAYS" },
    { num: "08", label: "HRS" },
    { num: "45", label: "MIN" },
    { num: "22", label: "SEC" },
  ],
  cta: "Get Tickets — $25 GA / $50 VIP",
  badge: "ON SALE NOW",
  lineup: [
    { name: "Dillinja", time: "11PM–1AM" },
    { name: "Lemon D", time: "1AM–2:30AM" },
    { name: "DJ Marky", time: "2:30AM–4AM" },
    { name: "DJ Storm", time: "4AM–Close" },
  ],
  description: [
    "BASSMENT presents an exclusive all-night takeover featuring the legendary Valve Sound System. Designed and built by Dillinja and Lemon D, this is more than a sound system; it's the physical embodiment of jungle and drum & bass history.",
    "The Valve Sound System was created to provide the ultimate listening experience for the low-frequency sounds of the underground. With 96,000 watts of hand-built analog power, every frequency is tuned to perfection, ensuring that the bass is felt as much as it is heard.",
    "Join us for a journey through the foundation of the sound. Expect unreleased dubplates, classic anthems, and the purest technical execution from the scene's most respected pioneers. This event is strictly for those who know.",
  ],
  venueInfo: {
    label: "VENUE INFO",
    name: "70 Pine Street, Manhattan",
    details: ["Nearest subway: 2/3 Wall St, 4/5 Fulton St", "Doors: 10PM | 21+ with valid ID | Coat check available"],
    faqLink: "View full FAQ →",
  },
  mapImage: "/images/detail-map.png",
  relatedEvents: [
    { id: "dlr", title: "DLR b2b Break", date: "Sat 01 Nov", support: "with SP:MC, Hydro", image: "/images/detail-related-dlr.png" },
    { id: "goldie", title: "Goldie — Timeless", date: "Fri 07 Nov", support: "with MC GQ", image: "/images/detail-related-goldie.png" },
    { id: "calibre", title: "Calibre — Deep Cuts", date: "Sat 15 Nov", support: "All Night Long", image: "/images/detail-related-calibre.png" },
  ],
};

/* ── Sound System Page ── */
export const soundHeroData = {
  eyebrow: "THE VALVE SOUND SYSTEM",
  headline: "96,000 WATTS OF HAND-BUILT ANALOG POWER",
  quote: "\"Built by Dillinja & Lemon D, 2001. There is nothing else like it on earth.\"",
  image: "/images/sound-hero.png",
};

export const soundHistoryData = {
  label: "THE HISTORY",
  title: "Born in a London workshop. Perfected over decades.",
  paragraphs: [
    "In the late 90s, the evolution of drum and bass was hitting a physical limit. The sound systems of the time simply couldn't handle the extreme sub-bass frequencies being pioneered in the studio.",
    "Dillinja and Lemon D decided to take matters into their own hands. They spent years researching acoustic engineering, sourcing rare valve components, and hand-building every single cabinet to their exact specifications.",
  ],
  image: "/images/sound-history.png",
};

export const soundSpecs: SoundSpec[] = [
  { value: "96k", label: "Watts of Power" },
  { value: "2001", label: "Year Built" },
  { value: "Class A", label: "Valve Amplification" },
  { value: "20Hz–20kHz", label: "Frequency Range" },
];

export const soundSubwayData = {
  quote: "\"The building itself was reinforced to withstand the subway lines passing through Manhattan. We realized BASSMENT wasn't just a club; it was a physical resonance chamber for the Valve system.\"",
  image: "/images/sound-subway-7609bd.png",
};

export const soundCtaData = { label: "Experience It Yourself" };

/* ── Venue Page ── */
export const venueHeroData = {
  headline: "70 PINE STREET, MANHATTAN",
  subtitle: "Built above the Cobble Hill Tunnel. A space carved from the city's foundations.",
  image: "/images/venue-hero-7ee754.png",
};

export const venueHistoryData = {
  label: "THE HISTORY",
  paragraphs: [
    "The story of BASSMENT begins in 2018 with a search for a venue that could withstand the pure physical pressure of the Valve Sound System. After months of surveying lower Manhattan, we discovered a decommissioned cold-storage vault four stories beneath Pine Street.",
    "The reinforced concrete walls were over three feet thick, originally designed to keep heavy industrial machinery isolated from the subway vibrations passing just dozens of feet away. It was perfect: a structure that didn't just contain noise, but resonated with it.",
    "Soundproofing was an architectural impossibility; instead, we opted for total reinforcement. We tuned the room to the frequency of the nearby 2/3 and 4/5 subway lines, allowing the city's natural pulse to blend into the low-end foundations of the sound system.",
    "In 2021, Dillinja and Lemon D oversaw the final installation of the 96,000-watt Valve system. The hand-built analog stacks were bolted directly into the concrete bedrock, ensuring that every watt of power is felt as much as it is heard.",
    "Today, BASSMENT stands as the only dedicated Valve venue in the United States. We serve as a lighthouse for those who value the weight, the warmth, and the physical discipline of drum & bass.",
  ],
  pullQuote: "\"THIS IS NOT A CLUB... IT'S A VAULT\"",
};

export const venuePhotos: string[] = [
  "/images/venue-photo-1.png", "/images/venue-photo-2.png", "/images/venue-photo-3.png",
  "/images/venue-photo-4.png", "/images/venue-photo-5.png", "/images/venue-photo-6.png",
];

export const venueStats: VenueStat[] = [
  { value: "400", label: "CAPACITY" },
  { value: "10PM–4AM", label: "HOURS" },
  { value: "21+ with ID", label: "AGE" },
  { value: "Valve System", label: "SOUND" },
];

export const venuePlanData = {
  title: "PLAN YOUR VISIT",
  items: [
    "• 70 Pine Street, Manhattan. Entrance on Pine Street side.",
    "• Subway: 2/3 Wall St, 4/5 Fulton St, J/Z Broad St. All within 3 blocks.",
    "• Doors 10PM. Music until 4AM. Headliners typically 1AM–3AM.",
    "• 21+ with valid government ID. No exceptions.",
    "• Coat check: $5 cash or Venmo.",
    "• No large bags. No professional cameras without approval.",
  ],
  mapImage: "/images/venue-map.png",
  mapLabel: "70 PINE STREET, NEW YORK, NY 10005",
  cta: "See What's On →",
};

/* ── Gallery Page ── */
export const galleryImages: GalleryImage[] = [
  { src: "/images/gallery-01.png" }, { src: "/images/gallery-02.png" },
  { src: "/images/gallery-03.png" }, { src: "/images/gallery-04.png" },
  { src: "/images/gallery-05.png" }, { src: "/images/gallery-06.png" },
  { src: "/images/gallery-07.png" }, { src: "/images/gallery-08.png" },
  { src: "/images/gallery-09.png" }, { src: "/images/gallery-10.png" },
  { src: "/images/gallery-11.png" }, { src: "/images/gallery-12.png" },
  { src: "/images/gallery-13.png" }, { src: "/images/gallery-14.png" },
  { src: "/images/gallery-15.png" },
];

/* ── FAQ Page ── */
export const faqTitle = "FAQ";

export const faqItems: FaqItem[] = [
  { question: "Where is BASSMENT located?", answer: "70 Pine Street, Manhattan. Enter through the unmarked door on the east side of the building. Take the stairs down three flights. You'll hear it before you see it." },
  { question: "What are the age restrictions?", answer: "All events are 21+. Valid government ID required. No exceptions." },
  { question: "How do I buy tickets?", answer: "All tickets are sold through our website via DICE. Sign up to the mailing list for early access — our events sell out fast. Day-of tickets are occasionally available at the door, cash only." },
  { question: "What is the Valve Sound System?", answer: "The Valve Sound System is a custom-built, hand-wired analog sound system designed by Dillinja and Lemon D in 2001. It delivers 96,000 watts of pure Class A valve amplification — there is nothing else like it on earth." },
  { question: "Can I take photos inside?", answer: "No flash photography. Phone photos are fine. No professional cameras or recording equipment without prior approval." },
  { question: "Is there a coat check?", answer: "Yes. $5 cash or Venmo. Available from doors until 30 minutes before close." },
  { question: "What time do headliners usually go on?", answer: "Headliners typically play 1AM–3AM. Set times are posted on our Instagram the day of each event." },
  { question: "Do you serve food?", answer: "We do not serve food. There are several late-night spots within walking distance on Fulton Street." },
];

/* ── 404 Page ── */
export const notFoundData = {
  code: "404",
  title: "LOST IN THE BASS",
  description: "This page doesn't exist. Maybe it never did. The bass can disorient.",
  cta: "Back to Home →",
};

/* ── Contact Page ── */
export const contactData = {
  title: "CONTACT US",
  subtitle: "Get in touch with the BASSMENT team",
};

/* ── Footer ── */
export const footerData = {
  socialsLabel: "SOCIAL",
  subscribeLabel: "SUBSCRIBE",
  newsletterCta: "GET OUR NEWSLETTER",
  brandName: "BASSMENT",
  copyright: "© BASSMENT 2026",
  designerCredit: "DESIGNED & DEVELOPED: CHRISTOPHER HARLEY",
  columns: [
    { title: "BASSMENT", links: [{ label: "CALENDAR", href: "#" }, { label: "NEWS", href: "#" }] },
    { title: "COMMUNITY", links: [{ label: "FAQ & CONTACT", href: "/faq" }, { label: "ABOUT", href: "#" }, { label: "OUR THESIS", href: "#" }, { label: "VIP INFO: +34 917234510", href: "#" }] },
  ],
};
