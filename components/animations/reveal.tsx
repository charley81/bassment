'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

interface Props {
  children: ReactNode
  className?: string
  /** stagger delay in seconds */
  delay?: number
  /** how far it slides up from (px) */
  y?: number
  /** 'load' animates on mount (hero entrances), 'view' animates on scroll into view */
  mode?: 'load' | 'view'
}

/**
 * GPU-only entrance animation (opacity + translateY).
 * - mode="load": plays on mount (hero entrances)
 * - mode="view": plays once when scrolled into view
 * Respects prefers-reduced-motion (renders instantly, no animation).
 */
export function Reveal({ children, className, delay = 0, y = 24, mode = 'view' }: Props) {
  const prefersReduced = usePrefersReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  const hidden = { opacity: 0, y }
  const shown = { opacity: 1, y: 0 }
  const transition = { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as const }

  if (mode === 'load') {
    return (
      <motion.div className={className} initial={hidden} animate={shown} transition={transition}>
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: '-40px' }}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}
