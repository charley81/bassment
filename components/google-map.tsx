/* Google Maps — JavaScript API with styled greyscale map + primary-red marker */
"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { setOptions, importLibrary } from "@googlemaps/js-api-loader"
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

/** Greyscale map style — no CSS filter, so the red marker keeps its color */
const GREYSCALE_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ saturation: -100 }] },
  { elementType: "labels.text.fill", stylers: [{ saturation: -100 }] },
  { elementType: "labels.text.stroke", stylers: [{ saturation: -100 }] },
]

/** Primary red (#D31F28) map pin */
const PIN_SVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">' +
    '<path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.06 27.94 0 18 0z" fill="#D31F28"/>' +
    '<circle cx="18" cy="18" r="7" fill="#FFFFFF"/>' +
    "</svg>"
)}`

/** Custom zoom control in brand colors (replaces Google's fixed-style one) */
function addZoomControl(map: google.maps.Map) {
  const el = document.createElement("div")
  el.className =
    "flex flex-col rounded-lg overflow-hidden border border-bass-grey-dark bg-bass-dark shadow-[0_4px_14px_rgba(9,1,2,0.35)]"

  const buttonClass =
    "w-9 h-9 flex items-center justify-center text-primary text-arrow hover:bg-bass-grey-dark hover:border-primary transition-colors cursor-pointer select-none"

  const plus = document.createElement("button")
  plus.className = buttonClass
  plus.textContent = "+"
  plus.setAttribute("aria-label", "Zoom in")
  plus.addEventListener("click", () => map.setZoom((map.getZoom() ?? 16) + 1))

  const divider = document.createElement("div")
  divider.className = "h-px bg-bass-grey-dark"

  const minus = document.createElement("button")
  minus.className = buttonClass
  minus.textContent = "−"
  minus.setAttribute("aria-label", "Zoom out")
  minus.addEventListener("click", () => map.setZoom((map.getZoom() ?? 16) - 1))

  el.append(plus, divider, minus)
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(el)
}

export function GoogleMap({ lat, lng, address }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || !mapRef.current) return

    setOptions({ key: apiKey, v: "weekly" })

    importLibrary("maps")
      .then(async (mapsLibrary) => {
        if (cancelled || !mapRef.current) return
        const { Map } = mapsLibrary as google.maps.MapsLibrary
        const markerLibrary = await importLibrary("marker")
        const { Marker } = markerLibrary as google.maps.MarkerLibrary

        const center = { lat, lng }
        const map = new Map(mapRef.current, {
          center,
          zoom: 16,
          styles: GREYSCALE_STYLES,
          disableDefaultUI: true,
          zoomControl: false,
          scrollwheel: false,
        })

        addZoomControl(map)

        new Marker({
          map,
          position: center,
          title: address,
          icon: {
            url: PIN_SVG,
            scaledSize: new google.maps.Size(36, 44),
            anchor: new google.maps.Point(18, 44),
          },
        })

        map.addListener("idle", () => {
          if (!cancelled) setLoaded(true)
        })

        // Fallback reveal if idle never fires
        timer.current = setTimeout(() => {
          if (!cancelled) setLoaded(true)
        }, 5000)
      })
      .catch(() => {
        // If the API fails to load (e.g. referrer not allowed), show the
        // branded backdrop + pin instead of Google's error overlay
        if (!cancelled) {
          setFailed(true)
          setLoaded(true)
        }
      })

    return () => {
      cancelled = true
      if (timer.current) clearTimeout(timer.current)
    }
  }, [lat, lng, address])

  return (
    <>
      {/* Map canvas — replaced by the branded fallback on API failure */}
      {!failed && <div ref={mapRef} className="absolute inset-0 z-10" />}

      {failed ? (
        /* Branded fallback — dark grid + primary-red pin when the API errors */
        <MapBackdrop>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <MapPin className="h-10 w-10 text-primary" />
            <span className="text-label text-bass-grey-med">
              {address?.toUpperCase() || "70 PINE STREET, NEW YORK, NY 10005"}
            </span>
          </div>
        </MapBackdrop>
      ) : (
        /* Skeleton map — overlays the canvas until the map finishes loading.
            The map-skeleton CSS animation is a no-JS fallback fade-out. */
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
      )}
    </>
  )
}
