/* BASSMENT — Venue (v1-latest) */
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VenueHero } from "@/components/sections/venue-hero";
import { VenueHistory } from "@/components/sections/venue-history";
import { VenuePhotoGrid } from "@/components/sections/venue-photo-grid";
import { VenueStats } from "@/components/sections/venue-stats";
import { VenuePlan } from "@/components/sections/venue-plan";
import { VenueMap } from "@/components/sections/venue-map";
import { venuePlanData } from "@/lib/data";

export default function Venue() {
  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />
      <VenueHero />
      <VenueHistory />
      <VenuePhotoGrid />
      <VenueStats />
      <VenuePlan />
      <VenueMap />
      <section className="h-150 md:h-216 flex items-center justify-center">
        <Link href="/events" className="btn-cta px-10">
          {venuePlanData.cta}
        </Link>
      </section>
      <Footer />
    </div>
  );
}
