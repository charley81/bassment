'use client'

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

interface Props {
  /** the repeated ticker items */
  items: string[]
  /** class for the strip */
  className?: string
}

/**
 * Pure-CSS marquee ticker — a continuous horizontal scroll driven by a
 * keyframe transform (zero JS per frame). Paused under prefers-reduced-motion.
 */
export function Marquee({ items, className = '' }: Props) {
  const prefersReduced = usePrefersReducedMotion()
  const line = items.join('  ·  ')

  return (
    <div className={`overflow-hidden whitespace-nowrap border-y border-bass-grey-dark py-4 ${className}`}>
      <div className={`marquee-track flex w-max ${prefersReduced ? '' : 'animate-marquee'}`}>
        <span className="text-label-medium text-bass-grey-med tracking-widest">{line}  ·  </span>
        <span className="text-label-medium text-bass-grey-med tracking-widest" aria-hidden="true">{line}  ·  </span>
      </div>
    </div>
  )
}
