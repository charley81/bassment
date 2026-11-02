'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

interface Props {
  children: ReactNode
  className?: string
}

export function ScrollReveal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const prefersReduced = usePrefersReducedMotion()
  const shown = visible || prefersReduced

  useEffect(() => {
    if (prefersReduced) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      // Trigger when the section enters the lower 85% of the viewport.
      // A percentage threshold can never be reached by sections taller than
      // the viewport (for example, the stacked upcoming-events grid).
      { threshold: 0, rootMargin: '0px 0px -15% 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [prefersReduced])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      }}
    >
      {children}
    </div>
  )
}
