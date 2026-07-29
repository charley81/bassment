/* BASSMENT — Sound System */
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SoundHero } from "@/components/sections/sound-hero";
import { SoundHistory } from "@/components/sections/sound-history";
import { SoundSpecs } from "@/components/sections/sound-specs";
import { SoundQuote } from "@/components/sections/sound-quote";
import { getSoundSystemPage } from "@/lib/sanity/fetch";

export const revalidate = 86400

function imageUrl(img: unknown): string {
  const i = img as { asset?: { url?: string } } | undefined
  return i?.asset?.url || '/images/placeholder.png'
}

function blocksToText(blocks: unknown): string[] {
  if (!Array.isArray(blocks)) return []
  return blocks
    .filter((b: { _type?: string }) => b._type === 'block')
    .flatMap((b: { children?: { text?: string }[] }) =>
      b.children?.map((c) => c.text ?? '').join('') ?? []
    )
}

export default async function SoundSystem() {
  const page = await getSoundSystemPage()

  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />
      <SoundHero
        image={page ? imageUrl(page.heroImage) : ''}
        eyebrow={page?.heroEyebrow}
        headline={page?.heroHeadline || ''}
        quote={page?.heroQuote}
      />
      <SoundHistory
        label={page?.historyLabel}
        body={page?.historyBody}
        title={page?.heroHeadline}
        image={page ? imageUrl(page.historyImage) : ''}
      />
      <SoundSpecs specs={page?.specs} />
      <SoundQuote
        quote={page?.subwayQuote}
        image={page ? imageUrl(page.subwayImage) : ''}
      />
      <section className="py-20 md:py-[160px] flex justify-center">
        <Link href="/events" className="inline-flex h-14 items-center justify-center rounded-none bg-primary text-btn text-bass-white w-fit transition-colors hover:bg-primary/80 px-8">
          {page?.ctaLabel || 'Experience It Yourself'}
        </Link>
      </section>
      <Footer />
    </div>
  );
}
