/* BASSMENT — Venue Teaser Section (Home Page) */
import Image from "next/image";
import Link from "next/link";
import { venueHomeData } from "@/lib/data";

export function VenueTeaser() {
  return (
    <section className="py-20 md:py-[140px] px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="w-full md:w-[616px] h-[400px] md:h-[721px] relative shrink-0 rounded-lg overflow-hidden">
          <Image
            src={venueHomeData.image}
            alt="Venue"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-1 md:gap-2">
            <p className="text-eyebrow text-primary">
              {venueHomeData.eyebrow}
            </p>
            <h3 className="text-subtitle text-bass-white">
              {venueHomeData.title}
            </h3>
          </div>
          <p className="text-body text-bass-grey-light">
            {venueHomeData.description}
          </p>
          <Link
            href="/venue"
            className="inline-flex h-12 px-5 items-center justify-center rounded-lg bg-primary text-btn-ghost text-bass-text hover:bg-primary/80 transition-colors w-fit"
          >
            {venueHomeData.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
