'use client'

import { toPlainText } from "@/lib/portable-text";
import Image from 'next/image'
import { Reveal } from '@/components/animations/reveal'
import type { SanityArtist } from '@/lib/sanity/types'

function artistImage(artist: SanityArtist): string {
  const img = artist.image as unknown as { asset?: { url?: string } } | undefined
  return img?.asset?.url || '/images/placeholder.png'
}

interface Props {
  djs: SanityArtist[]
}

export function ResidentDjsClient({ djs }: Props) {
  if (!djs.length) return null

  return (
    <section className="py-20 md:py-120 px-4 lg:px-20 flex flex-col items-center gap-4">
      <p className="text-label-medium text-primary">RESIDENT</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
        {djs.map((dj, i) => (
          <Reveal key={dj._id} delay={i * 0.08}>
            <div className="group flex flex-col items-center gap-4">
              <div className="w-[180px] h-[180px] md:w-60 md:h-60 relative rounded-full overflow-hidden">
                <Image
                  src={artistImage(dj)}
                  alt={dj.name}
                  fill
                  sizes="(max-width: 768px) 180px, 240px"
                  className="object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-105"
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
          </Reveal>
        ))}
      </div>
    </section>
  )
}
