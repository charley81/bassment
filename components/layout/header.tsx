/*
 * BASSMENT — Header (v1-latest)
 * Source: Figma template EL-fe712127, node #368:115
 * Layout: row, padding: 0px 80px, justifyContent: space-between
 *   sizing: fixed 1728×80, position: absolute (x:0, y:0)
 */

import Link from "next/link";

const navItems = [
  { label: "Events", href: "/events" },
  { label: "Sound System", href: "/sound-system" },
  { label: "Venue", href: "/venue" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "IG", href: "#" },
  { label: "SC", href: "#" },
  { label: "RA", href: "#" },
];

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-20 max-w-[1728px] mx-auto w-full">
      {/* Logo — ExtraBold 800, 24px, white */}
      <Link
        href="/"
        className="font-extrabold text-2xl text-white hover:text-[var(--color-primary)] transition-colors"
      >
        BASSMENT
      </Link>

      <nav className="flex items-center gap-10">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-base font-normal text-white hover:text-[var(--color-primary)] transition-colors"
          >
            {item.label}
          </Link>
        ))}

        {/* Separator — 1×16px */}
        <div className="w-px h-4 bg-[var(--color-bass-grey-med)]" />

        {/* Social links — 40×40 circles, #533C3D bg, #D31F28 border, borderRadius 32px */}
        <div className="flex items-center gap-3">
          {socialLinks.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-bass-grey-dark)] border border-[var(--color-primary)] text-base text-[var(--color-bass-grey-light)] hover:text-white transition-colors"
              aria-label={s.label}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {/* Get Tickets — Medium 500, 14px */}
        <Link
          href="/events"
          className="h-10 px-5 flex items-center justify-center rounded-lg text-sm font-medium text-white hover:text-[var(--color-primary)] transition-colors"
        >
          Get Tickets
        </Link>
      </nav>
    </header>
  );
}
