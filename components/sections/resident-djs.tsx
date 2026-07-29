/* BASSMENT — Resident DJ Carousel Section */
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getResidentDjs } from "@/lib/sanity/fetch";
import type { SanityArtist } from "@/lib/sanity/types";

function artistImage(artist: SanityArtist): string {
  const img = artist.image as unknown as { asset?: { url?: string } } | undefined
  return img?.asset?.url || '/images/placeholder.png'
}

function toPlainText(blocks: unknown): string {
  if (typeof blocks === 'string') return blocks
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b: { _type?: string }) => b._type === 'block')
    .flatMap((b: { children?: { text?: string }[] }) =>
      b.children?.map((c) => c.text ?? '').join('') ?? []
    )
    .join(' ')
}

export async function ResidentDjs() {
  const djs = await getResidentDjs()

  return (
    <section className="py-20 md:py-120 px-6 md:px-20 flex flex-col items-center gap-4">
      <p className="text-label-medium text-primary">RESIDENT</p>
      <Carousel className="w-full max-w-[520px]" opts={{ loop: true }}>
        <CarouselContent>
          {(djs || []).map((dj) => (
            <CarouselItem
              key={dj._id}
              className="flex flex-col items-center gap-8"
            >
              <div className="w-[180px] h-[180px] md:w-60 md:h-60 relative rounded-full overflow-hidden">
                <Image
                  src={artistImage(dj)}
                  alt={dj.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-subtitle-center text-bass-white">
                {dj.name}
              </h3>
              <p className="text-body text-center text-bass-grey-light">
                {toPlainText(dj.description)}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {(dj.tags || []).map((t) => (
                  <span
                    key={t}
                    className="inline-flex h-8 px-3 items-center rounded-lg border border-bass-grey-light bg-bass-grey-dark text-nav text-bass-grey-light"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-3 mt-6">
          <CarouselPrevious className="static w-10 h-10 rounded-full border border-bass-border text-arrow text-bass-text hover:border-primary translate-y-0" />
          <CarouselNext className="static w-10 h-10 rounded-full border border-bass-border text-arrow text-bass-text hover:border-primary translate-y-0" />
        </div>
      </Carousel>
    </section>
  );
}
