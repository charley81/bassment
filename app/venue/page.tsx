/* BASSMENT — Venue */
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VenueHero } from "@/components/sections/venue-hero";
import { VenueHistory } from "@/components/sections/venue-history";
import { VenuePhotoGrid } from "@/components/sections/venue-photo-grid";
import { VenueStats } from "@/components/sections/venue-stats";
import { VenuePlan } from "@/components/sections/venue-plan";
import { VenueMap } from "@/components/sections/venue-map";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { getVenuePage, getSiteSettings } from "@/lib/sanity/fetch";
import { sanityImageUrl } from "@/lib/sanity/image";

export const revalidate = 86400 // 1 day

export default async function Venue() {
  const [venue, settings] = await Promise.all([
    getVenuePage(),
    getSiteSettings(),
  ])

  return (
    <div className="flex flex-col min-h-full bg-bass-bg">
      <Header />
      <VenueHero
        headline={venue?.heroHeadline || ''}
        subtitle={venue?.heroSubtitle}
        image={venue ? sanityImageUrl(venue.heroImage) : ''}
      />
      <VenueHistory
        label={venue?.historyLabel}
        body={venue?.historyBody}
      />
      <ScrollReveal><VenuePhotoGrid images={venue?.photoGrid} /></ScrollReveal>
      <VenueStats stats={venue?.stats} />
      <VenuePlan />
      <VenueMap
        lat={settings?.venueLat}
        lng={settings?.venueLng}
        address={settings?.venueAddress}
      />
      <section className="h-[150px] md:h-[216px] flex items-center justify-center">
        <Link href="/events" className="inline-flex h-14 items-center justify-center rounded-lg bg-primary text-btn text-bass-white w-fit transition-colors hover:bg-primary/80 px-10">
          {venue?.ctaLabel || "See What's On →"}
        </Link>
      </section>
      <Footer />
    </div>
  );
}
