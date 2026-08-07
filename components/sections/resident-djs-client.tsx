'use client'

import { toPlainText } from "@/lib/portable-text";
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
        className="flex flex-col items-center gap-8 w-full max-w-[520px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Image slider */}
        <div className="relative w-[260px] h-[260px] md:w-[360px] md:h-[360px] rounded-lg overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={dj._id}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 48, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -48, scale: 0.96 }}
              transition={t}
            >
              <Image
                src={artistImage(dj)}
                alt={dj.name}
                fill
                sizes="(max-width: 768px) 260px, 360px"
                className="object-cover grayscale transition duration-500 hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-primary/10 z-1" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Name, description, tags — transitions in sync with the image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${dj._id}-text`}
            className="flex flex-col items-center gap-4 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={t}
          >
            <h3 className="text-subtitle-center text-bass-white">{dj.name}</h3>
            <p className="text-body text-bass-grey-light min-h-[103px] md:min-h-[77px]">
              {toPlainText(dj.description)}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {(dj.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex h-8 px-3 items-center rounded-lg border border-bass-grey-light bg-bass-grey-dark text-nav text-bass-grey-light"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

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
