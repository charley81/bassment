/* BASSMENT — Events Page (v1-latest, node #368:177, bg #000000) */
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const allEvents = [
  { img: "/images/event-dlr-events.png", title: "DLR b2b Break", date: "Sat 01 Nov", support: "with SP:MC, Hydro" },
  { img: "/images/event-goldie-events.png", title: "Goldie - Timeless Set", date: "Fri 07 Nov", support: "with MC GQ" },
  { img: "/images/event-calibre-events.png", title: "Calibre - Deep Cuts", date: "Sat 15 Nov", support: "All Night Long" },
  { img: "/images/event-sully-events.png", title: "Sully b2b Tim Reaper", date: "Fri 21 Nov", support: "Jungle Special" },
  { img: "/images/event-alix-perez.png", title: "Alix Perez", date: "Fri 28 Nov", support: "1985 Music Night" },
  { img: "/images/event-doc-scott.png", title: "Doc Scott", date: "Sat 06 Dec", support: "31 Records Showcase" },
  { img: "/images/event-om-unit.png", title: "Om Unit", date: "Fri 12 Dec", support: "with Skeptical" },
  { img: "/images/event-digital.png", title: "Digital & Spirit Tribute", date: "Fri 05 Sep", support: "Phantom Force" },
  { img: "/images/event-storm.png", title: "DJ Storm & Friends", date: "Wed 31 Dec", support: "New Year's Eve" },
  { img: "/images/event-loxy.png", title: "Loxy b2b Ink", date: "Sat 25 Apr", support: "Renegade Hardware" },
  { img: "/images/event-special-request.png", title: "Special Request", date: "Sat 09 May", support: "Spectral Frequency" },
  { img: "/images/event-dbridge.png", title: "dBridge", date: "Sat 14 Feb", support: "Exit Records Night" },
  { img: "/images/event-ivy-lab.png", title: "Ivy Lab", date: "Sat 28 Feb", support: "20/20 LDN Takeover" },
  { img: "/images/event-commix.png", title: "Commix", date: "Sat 14 Mar", support: "Call to Mind Live" },
  { img: "/images/event-marcus-intalex.png", title: "Marcus Intalex", date: "Sat 28 Mar", support: "Foundation Night" },
  { img: "/images/event-dom-roland.png", title: "Dom & Roland", date: "Sat 11 Apr", support: "Dubs from the Dungeon" },
];

export default function Events() {
  return (
    <div className="flex flex-col min-h-full bg-black">
      <Header />
      <main className="pt-[280px] pb-[120px] px-20 flex flex-col items-center gap-16">
        <div className="w-[1280px] flex flex-col gap-12">
          <h1 className="text-[72px] font-extrabold text-white">EVENTS</h1>
          <div className="flex gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-base font-bold text-white">Upcoming</span>
              <div className="h-0.5 bg-white" />
            </div>
            <span className="text-base font-medium text-[var(--color-bass-grey-med)]">Past</span>
          </div>
          <div className="flex flex-col gap-8">
            {[0, 4, 8, 12].map((start) => (
              <div key={start} className="flex gap-8">
                {allEvents.slice(start, start + 4).map((e, i) => (
                  <Link key={i} href={`/events/${e.title.toLowerCase().replace(/\s+/g, "-")}`} className="relative flex flex-col h-[380px] w-[296px] rounded-lg overflow-hidden group shrink-0">
                    <Image src={e.img} alt={e.title} fill className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 h-[180px]" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)" }} />
                    <div className="absolute bottom-0 left-0 right-0 p-5 pb-5 flex flex-col gap-1.5 z-10">
                      <span className="text-[30px] font-bold uppercase text-white leading-tight">{e.title}</span>
                      <div className="flex justify-between">
                        <span className="text-base text-[var(--color-bass-grey-med)]">{e.date}</span>
                        <span className="text-base text-[var(--color-bass-grey-med)]">{e.support}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
