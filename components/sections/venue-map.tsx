/* BASSMENT — Venue Map Section */
import Image from "next/image";
import { GoogleMap } from "@/components/google-map";

interface Props {
  fallbackImage?: string;
  lat?: number;
  lng?: number;
}

export function VenueMap({ fallbackImage, lat, lng }: Props) {
  const hasCoords = typeof lat === 'number' && typeof lng === 'number'

  return (
    <section className="pb-20 md:pb-120 px-6 md:px-20 flex justify-center">
      <div className="relative w-full max-w-1440 h-[250px] md:h-[420px] rounded-lg overflow-hidden border border-bass-border">
        {/* Static fallback image (always rendered, works without JS) */}
        <Image
          src={fallbackImage || '/images/venue-map.png'}
          alt="Venue location map"
          fill
          className="object-cover"
        />
        {/* Google Map overlay (client-only, layers on top) */}
        {hasCoords && (
          <GoogleMap
            lat={lat}
            lng={lng}
            className="absolute inset-0 z-10"
          />
        )}
        {/* Hero-style overlay tint */}
        <div className="pointer-events-none absolute inset-0 bg-primary/10 z-20" />
        <span className="absolute bottom-4 left-4 z-30 text-nav text-bass-muted">
          70 PINE STREET, NEW YORK, NY 10005
        </span>
      </div>
    </section>
  );
}
