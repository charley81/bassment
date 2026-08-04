/* BASSMENT — Sound System */
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SoundHero } from "@/components/sections/sound-hero";
import { SoundHistory } from "@/components/sections/sound-history";
import { SoundSpecs } from "@/components/sections/sound-specs";
import { SoundQuote } from "@/components/sections/sound-quote";
import { getSoundSystemPage } from "@/lib/sanity/fetch";
import { sanityImageUrl } from "@/lib/sanity/image";

export const revalidate = 86400

export default async function SoundSystem() {
  const page = await getSoundSystemPage()

  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />
      <SoundHero
        image={page ? sanityImageUrl(page.heroImage) : ''}
        eyebrow={page?.heroEyebrow}
        headline={page?.heroHeadline || ''}
        quote={page?.heroQuote}
      />
      <SoundHistory
        label={page?.historyLabel}
        body={page?.historyBody}
        title={page?.heroHeadline}
        image={page ? sanityImageUrl(page.historyImage) : ''}
      />
      <SoundSpecs specs={page?.specs} />
      <SoundQuote
        quote={page?.subwayQuote}
        image={page ? sanityImageUrl(page.subwayImage) : ''}
      />
      <section className="py-20 md:py-[160px] flex justify-center">
        <Link href="/events" className="inline-flex h-14 items-center justify-center rounded-lg bg-primary text-btn text-bass-white w-fit transition-colors hover:bg-primary/80 px-8">
          {page?.ctaLabel || 'Experience It Yourself'}
        </Link>
      </section>
      <Footer />
    </div>
  );
}
