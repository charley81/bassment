/* BASSMENT — Event Detail (v1-latest) */
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EventDetailHero } from "@/components/sections/event-detail-hero";
import { EventLineup } from "@/components/sections/event-lineup";
import { EventDescription } from "@/components/sections/event-description";
import { VenueInfoCard } from "@/components/sections/venue-info-card";
import { RelatedEvents } from "@/components/sections/related-events";
import { eventsPageData } from "@/lib/data";

export default async function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = eventsPageData.find((e) => e.id === slug) ?? null;

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />
      <main className="pt-[200px] md:pt-[280px] pb-20 md:pb-[120px] px-6 md:px-20 flex flex-col items-center">
        <div className="w-full max-w-[1280px] flex flex-col gap-10 md:gap-12">
          <EventDetailHero event={event} />
          <EventLineup />
          <EventDescription />
          <VenueInfoCard />
          <RelatedEvents />
        </div>
      </main>
      <Footer />
    </div>
  );
}
