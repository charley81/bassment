/* BASSMENT — Venue Info Card (shared between pages) */
import Link from "next/link";
import { MapPin } from "lucide-react";
import { eventDetailData } from "@/lib/data";
import { GoogleMap, MapBackdrop } from "@/components/google-map";

interface Props {
  lat?: number;
  lng?: number;
  address?: string;
}

export function VenueInfoCard({ lat, lng, address }: Props) {
  const hasCoords = typeof lat === 'number' && typeof lng === 'number'

  return (
    <>
      <div className="max-w-800 mx-auto w-full p-8 md:p-12 flex flex-col gap-6 md:gap-8 bg-bass-grey-dark border border-bass-border rounded-lg mt-16 md:mt-20">
        <div className="flex flex-col gap-3">
          <p className="text-overline text-bass-grey-light">
            {eventDetailData.venueInfo.label}
          </p>
          <p className="text-body-bold text-bass-white">
            {eventDetailData.venueInfo.name}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {eventDetailData.venueInfo.details.map((d, i) => (
            <p key={i} className="text-nav text-bass-grey-light">
              {d}
            </p>
          ))}
        </div>
        <Link
          href="/faq"
          className="text-link text-bass-white hover:text-primary transition-colors"
        >
          {eventDetailData.venueInfo.faqLink}
        </Link>
      </div>

      <div className="relative w-full md:w-800 h-200 md:h-300 mx-auto mt-16 md:mt-20 rounded-lg overflow-hidden border border-bass-border">
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
      </div>
    </>
  );
}
