/* BASSMENT — Footer (v1-latest) */
import Link from "next/link";
import { socialLinks, footerData } from "@/lib/data";

export function Footer() {
  return (
    <footer className="py-60 md:py-100 px-6 md:px-20 pb-10">
      <div className="max-w-1728 mx-auto flex flex-col gap-16 md:gap-20">
        <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-0">
          <div className="flex flex-col gap-12 w-full md:w-400">
            <div className="flex flex-col gap-4">
              <span className="text-label text-bass-grey-med">{footerData.socialsLabel}</span>
              <div className="flex gap-3">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-bass-grey-dark border border-primary hover:bg-primary/20 transition-colors" aria-label={s.label}>
                    <span className="text-social-icon text-bass-grey-light">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-label text-bass-grey-med">{footerData.subscribeLabel}</span>
              <Link href="/#newsletter" className="inline-flex h-14 px-6 items-center justify-center rounded-lg border border-bass-grey-med text-label text-bass-white hover:border-primary transition-colors w-fit">
                {footerData.newsletterCta}
              </Link>
            </div>
          </div>

          <div className="flex gap-20 md:gap-120">
            {footerData.columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-6">
                <span className="text-label text-bass-grey-med">{col.title}</span>
                <div className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <Link key={link.label} href={link.href} className="text-footer-link text-bass-white hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-8">
          <hr className="border-t border-bass-input" />
          <p className="text-display text-bass-grey-med select-none">{footerData.brandName}</p>
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
            <span className="text-label-medium text-bass-grey-med">{footerData.copyright}</span>
            <span className="text-label-medium text-bass-grey-med">{footerData.designerCredit}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
