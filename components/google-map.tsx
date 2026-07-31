/* Google Maps — keyless embed, no API key required */
import Image from "next/image"

interface Props {
  lat: number
  lng: number
  className?: string
}

export function GoogleMap({ lat, lng }: Props) {
  return (
    <iframe
      src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Venue Location"
      className="absolute inset-0 z-10"
    />
  )
}
