'use client'

import { useState, useEffect } from 'react'

interface Props {
  targetDate: string // ISO datetime
}

function calcRemaining(target: Date): { days: number; hours: number; minutes: number; seconds: number } | null {
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return null

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function Countdown({ targetDate }: Props) {
  const target = new Date(targetDate)
  const [remaining, setRemaining] = useState(() => calcRemaining(target))

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(calcRemaining(target))
    }, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (!remaining) {
    return <p className="text-btn text-bass-grey-med">This event has ended.</p>
  }

  const items = [
    { value: remaining.days, label: 'DAYS' },
    { value: remaining.hours, label: 'HRS' },
    { value: remaining.minutes, label: 'MIN' },
    { value: remaining.seconds, label: 'SEC' },
  ]

  return (
    <div className="flex gap-6">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-2">
          <span className="text-h6 text-bass-grey-light">
            {String(item.value).padStart(2, '0')}
          </span>
          <span className="text-label-medium text-bass-grey-med">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}
