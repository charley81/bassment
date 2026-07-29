/* BASSMENT — Venue Map Section */
import Image from "next/image";
import { venuePlanData } from "@/lib/data";

export function VenueMap() {
  return (
    <section className="pb-20 md:pb-120 px-6 md:px-20 flex justify-center">
      <div className="relative w-full max-w-1440 h-[250px] md:h-[420px] rounded-lg overflow-hidden border border-bass-border flex items-center justify-center">
        <Image
          src={venuePlanData.mapImage}
          alt="Map"
          fill
          className="object-cover"
        />
        <span className="relative z-10 text-nav text-bass-muted">
          {venuePlanData.mapLabel}
        </span>
      </div>
    </section>
  );
}
