/*
 * BASSMENT — Footer (v1-latest)
 * Source: Figma template EL-2088112b
 * Layout: column, padding: 100px 80px 40px, gap: 80px, fill #090102
 */

import Link from "next/link";

const socialLinks = [
  { label: "IG", href: "#" },
  { label: "SC", href: "#" },
  { label: "RA", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-bass-dark)] py-[100px] px-20 pb-10">
      <div className="max-w-[1728px] mx-auto flex flex-col gap-20">
        <div className="flex justify-between">
          {/* Left — width 400, gap 48 */}
          <div className="flex flex-col gap-12 w-[400px]">
            <div className="flex flex-col gap-4">
              <span className="text-base font-bold uppercase text-[var(--color-bass-grey-med)]">
                SOCIAL
              </span>
              <div className="flex gap-3">
                {socialLinks.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-bass-grey-dark)] border border-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors"
                    aria-label={s.label}
                  >
                    <span className="text-base text-[var(--color-bass-grey-light)]">
                      {s.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-base font-bold uppercase text-[var(--color-bass-grey-med)]">
                SUBSCRIBE
              </span>
              <Link
                href="#newsletter"
                className="inline-flex h-14 px-6 items-center justify-center rounded-lg border border-[var(--color-bass-grey-med)] text-base font-bold uppercase text-white hover:border-[var(--color-primary)] transition-colors"
              >
                GET OUR NEWSLETTER
              </Link>
            </div>
          </div>

          {/* Right columns — gap 120 */}
          <div className="flex gap-[120px]">
            <div className="flex flex-col gap-6">
              <span className="text-base font-bold uppercase text-[var(--color-bass-grey-med)]">
                BASSMENT
              </span>
              <div className="flex flex-col gap-3">
                {["CALENDAR", "NEWS"].map((l) => (
                  <Link
                    key={l}
                    href="#"
                    className="text-base font-medium uppercase text-white hover:text-[var(--color-primary)] transition-colors"
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-base font-bold uppercase text-[var(--color-bass-grey-med)]">
                COMMUNITY
              </span>
              <div className="flex flex-col gap-3">
                {[
                  "FAQ & CONTACT",
                  "ABOUT",
                  "OUR THESIS",
                  "VIP INFO: +34 917234510",
                ].map((l) => (
                  <Link
                    key={l}
                    href="#"
                    className="text-base font-medium uppercase text-white hover:text-[var(--color-primary)] transition-colors"
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Branding bottom */}
        <div className="flex flex-col items-stretch gap-8">
          <hr className="border-t border-[#222222]" />
          <p className="text-[128px] font-extrabold leading-none uppercase text-center text-[var(--color-bass-grey-med)] select-none">
            BASSMENT
          </p>
          <div className="flex justify-between items-center">
            <span className="text-base font-medium uppercase text-[var(--color-bass-grey-med)]">
              © BASSMENT 2026
            </span>
            <span className="text-base font-medium uppercase text-[var(--color-bass-grey-med)]">
              DESIGNED & DEVELOPED: CHRISTOPHER HARLEY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
