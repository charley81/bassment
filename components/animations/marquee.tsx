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
 * keyframe transform (zero JS per frame). The line is repeated enough
 * times that the track always covers the viewport, so there's never an
 * empty gap while scrolling. Paused under prefers-reduced-motion.
 */
export function Marquee({ items, className = '' }: Props) {
  const prefersReduced = usePrefersReducedMotion()
  const line = items.join('  ·  ')
  // Enough copies to cover even ultra-wide viewports with short lines.
  const copies = 16
  // One line (~1 copy) every 30s — the calm pace of the original ticker,
  // scaled so the longer repeated track moves at the same speed.
  const duration = `${copies * 15}s`

  return (
    <div className={`overflow-hidden whitespace-nowrap border-y border-bass-grey-dark py-4 ${className}`}>
      <div
        className={`marquee-track flex w-max ${prefersReduced ? '' : 'animate-marquee'}`}
        style={prefersReduced ? undefined : { animationDuration: duration }}
      >
        <span className="text-label-medium text-bass-grey-med tracking-widest">{line}  ·  </span>
        {Array.from({ length: copies - 1 }, (_, i) => (
          <span key={i} className="text-label-medium text-bass-grey-med tracking-widest" aria-hidden="true">
            {line}  ·  
          </span>
        ))}
      </div>
    </div>
  )
}
