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
import { getVenuePage } from "@/lib/sanity/fetch";

export const revalidate = 86400 // 1 day

function imageUrl(img: unknown): string {
  const i = img as { asset?: { url?: string } } | undefined
  return i?.asset?.url || '/images/placeholder.png'
}

export default async function Venue() {
  const venue = await getVenuePage()

  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />
      <VenueHero
        headline={venue?.heroHeadline || ''}
        subtitle={venue?.heroSubtitle}
        image={venue ? imageUrl(venue.heroImage) : ''}
      />
      <VenueHistory
        label={venue?.historyLabel}
        body={venue?.historyBody}
      />
      <VenuePhotoGrid images={venue?.photoGrid} />
      <VenueStats stats={venue?.stats} />
      <VenuePlan />
      <VenueMap
        fallbackImage={venue ? imageUrl(venue.mapFallbackImage) : undefined}
      />
      <section className="h-[150px] md:h-[216px] flex items-center justify-center">
        <Link href="/events" className="inline-flex h-14 items-center justify-center rounded-none bg-primary text-btn text-bass-white w-fit transition-colors hover:bg-primary/80 px-10">
          {venue?.ctaLabel || "See What's On →"}
        </Link>
      </section>
      <Footer />
    </div>
  );
}
