'use client'

import { useState } from 'react'
import { EventCard } from '@/components/shared/event-card'
import { Reveal } from '@/components/animations/reveal'
import type { Event } from '@/lib/types'

interface Props {
  upcoming: Event[]
  past: Event[]
}

export function EventTabs({ upcoming, past }: Props) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const events = tab === 'upcoming' ? upcoming : past

  return (
    <>
      <div className="flex gap-10">
        <button
          onClick={() => setTab('upcoming')}
          className="flex flex-col gap-2 cursor-pointer"
        >
          <span className={`text-btn ${tab === 'upcoming' ? 'text-bass-white' : 'text-bass-grey-med'}`}>
            Upcoming
          </span>
          {tab === 'upcoming' && <div className="h-0.5 bg-bass-white" />}
        </button>
        <button
          onClick={() => setTab('past')}
          className="flex flex-col gap-2 cursor-pointer"
        >
          <span className={`text-btn ${tab === 'past' ? 'text-bass-white' : 'text-bass-grey-med'}`}>
            Past
          </span>
          {tab === 'past' && <div className="h-0.5 bg-bass-white" />}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {events.length > 0 ? (
          events.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.08}>
              <EventCard event={e} />
            </Reveal>
          ))
        ) : (
          <p className="text-body text-bass-grey-med py-12 col-span-full text-center">
            {tab === 'upcoming' ? 'No upcoming events. Check back soon.' : 'No past events.'}
          </p>
        )}
      </div>
    </>
  )
}
