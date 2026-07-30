import Link from 'next/link'

interface Props {
  status?: string
  url?: string | null
  className?: string
}

const STATUS_CONFIG: Record<string, { label: string; disabled: boolean }> = {
  onSale: { label: 'Get Tickets', disabled: false },
  lowTickets: { label: 'Low Tickets — Get Yours', disabled: false },
  soldOut: { label: 'Sold Out', disabled: true },
  atDoor: { label: 'At Door Only', disabled: true },
}

export function TicketCta({ status, url, className = '' }: Props) {
  // Past events: no CTA
  if (status === 'past') return null

  const config = STATUS_CONFIG[status || 'onSale'] || STATUS_CONFIG.onSale
  const baseClass = 'inline-flex h-14 items-center justify-center rounded-none text-btn w-fit transition-colors px-8'

  // Sold out / at door: non-interactive badge
  if (config.disabled) {
    return (
      <span className={`${baseClass} bg-bass-grey-dark border border-bass-grey-light text-bass-grey-light ${className}`}>
        {config.label}
      </span>
    )
  }

  // On sale / low tickets: active CTA
  if (url) {
    return (
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} bg-primary text-bass-white hover:bg-primary/80 ${status === 'lowTickets' ? 'animate-pulse' : ''} ${className}`}
      >
        {config.label}
      </Link>
    )
  }

  // No URL set: show status but non-clickable
  return (
    <span className={`${baseClass} bg-primary/50 text-bass-white cursor-not-allowed ${className}`}>
      Tickets Coming Soon
    </span>
  )
}
