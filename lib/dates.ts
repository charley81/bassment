/* Shared date/time formatting. Timezone is pinned — the venue is in NYC,
   and server rendering would otherwise use the host's timezone (UTC). */

const TIME_ZONE = 'America/New_York'

/** "Fri, Oct 24" */
export function formatEventDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: TIME_ZONE,
  })
}

/** "Friday, October 24, 2025" */
export function formatEventDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TIME_ZONE,
  })
}

/** "FRI, OCT 24" */
export function formatEventDateUpper(iso: string): string {
  return formatEventDateShort(iso).toUpperCase()
}

/** "10:00 PM" */
export function formatEventTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TIME_ZONE,
  })
}
