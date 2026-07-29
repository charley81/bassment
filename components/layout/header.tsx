import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { navItems, socialLinks } from '@/lib/data'

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 md:px-20 max-w-[1728px] mx-auto w-full">
      <Link
        href="/"
        className="text-logo text-bass-white transition-colors shrink-0"
      >
        BASSMENT
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-10">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-nav text-bass-white hover:text-(--color-primary) transition-colors"
          >
            {item.label}
          </Link>
        ))}
        <div className="w-px h-4 bg-bass-grey-med" />
        <div className="flex items-center gap-3">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-bass-grey-dark border border-(--color-primary) text-social-icon text-bass-grey-light hover:text-bass-white transition-colors"
              aria-label={s.label}
            >
              {s.label}
            </a>
          ))}
        </div>
        <Link
          href="/events"
          className="h-10 px-5 flex items-center justify-center rounded-lg text-btn-sm text-bass-white hover:text-(--color-primary) transition-colors"
        >
          Get Tickets
        </Link>
      </nav>

      {/* Mobile hamburger */}
      <Sheet>
        <SheetTrigger className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-bass-border text-bass-white">
          ☰
        </SheetTrigger>
        <SheetContent
          side="right"
          className="bg-bass-dark border-bass-border pt-16"
        >
          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-nav text-bass-white hover:text-(--color-primary) transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <hr className="border-bass-grey-dark" />
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-bass-grey-dark border border-(--color-primary) text-social-icon text-bass-grey-light"
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <Link
              href="/events"
              className="h-10 px-5 flex items-center justify-center rounded-lg border border-bass-border text-btn-sm text-bass-white w-fit"
            >
              Get Tickets
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
