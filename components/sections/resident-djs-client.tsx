'use client'

import { toPlainText } from "@/lib/portable-text";
import { useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import type { SanityArtist } from '@/lib/sanity/types'

function artistImage(artist: SanityArtist): string {
  const img = artist.image as unknown as { asset?: { url?: string } } | undefined
  return img?.asset?.url || '/images/placeholder.png'
}

interface Props {
  djs: SanityArtist[]
}

export function ResidentDjsClient({ djs }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const autoPlay = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const interval = setInterval(autoPlay, 5000)
    return () => clearInterval(interval)
  }, [emblaApi, autoPlay])

  if (!djs.length) return null

  return (
    <section className="py-20 md:py-120 px-6 md:px-20 flex flex-col items-center gap-4">
      <p className="text-label-medium text-primary">RESIDENT</p>
      <div className="w-full max-w-[520px] overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {djs.map((dj) => (
            <div
              key={dj._id}
              className="flex-[0_0_100%] min-w-0 flex flex-col items-center gap-8"
              style={{ transition: 'opacity 0.6s ease-out, transform 0.6s ease-out' }}
            >
              <div className="w-[180px] h-[180px] md:w-60 md:h-60 relative rounded-full overflow-hidden">
                <Image
                  src={artistImage(dj)}
                  alt={dj.name}
                  fill
                  sizes="(max-width: 768px) 180px, 240px"
                  className="object-cover grayscale"
                />
                <div className="absolute inset-0 bg-primary/10 z-1" />
              </div>
              <h3 className="text-subtitle-center text-bass-white">{dj.name}</h3>
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
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="static w-10 h-10 rounded-full border border-bass-border text-arrow text-bass-text hover:border-primary translate-y-0 transition-colors"
          aria-label="Previous DJ"
        >
          ←
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="static w-10 h-10 rounded-full border border-bass-border text-arrow text-bass-text hover:border-primary translate-y-0 transition-colors"
          aria-label="Next DJ"
        >
          →
        </button>
      </div>
    </section>
  )
}
