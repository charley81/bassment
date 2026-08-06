/* BASSMENT — Venue Map Section */
import { MapPin } from "lucide-react";
import { GoogleMap, MapBackdrop } from "@/components/google-map";

interface Props {
  lat?: number;
  lng?: number;
  address?: string;
}

export function VenueMap({ lat, lng, address }: Props) {
  const hasCoords = typeof lat === 'number' && typeof lng === 'number'

  return (
    <section className="pb-20 md:pb-120 px-6 md:px-20 flex justify-center">
      <div className="relative w-full max-w-1440 h-[350px] md:h-[520px] rounded-lg overflow-hidden border border-bass-border">
        {hasCoords ? (
          <GoogleMap lat={lat} lng={lng} address={address} />
        ) : (
          /* Stylized placeholder when no coordinates are configured */
          <MapBackdrop>
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </MapBackdrop>
        )}
        {/* Hero-style overlay tint (bumped to /20 so it reads over the map) */}
        <div className="pointer-events-none absolute inset-0 bg-primary/20 z-30" />
        {/* Bottom gradient for address legibility */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 z-30 bg-gradient-to-t from-black/70 to-transparent" />
        <span className="absolute bottom-4 left-4 z-40 text-nav text-bass-muted">
          {(address || '70 PINE STREET, NEW YORK, NY 10005').toUpperCase()}
        </span>
      </div>
    </section>
  );
}
