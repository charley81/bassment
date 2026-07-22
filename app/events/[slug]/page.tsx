/* BASSMENT — Event Detail (v1-latest, node #368:383) */
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function EventDetail() {
  return (
    <div className="flex flex-col min-h-full bg-black">
      <Header />
      <main className="pt-[280px] pb-[120px] px-20 flex flex-col items-center">
        <div className="w-[1280px] flex flex-col gap-12">
          <Link href="/events" className="text-base text-[var(--color-bass-grey-light)] hover:text-white transition-colors">← Back to Events</Link>

          {/* Hero Split */}
          <div className="flex items-center gap-12">
            <div className="w-[739px] h-[990px] relative shrink-0">
              <Image src="/images/dillinja-valve-detail.png" alt="Dillinja" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-8 flex-1">
              <div className="flex flex-col gap-8">
                <h1 className="text-[48px] font-extrabold leading-tight text-white">DILLINJA — VALVE SOUND SYSTEM TAKEOVER</h1>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    {[
                      { label: "DOORS", time: "10:00 PM" },
                      { label: "FIRST ACT", time: "11:00 PM" },
                      { label: "HEADLINER", time: "1:00 AM" },
                    ].map((s) => (
                      <div key={s.label} className="flex flex-col gap-1">
                        <span className="text-base font-bold text-[var(--color-bass-grey-light)]">{s.label}</span>
                        <span className="text-base text-[var(--color-bass-grey-med)]">{s.time}</span>
                      </div>
                    ))}
                  </div>
                  <hr className="border-[var(--color-bass-border)]" />
                </div>
                <p className="text-base font-bold text-[var(--color-bass-grey-med)]">Friday, 24 October 2025</p>
                <div className="flex gap-6">
                  {[
                    { num: "12", label: "DAYS" },
                    { num: "08", label: "HRS" },
                    { num: "45", label: "MIN" },
                    { num: "22", label: "SEC" },
                  ].map((c) => (
                    <div key={c.label} className="flex flex-col gap-2">
                      <span className="text-[48px] font-extrabold text-[var(--color-bass-grey-light)]">{c.num}</span>
                      <span className="text-base font-medium uppercase text-[var(--color-bass-grey-med)]">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Link href="#" className="flex items-center justify-center h-[60px] px-8 rounded-lg bg-[var(--color-primary)] text-base font-bold text-white hover:bg-[var(--color-primary)]/80 transition-colors">Get Tickets — $25 GA / $50 VIP</Link>
                <span className="inline-flex self-start px-3 py-1.5 rounded-full bg-[#090102] border border-[var(--color-bass-grey-med)] text-base font-bold uppercase text-[var(--color-bass-grey-med)]">ON SALE NOW</span>
              </div>
            </div>
          </div>

          {/* Lineup */}
          <div className="flex flex-col gap-12 pt-20">
            <h2 className="text-base font-bold uppercase text-center text-white">LINEUP</h2>
            <div className="flex justify-center gap-6">
              {[
                { name: "Dillinja", time: "11PM–1AM" },
                { name: "Lemon D", time: "1AM–2:30AM" },
                { name: "DJ Marky", time: "2:30AM–4AM" },
                { name: "DJ Storm", time: "4AM–Close" },
              ].map((a) => (
                <div key={a.name} className="flex flex-col items-center gap-4 flex-1">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[28px] font-bold text-[var(--color-bass-grey-light)]">{a.name}</span>
                    <span className="text-base text-[var(--color-bass-grey-med)]">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-6 pt-20 max-w-[800px] mx-auto">
            {[
              "BASSMENT presents an exclusive all-night takeover featuring the legendary Valve Sound System. Designed and built by Dillinja and Lemon D, this is more than a sound system; it's the physical embodiment of jungle and drum & bass history.",
              "The Valve Sound System was created to provide the ultimate listening experience for the low-frequency sounds of the underground. With 96,000 watts of hand-built analog power, every frequency is tuned to perfection, ensuring that the bass is felt as much as it is heard.",
              "Join us for a journey through the foundation of the sound. Expect unreleased dubplates, classic anthems, and the purest technical execution from the scene's most respected pioneers. This event is strictly for those who know.",
            ].map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-[var(--color-bass-grey-med)]">{p}</p>
            ))}
          </div>

          {/* Venue Info Card */}
          <div className="max-w-[800px] mx-auto w-full p-12 flex flex-col gap-8 bg-[var(--color-bass-grey-dark)] border border-[var(--color-bass-border)] rounded-lg mt-20">
            <div className="flex flex-col gap-3">
              <p className="text-sm uppercase text-[var(--color-bass-grey-light)]">VENUE INFO</p>
              <p className="text-lg font-bold text-white">70 Pine Street, Manhattan</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-base text-[var(--color-bass-grey-light)]">Nearest subway: 2/3 Wall St, 4/5 Fulton St</p>
              <p className="text-base text-[var(--color-bass-grey-light)]">Doors: 10PM | 21+ with valid ID | Coat check available</p>
            </div>
            <Link href="/faq" className="text-base underline text-white hover:text-[var(--color-primary)] transition-colors">View full FAQ →</Link>
          </div>

          {/* Map */}
          <div className="relative w-[800px] h-[300px] mx-auto mt-20 rounded-lg overflow-hidden border border-[var(--color-bass-border)]">
            <Image src="/images/detail-map.png" alt="Map" fill className="object-cover" />
          </div>

          {/* Related Events */}
          <div className="flex flex-col gap-8 pt-20">
            <h3 className="text-[28px] font-extrabold text-[#EEE]">MORE EVENTS</h3>
            <div className="flex gap-8">
              {[
                { img: "/images/detail-related-dlr.png", title: "DLR b2b Break", date: "Sat 01 Nov", support: "with SP:MC, Hydro" },
                { img: "/images/detail-related-goldie.png", title: "Goldie — Timeless", date: "Fri 07 Nov", support: "with MC GQ" },
                { img: "/images/detail-related-calibre.png", title: "Calibre — Deep Cuts", date: "Sat 15 Nov", support: "All Night Long" },
              ].map((e, i) => (
                <Link key={i} href="#" className="relative flex flex-col h-[380px] w-[405px] rounded-lg overflow-hidden shrink-0">
                  <Image src={e.img} alt={e.title} fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 h-[180px]" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1.5 z-10">
                    <span className="text-[30px] font-bold uppercase text-white">{e.title}</span>
                    <div className="flex justify-between">
                      <span className="text-base text-[var(--color-bass-grey-med)]">{e.date}</span>
                      <span className="text-base text-[var(--color-bass-grey-med)]">{e.support}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
