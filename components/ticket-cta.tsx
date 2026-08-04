import Link from 'next/link'

interface Props {
  status?: string
  slug?: string
  ticketPrice?: number
  className?: string
}

const STATUS_LABELS: Record<string, string> = {
  onSale: 'Get Tickets',
  lowTickets: 'Low Tickets — Get Yours',
  soldOut: 'Sold Out',
  atDoor: 'At Door Only',
}

export function TicketCta({ status, slug, ticketPrice, className = '' }: Props) {
  if (status === 'past') return null

  const baseClass = 'inline-flex h-14 items-center justify-center rounded-lg text-btn w-fit transition-colors px-8'
  const label = STATUS_LABELS[status || 'onSale'] || 'Get Tickets'
  const price = typeof ticketPrice === 'number' && ticketPrice > 0
    ? ` — $${(ticketPrice / 100).toFixed(2)}`
    : ''

  if (status === 'soldOut' || status === 'atDoor') {
    return (
      <span className={`${baseClass} bg-bass-grey-dark border border-bass-grey-light text-bass-grey-light ${className}`}>
        {label}
      </span>
    )
  }

  // Stripe buy flow when price is set
  if (slug && typeof ticketPrice === 'number' && ticketPrice > 0) {
    return (
      <Link
        href={`/events/${slug}/buy`}
        className={`${baseClass} bg-primary text-bass-white hover:bg-primary/80 ${status === 'lowTickets' ? 'animate-pulse' : ''} ${className}`}
      >
        {label}{price}
      </Link>
    )
  }

  // No price set — placeholder
  return (
    <span className={`${baseClass} bg-primary/50 text-bass-white cursor-not-allowed ${className}`}>
      Tickets Coming Soon
    </span>
  )
}
