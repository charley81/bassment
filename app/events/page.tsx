/* BASSMENT — Events (v1-latest) */
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EventCard } from "@/components/shared/event-card";
import { eventsPageData } from "@/lib/data";

export default function Events() {
  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />
      <main className="pt-200 md:pt-280 pb-20 md:pb-120 px-6 md:px-20 flex flex-col items-center gap-12 md:gap-16">
        <div className="w-full max-w-7xl flex flex-col gap-10 md:gap-12">
          <h1 className="text-h1 text-bass-white">EVENTS</h1>
          <div className="flex gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-btn text-bass-white">Upcoming</span>
              <div className="h-0.5 bg-bass-white" />
            </div>
            <span className="text-btn-ghost text-bass-grey-med">Past</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {eventsPageData.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
