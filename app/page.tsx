/*
 * BASSMENT — Home Page (v1-latest, node #368:3)
 * Dark bg (#090102), 1728px max width, JetBrains Mono
 */
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const events = [
  { img: "/images/event-dlr.png", title: "DLR b2b Break", date: "Sat 01 Nov", support: "with SP:MC, Hydro" },
  { img: "/images/event-goldie.png", title: "Goldie - Timeless Set", date: "Fri 07 Nov", support: "with MC GQ" },
  { img: "/images/event-calibre.png", title: "Calibre - Deep Cuts", date: "Sat 15 Nov", support: "All Night Long" },
  { img: "/images/event-sully.png", title: "Sully b2b Tim Reaper", date: "Fri 21 Nov", support: "Jungle Special" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-[#090102]">
      <Header />

      {/* HERO — 1728×900, image bg + red overlay */}
      <section className="relative h-[900px] w-full overflow-hidden bg-[#333]">
        <Image src="/images/hero-bg-home-3ab357.png" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[var(--color-primary)]/10" />
        <div className="absolute left-20 top-[280px] flex flex-col gap-8 max-w-[1343px] z-10">
          <div className="flex flex-col gap-2">
            <p className="text-base font-medium uppercase text-[var(--color-bass-grey-med)]">DRUM & BASS | TECHSTEP | DRUMFUNK | JUNGLE</p>
            <h1 className="text-[128px] font-extrabold leading-none text-white">FEEL THE BASS</h1>
          </div>
          <div className="flex flex-col gap-8">
            <p className="text-base leading-6 text-[var(--color-bass-grey-med)] max-w-[676px]">Manhattan&apos;s only Valve Sound System venue. 96,000 watts of hand-built analog power.</p>
            <Link href="/events" className="inline-flex h-14 px-10 items-center justify-center rounded-lg bg-white text-base font-bold text-[#090102] hover:bg-[var(--color-bass-grey-light)] transition-colors">Get Tickets</Link>
          </div>
        </div>
      </section>

      {/* FEATURED EVENT — padding 160px 80px */}
      <section className="py-[160px] px-20">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
          <h2 className="text-[48px] font-bold uppercase text-white">Next event</h2>
          <div className="flex rounded overflow-hidden">
            <div className="w-[768px] h-[1028px] relative shrink-0">
              <Image src="/images/dillinja-valve-featured.png" alt="Dillinja" fill className="object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center gap-8 p-12 bg-[#090102]">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <p className="text-base text-[var(--color-bass-grey-med)]">FRI / 24 OCT</p>
                  <h3 className="text-[36px] font-bold text-white">Dillinja — Valve Sound System Takeover</h3>
                </div>
                <p className="text-base text-[var(--color-primary)]">with Lemon D, Goldie, and DJ Storm</p>
                <p className="text-base leading-relaxed text-[var(--color-bass-grey-med)]">A legendary sound system meets its creators. The Valve Sound System returns to its spiritual Manhattan home for an all-night exploration of the foundation.</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/events/dillinja-valve" className="inline-flex h-14 px-6 items-center justify-center rounded-lg bg-[var(--color-primary)] text-base font-bold text-white hover:bg-[var(--color-primary)]/80 transition-colors">Get Tickets</Link>
                <span className="inline-flex h-8 px-3 items-center rounded-full bg-[var(--color-bass-grey-dark)] border border-[var(--color-bass-grey-light)] text-base font-bold uppercase text-[var(--color-bass-grey-light)]">ON SALE NOW</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING — padding 120px 80px, gap 64 */}
      <section className="py-[120px] px-20">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
          <div className="flex justify-between items-end">
            <h2 className="text-[48px] font-bold text-white">UPCOMING</h2>
            <Link href="/events" className="text-base underline text-[var(--color-primary)] hover:text-white transition-colors">View All Events →</Link>
          </div>
          <div className="flex gap-8">
            {events.map((e, i) => (
              <Link key={i} href={`/events/${e.title.toLowerCase().replace(/\s+/g, "-")}`} className="relative flex flex-col h-[380px] w-[296px] rounded overflow-hidden group shrink-0">
                <Image src={e.img} alt={e.title} fill className="object-cover" />
                <div className="absolute bottom-0 left-0 right-0 h-[180px]" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-5 pb-5 flex flex-col gap-1.5 z-10">
                  <span className="text-[30px] font-bold uppercase text-white leading-tight">{e.title}</span>
                  <div className="flex justify-between">
                    <span className="text-base text-[var(--color-bass-grey-light)]">{e.date}</span>
                    <span className="text-base text-[var(--color-bass-grey-light)]">{e.support}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VENUE — padding 140px 80px */}
      <section className="py-[140px] px-20">
        <div className="max-w-[1280px] mx-auto flex items-center gap-12">
          <div className="w-[616px] h-[721px] relative shrink-0 rounded-lg overflow-hidden">
            <Image src="/images/venue-space-ab4185.png" alt="Venue" fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-base uppercase text-[var(--color-primary)]">THE SPACE</p>
              <h3 className="text-[36px] font-bold text-white">Built beneath the city. Tuned to the subway.</h3>
            </div>
            <p className="text-base leading-relaxed text-[var(--color-bass-grey-med)]">Located four stories beneath 70 Pine Street, BASSMENT is a reinforced concrete chamber designed for physical frequency. No decor, no distractions, just the largest analog sound system in North America.</p>
            <Link href="/venue" className="inline-flex h-12 px-5 items-center justify-center rounded-lg bg-[var(--color-primary)] text-base font-medium text-[#EEE] hover:bg-[var(--color-primary)]/80 transition-colors">Explore the Venue →</Link>
          </div>
        </div>
      </section>

      {/* RESIDENT DJ — padding 120px 80px, centered */}
      <section className="py-[120px] px-20 flex flex-col items-center gap-4">
        <p className="text-base font-medium uppercase text-[var(--color-primary)]">RESIDENT</p>
        <div className="flex flex-col items-center gap-8 max-w-[520px]">
          <div className="w-[240px] h-[240px] relative rounded-full overflow-hidden">
            <Image src="/images/dj-storm.png" alt="DJ Storm" fill className="object-cover" />
          </div>
          <h3 className="text-[36px] font-bold text-center text-white">DJ STORM</h3>
          <p className="text-base leading-relaxed text-center text-[var(--color-bass-grey-med)]">The First Lady of Drum & Bass. A master of the techstep and jungle foundations, curating the BASSMENT sound since night one.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Jungle", "Amen", "Techstep"].map((t) => (
              <span key={t} className="inline-flex h-8 px-3 items-center rounded-lg border border-[var(--color-bass-grey-light)] bg-[var(--color-bass-grey-dark)] text-base text-[var(--color-bass-grey-light)]">{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "border border-[var(--color-bass-grey-dark)]"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER — padding 120px 0, #533C3D bg */}
      <section className="py-[120px] flex flex-col items-center bg-[var(--color-bass-grey-dark)]">
        <div className="flex flex-col items-center gap-8 max-w-[520px]">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-[36px] font-bold text-center text-white">GET EARLY ACCESS</h3>
            <p className="text-base text-center text-[var(--color-bass-grey-med)]">Tickets drop to our mailing list first. Don&apos;t get locked out.</p>
          </div>
          <div className="flex gap-1 w-full">
            <input type="email" placeholder="your@email.com" className="flex-1 h-14 px-5 rounded-lg bg-[#090102] border border-[var(--color-bass-border)] text-base text-[var(--color-bass-grey-med)] placeholder:text-[var(--color-bass-grey-med)] focus:outline-none focus:border-[var(--color-primary)]" />
            <button className="h-14 px-6 rounded-lg bg-[var(--color-primary)] text-base font-bold text-white hover:bg-[var(--color-primary)]/80 transition-colors shrink-0">Subscribe</button>
          </div>
          <p className="text-sm text-[var(--color-bass-grey-light)]">Unsubscribe at any timE</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
