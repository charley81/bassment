/* BASSMENT — Events (v1-latest) */
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { eventsPageData } from "@/lib/data";

export default function Events() {
  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />
      <main className="pt-[200px] md:pt-[280px] pb-20 md:pb-[120px] px-6 md:px-20 flex flex-col items-center gap-12 md:gap-16">
        <div className="w-full max-w-[1280px] flex flex-col gap-10 md:gap-12">
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
              <Link key={e.id} href={`/events/${e.id}`} className="relative flex flex-col h-[300px] md:h-[380px] rounded-lg overflow-hidden group">
                <Image src={e.image} alt={e.title} fill className="object-cover" />
                <div className="absolute bottom-0 left-0 right-0 h-[180px] z-[1]" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-5 pb-5 flex flex-col gap-1.5 z-[2]">
                  <span className="text-heading text-bass-white leading-tight">{e.title}</span>
                  <div className="flex justify-between">
                    <span className="text-nav text-bass-grey-med">{e.date}</span>
                    <span className="text-nav text-bass-grey-med">{e.support}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
