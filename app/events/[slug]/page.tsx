/* BASSMENT — Event Detail (v1-latest) */
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EventCard } from "@/components/shared/event-card";
import { eventDetailData, eventsPageData } from "@/lib/data";

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
          <Link href="/events" className="text-nav text-bass-grey-light hover:text-bass-white transition-colors">{eventDetailData.backLabel}</Link>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-[739px] h-[500px] md:h-[990px] relative shrink-0">
              <Image src={event.image} alt={event.title} fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-6 md:gap-8 flex-1">
              <div className="flex flex-col gap-6 md:gap-8">
                <h1 className="text-h5 text-bass-white">{event.title.toUpperCase()}</h1>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    {eventDetailData.setTimes.map((s) => (
                      <div key={s.label} className="flex flex-col gap-1">
                        <span className="text-btn text-bass-grey-light">{s.label}</span>
                        <span className="text-nav text-bass-grey-med">{s.time}</span>
                      </div>
                    ))}
                  </div>
                  <hr className="border-bass-border" />
                </div>
                <p className="text-btn text-bass-grey-med">{eventDetailData.dateLine}</p>
                <div className="flex gap-6">
                  {eventDetailData.countdown.map((c) => (
                    <div key={c.label} className="flex flex-col gap-2">
                      <span className="text-h6 text-bass-grey-light">{c.num}</span>
                      <span className="text-label-medium text-bass-grey-med">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Link href="#" className="flex items-center justify-center h-[60px] px-8 rounded-lg bg-[var(--color-primary)] text-btn text-bass-white hover:bg-[var(--color-primary)]/80 transition-colors">{eventDetailData.cta}</Link>
                <span className="inline-flex self-start px-3 py-1.5 rounded-full bg-bass-dark border border-bass-grey-med text-label text-bass-grey-med">{eventDetailData.badge}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10 md:gap-12 pt-16 md:pt-20">
            <h2 className="text-label-center text-bass-white">LINEUP</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {eventDetailData.lineup.map((a) => (
                <div key={a.name} className="flex flex-col items-center gap-1">
                  <span className="text-artist-name text-bass-grey-light">{a.name}</span>
                  <span className="text-nav text-bass-grey-med">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-16 md:pt-20 max-w-[800px] mx-auto">
            {eventDetailData.description.map((p, i) => (
              <p key={i} className="text-body text-bass-grey-med">{p}</p>
            ))}
          </div>

          <div className="max-w-[800px] mx-auto w-full p-8 md:p-12 flex flex-col gap-6 md:gap-8 bg-bass-grey-dark border border-bass-border rounded-lg mt-16 md:mt-20">
            <div className="flex flex-col gap-3">
              <p className="text-overline text-bass-grey-light">{eventDetailData.venueInfo.label}</p>
              <p className="text-body-bold text-bass-white">{eventDetailData.venueInfo.name}</p>
            </div>
            <div className="flex flex-col gap-2">
              {eventDetailData.venueInfo.details.map((d, i) => (
                <p key={i} className="text-nav text-bass-grey-light">{d}</p>
              ))}
            </div>
            <Link href="/faq" className="text-link text-bass-white hover:text-[var(--color-primary)] transition-colors">{eventDetailData.venueInfo.faqLink}</Link>
          </div>

          <div className="relative w-full md:w-[800px] h-[200px] md:h-[300px] mx-auto mt-16 md:mt-20 rounded-lg overflow-hidden border border-bass-border">
            <Image src={eventDetailData.mapImage} alt="Map" fill className="object-cover" />
          </div>

          <div className="flex flex-col gap-6 md:gap-8 pt-16 md:pt-20">
            <h3 className="text-more-events text-bass-text">MORE EVENTS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {eventDetailData.relatedEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
