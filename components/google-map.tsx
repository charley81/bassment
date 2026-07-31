'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  lat: number
  lng: number
  className?: string
}

let scriptLoaded = false
let scriptLoading = false

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (scriptLoaded) return Promise.resolve()
  if (scriptLoading) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (scriptLoaded) { clearInterval(check); resolve() }
      }, 100)
    })
  }

  scriptLoading = true
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.onload = () => { scriptLoaded = true; resolve() }
    script.onerror = () => { scriptLoading = false; reject(new Error('Failed to load Google Maps')) }
    document.head.appendChild(script)
  })
}

export function GoogleMap({ lat, lng, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    if (!apiKey) {
      console.warn('Google Maps: No API key found. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env')
      setError(true)
      return
    }
    if (!ref.current) return

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (!ref.current) return
        const map = new google.maps.Map(ref.current, {
          center: { lat, lng },
          zoom: 15,
          disableDefaultUI: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#666666' }] },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#2a2a2a' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#111111' }],
            },
          ],
        })
        new google.maps.Marker({
          position: { lat, lng },
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#D31F28',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        })
      })
      .catch((err) => {
        console.error('Google Maps: Failed to load script', err)
        setError(true)
      })

    return () => {
      // Cleanup not needed — map binds to the DOM element
    }
  }, [lat, lng, apiKey])

  if (error || !apiKey) return null

  return <div ref={ref} className={className} />
}
