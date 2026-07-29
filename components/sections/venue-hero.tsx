/* BASSMENT — Venue Hero Section */
import Image from "next/image";
import { venueHeroData } from "@/lib/data";

export function VenueHero() {
  return (
    <section className="relative h-[600px] md:h-[900px] w-full overflow-hidden">
      <Image
        src={venueHeroData.image}
        alt=""
        fill
        className="object-cover img-greyscale"
      />
      <div className="absolute inset-0 bg-(--color-primary)/10 z-[1]" />
      <div className="absolute left-6 md:left-20 bottom-20 md:bottom-[213px] flex flex-col gap-4 max-w-[800px] z-[2]">
        <h1 className="text-h6 text-bass-white">{venueHeroData.headline}</h1>
        <p className="text-body-large text-bass-white">
          {venueHeroData.subtitle}
        </p>
      </div>
    </section>
  );
}
