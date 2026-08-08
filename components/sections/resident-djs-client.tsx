'use client'

import { toPlainText } from "@/lib/portable-text";
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import type { SanityArtist } from '@/lib/sanity/types'

function artistImage(artist: SanityArtist): string {
  const img = artist.image as unknown as { asset?: { url?: string } } | undefined
  return img?.asset?.url || '/images/placeholder.png'
}

interface Props {
  djs: SanityArtist[]
}

const transition = { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const }

export function ResidentDjsClient({ djs }: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const prefersReduced = usePrefersReducedMotion()

  // Gentle autoplay — pauses on hover, disabled under reduced motion
  useEffect(() => {
    if (paused || prefersReduced || djs.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % djs.length), 6000)
    return () => clearInterval(id)
  }, [paused, prefersReduced, djs.length])

  if (!djs.length) return null

  const dj = djs[index]
  const t = prefersReduced ? { duration: 0 } : transition

  return (
    <section className="py-20 md:py-120 px-4 lg:px-20 flex flex-col items-center gap-4">
      <p className="text-label-medium text-primary">RESIDENT</p>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Resident DJs"
        className="flex flex-col items-center gap-8 w-full max-w-[520px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % djs.length)
          if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + djs.length) % djs.length)
        }}
        tabIndex={0}
      >
        {/* Image slider — all images stay mounted in a stack (preloaded),
            changes are slide + fade crossfades — no loading gap, no flash */}
        <div className="relative w-[260px] h-[260px] md:w-[360px] md:h-[360px] rounded-lg overflow-hidden bg-bass-dark">
          {djs.map((d, i) => (
            <motion.div
              key={d._id}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: i === index ? 1 : 0,
                x: i === index ? 0 : i > index ? 48 : -48,
              }}
              transition={t}
              aria-hidden={i !== index}
            >
              <Image
                src={artistImage(d)}
                alt={d.name}
                fill
                loading="eager"
                sizes="(max-width: 768px) 260px, 360px"
                className="object-cover grayscale transition duration-500 hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-primary/10 z-1" />
            </motion.div>
          ))}
        </div>

        {/* Screen-reader announcement of the active DJ */}
        <p className="sr-only" aria-live="polite">
          {djs[index].name}
        </p>

        {/* Name, description, tags — all mounted in a fixed-height stack so
            the section never collapses mid-transition (no black band) */}
        <div className="relative w-full min-h-[210px] md:min-h-[185px]">
          {djs.map((d, i) => (
            <motion.div
              key={d._id}
              className="absolute inset-0 flex flex-col items-center gap-4 text-center"
              initial={false}
              animate={{
                opacity: i === index ? 1 : 0,
                y: i === index ? 0 : i > index ? 16 : -16,
              }}
              transition={t}
              aria-hidden={i !== index}
            >
              <h3 className="text-subtitle-center text-bass-white">{d.name}</h3>
              <p className="text-body text-bass-grey-light min-h-[103px] md:min-h-[77px]">
                {toPlainText(d.description)}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {(d.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex h-8 px-3 items-center rounded-lg border border-bass-grey-light bg-bass-grey-dark text-nav text-bass-grey-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Name navigation — numbered, active name highlighted */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 mt-2">
          {djs.map((d, i) => (
            <button
              key={d._id}
              onClick={() => setIndex(i)}
              aria-label={`Show ${d.name}`}
              aria-current={i === index}
              className="flex flex-col items-center gap-1 cursor-pointer group/name"
            >
              <span
                className={`text-label tracking-widest transition-colors ${
                  i === index
                    ? 'text-primary'
                    : 'text-bass-grey-dark group-hover/name:text-bass-grey-med'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`text-nav transition-colors ${
                  i === index
                    ? 'text-bass-white'
                    : 'text-bass-grey-med group-hover/name:text-bass-grey-light'
                }`}
              >
                {d.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
