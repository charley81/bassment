/* BASSMENT — Venue Photo Grid Section */
import { sanityImageUrl, type SanityImageProjection } from "@/lib/sanity/image";
import { Reveal } from "@/components/animations/reveal";
import Image from "next/image";

interface Props {
  images?: SanityImageProjection[] | null;
}

export function VenuePhotoGrid({ images }: Props) {
  const items = images || []
  if (items.length === 0) return null

  const rows: string[][] = []
  for (let i = 0; i < items.length; i += 3) {
    rows.push(items.slice(i, i + 3).map((img) => sanityImageUrl(img)))
  }

  return (
    <section className="py-20 md:py-120 px-4 lg:px-20 flex flex-col items-center gap-8">
      <h2 className="text-label-center text-bass-white">THE SPACE TODAY</h2>
      <div className="flex flex-col gap-4 max-w-7xl w-full">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="flex flex-col md:flex-row gap-4 h-auto md:h-[420px]"
          >
            {row.map((src, i) => (
              <Reveal key={i} delay={i * 0.08} className="w-full md:flex-1">
                <div className="relative w-full h-[250px] md:h-full rounded-lg overflow-hidden group">
                  <Image
                    src={src}
                    alt={`Venue photo ${ri * 3 + i + 1}`}
                    fill
                    className="object-cover grayscale transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-primary/10 z-1" />
                </div>
              </Reveal>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
