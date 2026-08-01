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
      { threshold: 0.15 }
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
