'use client'

import { ticketEventIcs } from '@/lib/calendar'

interface Props {
  title: string
  date?: string
  doorsOpen?: string
  orderRef: string
  slug: string
}

/** Downloads an .ics for the purchased event (Apple/Google/Outlook). */
export function AddToCalendar({ title, date, doorsOpen, orderRef, slug }: Props) {
  function download() {
    const ics = ticketEventIcs({ title, date, doorsOpen, orderRef })
    if (!ics) return
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      type="button"
      onClick={download}
      className="inline-flex h-14 items-center justify-center rounded-lg px-8 bg-bass-grey-dark border border-bass-grey-med text-btn text-bass-white hover:border-primary transition-colors"
    >
      Add to Calendar
    </button>
  )
}
