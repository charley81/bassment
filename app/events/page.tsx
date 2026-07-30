/* BASSMENT — Events */
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EventTabs } from "@/components/sections/event-tabs";
import { getUpcomingEvents, getPastEvents } from "@/lib/sanity/fetch";
import type { SanityEvent } from "@/lib/sanity/types";
import type { Event } from "@/lib/types";

export const revalidate = 3600

function mapEvent(e: SanityEvent): Event {
  const img = e.image as unknown as { asset?: { url?: string } } | undefined
  return {
    id: e.slug || e._id,
    title: e.title,
    date: e.date ? new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) : 'TBA',
    support: e.supportText || '',
    image: img?.asset?.url || '/images/placeholder.png',
  }
}

export default async function Events() {
  const [upcomingRaw, pastRaw] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ])
  const upcoming = (upcomingRaw || []).map(mapEvent)
  const past = (pastRaw || []).map(mapEvent)

  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />
      <main className="pt-200 md:pt-280 pb-20 md:pb-120 px-6 md:px-20 flex flex-col items-center gap-12 md:gap-16">
        <div className="w-full max-w-7xl flex flex-col gap-10 md:gap-12">
          <h1 className="text-h1 text-bass-white">EVENTS</h1>
          <EventTabs upcoming={upcoming} past={past} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
