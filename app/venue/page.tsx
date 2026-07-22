/* BASSMENT — Venue Page (v1-latest, node #368:651) */
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const stats = [
  { value: "400", label: "CAPACITY" },
  { value: "10PM–4AM", label: "HOURS" },
  { value: "21+ with ID", label: "AGE" },
  { value: "Valve System", label: "SOUND" },
];

export default function Venue() {
  return (
    <div className="flex flex-col min-h-full bg-black">
      <Header />

      {/* Hero — 900px, image + overlay */}
      <section className="relative h-[900px] w-full overflow-hidden bg-[#333]">
        <Image src="/images/venue-hero-7ee754.png" alt="Venue" fill className="object-cover" />
        <div className="absolute inset-0 bg-[var(--color-primary)]/10" />
        <div className="absolute left-20 bottom-[213px] flex flex-col gap-4 max-w-[800px] z-10">
          <h1 className="text-[48px] font-extrabold text-white">70 PINE STREET, MANHATTAN</h1>
          <p className="text-lg leading-7 text-white">Built above the Cobble Hill Tunnel. A space carved from the city&apos;s foundations.</p>
        </div>
      </section>

      {/* History */}
      <section className="py-[120px] flex flex-col items-center gap-16">
        <div className="flex flex-col gap-8 max-w-[720px]">
          <h2 className="text-base font-bold uppercase text-center text-white">THE HISTORY</h2>
          {[
            "The story of BASSMENT begins in 2018 with a search for a venue that could withstand the pure physical pressure of the Valve Sound System. After months of surveying lower Manhattan, we discovered a decommissioned cold-storage vault four stories beneath Pine Street.",
            "The reinforced concrete walls were over three feet thick, originally designed to keep heavy industrial machinery isolated from the subway vibrations passing just dozens of feet away. It was perfect: a structure that didn't just contain noise, but resonated with it.",
          ].map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-[var(--color-bass-grey-med)]">{p}</p>
          ))}
          <blockquote className="border-l-2 border-[var(--color-bass-grey-light)] pl-6 py-0">
            <p className="text-base font-medium leading-6 text-[#EEE]">&ldquo;THIS IS NOT A CLUB... IT&rsquo;S A VAULT&rdquo;</p>
          </blockquote>
          {[
            "Soundproofing was an architectural impossibility; instead, we opted for total reinforcement. We tuned the room to the frequency of the nearby 2/3 and 4/5 subway lines, allowing the city's natural pulse to blend into the low-end foundations of the sound system.",
            "In 2021, Dillinja and Lemon D oversaw the final installation of the 96,000-watt Valve system. The hand-built analog stacks were bolted directly into the concrete bedrock, ensuring that every watt of power is felt as much as it is heard.",
            "Today, BASSMENT stands as the only dedicated Valve venue in the United States. We serve as a lighthouse for those who value the weight, the warmth, and the physical discipline of drum & bass.",
          ].map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-[var(--color-bass-grey-med)]">{p}</p>
          ))}
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-[120px] px-20 flex flex-col items-center gap-8">
        <h2 className="text-base font-bold uppercase text-center text-white">THE SPACE TODAY</h2>
        <div className="flex flex-col gap-4 max-w-[1280px]">
          {[
            ["/images/venue-photo-1.png", "/images/venue-photo-2.png", "/images/venue-photo-3.png"],
            ["/images/venue-photo-4.png", "/images/venue-photo-5.png", "/images/venue-photo-6.png"],
          ].map((row, ri) => (
            <div key={ri} className="flex gap-4 h-[420px]">
              {row.map((src, i) => (
                <div key={i} className="relative flex-1 rounded-lg overflow-hidden border border-[var(--color-bass-border)]">
                  <Image src={src} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-20 flex justify-center">
        <div className="flex justify-between w-[1000px]">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-3">
              <span className="text-[30px] font-extrabold text-[#EEE]">{s.value}</span>
              <span className="text-base font-medium uppercase text-[var(--color-bass-muted)]">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Plan Your Visit */}
      <section className="py-[120px] flex flex-col items-center">
        <div className="p-8 flex flex-col gap-8 max-w-[800px] w-full bg-[var(--color-bass-grey-dark)] border border-[var(--color-bass-grey-med)] rounded-lg">
          <h3 className="text-[30px] font-extrabold text-white">PLAN YOUR VISIT</h3>
          <div className="flex flex-col gap-4">
            {[
              "• 70 Pine Street, Manhattan. Entrance on Pine Street side.",
              "• Subway: 2/3 Wall St, 4/5 Fulton St, J/Z Broad St. All within 3 blocks.",
              "• Doors 10PM. Music until 4AM. Headliners typically 1AM–3AM.",
              "• 21+ with valid government ID. No exceptions.",
              "• Coat check: $5 cash or Venmo.",
              "• No large bags. No professional cameras without approval.",
            ].map((l, i) => (
              <p key={i} className="text-base leading-relaxed text-[var(--color-bass-grey-light)]">{l}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-[120px] px-20 flex justify-center">
        <div className="relative w-full max-w-[1440px] h-[420px] rounded-lg overflow-hidden border border-[var(--color-bass-border)] flex items-center justify-center gap-3">
          <Image src="/images/venue-map.png" alt="Map" fill className="object-cover" />
          <span className="relative z-10 text-base text-[var(--color-bass-muted)]">70 PINE STREET, NEW YORK, NY 10005</span>
        </div>
      </section>

      {/* CTA */}
      <section className="h-[216px] flex items-center justify-center">
        <Link href="/events" className="inline-flex h-14 px-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-base font-bold text-white hover:bg-[var(--color-primary)]/80 transition-colors">See What&apos;s On →</Link>
      </section>

      <Footer />
    </div>
  );
}
