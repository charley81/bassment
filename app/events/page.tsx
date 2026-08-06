/* BASSMENT — Events */
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EventTabs } from "@/components/sections/event-tabs";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { getUpcomingEvents, getPastEvents } from "@/lib/sanity/fetch";
import { mapEvent } from "@/lib/mappers";

export const revalidate = 3600


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
      <main className="pt-200 md:pt-280 pb-20 md:pb-120 px-4 lg:px-20 flex flex-col items-center gap-12 md:gap-16">
        <div className="w-full max-w-7xl flex flex-col gap-10 md:gap-12">
          <h1 className="text-h1 text-bass-white">EVENTS</h1>
          <ScrollReveal><EventTabs upcoming={upcoming} past={past} /></ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
