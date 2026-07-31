/* Google Maps — keyless embed, no API key required */
"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { MapPin } from "lucide-react"

/* Shared stylized map backdrop (dark grid) used by skeleton + placeholder */
export function MapBackdrop({ children }: { children?: ReactNode }) {
  return (
    <div className="absolute inset-0 bg-bass-dark">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(0 0% 100% / 0.05) 1px, transparent 1px), linear-gradient(to bottom, hsl(0 0% 100% / 0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {children}
    </div>
  )
}

interface Props {
  lat: number
  lng: number
  /** Preferred over lat/lng — Google geocodes it and drops an exact pin */
  address?: string
}

export function GoogleMap({ lat, lng, address }: Props) {
  const [loaded, setLoaded] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // The eager iframe can finish loading before hydration attaches onLoad
    // (common on heavy pages). Reveal the map after a grace period regardless.
    timer.current = setTimeout(() => setLoaded(true), 3000)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const handleLoad = () => {
    if (timer.current) clearTimeout(timer.current)
    setLoaded(true)
  }

  return (
    <>
      <iframe
        src={`https://maps.google.com/maps?q=${encodeURIComponent(address?.trim() || `${lat},${lng}`)}&z=16&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title="Venue Location"
        onLoad={handleLoad}
        className="absolute inset-0 z-10 grayscale"
      />
      {/* Skeleton map — overlays the iframe until it finishes loading.
          The map-skeleton CSS animation is a no-JS fallback fade-out. */}
      <div
        aria-hidden
        className={`map-skeleton pointer-events-none absolute inset-0 z-20 transition-opacity duration-700 ${loaded ? "opacity-0" : "opacity-100"}`}
      >
        <MapBackdrop>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/30" />
              <MapPin className="relative h-6 w-6 text-primary" />
            </span>
            <span className="animate-pulse text-label text-bass-grey-med">
              LOADING MAP
            </span>
          </div>
        </MapBackdrop>
      </div>
    </>
  )
}
