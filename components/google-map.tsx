'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  lat: number
  lng: number
  className?: string
}

export function GoogleMap({ lat, lng, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Use iframe embed if API key is missing or fails — always works
  if (!apiKey) {
    return (
      <iframe
        className={className}
        src={`https://www.google.com/maps/embed/v1/place?key=&q=${lat},${lng}&zoom=15`}
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

  return (
    <>
      {!loaded && (
        <iframe
          className={className}
          src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Venue Location"
        />
      )}
      <div ref={ref} className={`${className} ${loaded ? '' : 'hidden'}`} />
    </>
  )
}
