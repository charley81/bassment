'use client'

interface Props {
  lat: number
  lng: number
  className?: string
}

export function GoogleMap({ lat, lng, className }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const keyParam = apiKey ? `&key=${apiKey}` : ''

  return (
    <iframe
      className={className}
      src={`https://www.google.com/maps/embed/v1/place?q=${lat},${lng}&zoom=15${keyParam}`}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Venue Location"
    />
  )
}
