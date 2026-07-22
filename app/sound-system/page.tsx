/* BASSMENT — Sound System Page (v1-latest, node #368:548) */
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function SoundSystem() {
  return (
    <div className="flex flex-col min-h-full bg-black">
      <Header />

      {/* Hero — 900px, image + red overlay */}
      <section className="relative h-[900px] w-full flex items-center px-20 overflow-hidden bg-[#333]">
        <Image src="/images/sound-hero.png" alt="Sound System" fill className="object-cover" />
        <div className="absolute inset-0 bg-[var(--color-primary)]/10" />
        <div className="relative z-10 flex flex-col gap-8 max-w-[800px]">
          <p className="text-sm font-extrabold uppercase text-[var(--color-bass-grey-light)]">THE VALVE SOUND SYSTEM</p>
          <h1 className="text-[64px] font-extrabold leading-none text-white">96,000 WATTS OF HAND-BUILT ANALOG POWER</h1>
          <p className="text-xl leading-7 text-[var(--color-bass-grey-light)] max-w-[600px]">&quot;Built by Dillinja & Lemon D, 2001. There is nothing else like it on earth.&quot;</p>
        </div>
      </section>

      {/* History */}
      <section className="py-[160px] px-20 flex justify-center gap-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-8 flex-1">
          <p className="text-base font-bold uppercase text-white">THE HISTORY</p>
          <h2 className="text-[36px] font-bold text-[var(--color-bass-grey-light)]">Born in a London workshop. Perfected over decades.</h2>
          <div className="flex flex-col gap-4">
            <p className="text-base leading-relaxed text-[var(--color-bass-grey-med)]">In the late 90s, the evolution of drum and bass was hitting a physical limit. The sound systems of the time simply couldn&apos;t handle the extreme sub-bass frequencies being pioneered in the studio.</p>
            <p className="text-base leading-relaxed text-[var(--color-bass-grey-med)]">Dillinja and Lemon D decided to take matters into their own hands. They spent years researching acoustic engineering, sourcing rare valve components, and hand-building every single cabinet to their exact specifications.</p>
          </div>
        </div>
        <div className="w-[512px] h-[342px] relative shrink-0">
          <Image src="/images/sound-history.png" alt="History" fill className="object-cover" />
        </div>
      </section>

      {/* Specs */}
      <section className="py-[120px] px-20 flex flex-col items-center gap-20">
        <p className="text-base font-bold uppercase text-white">THE SPECS</p>
        <div className="flex flex-col gap-20 max-w-[900px] w-full">
          {[
            [
              { value: "96k", label: "Watts of Power" },
              { value: "2001", label: "Year Built" },
            ],
            [
              { value: "Class A", label: "Valve Amplification" },
              { value: "20Hz–20kHz", label: "Frequency Range" },
            ],
          ].map((row, ri) => (
            <div key={ri} className="flex justify-center gap-20">
              {row.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-3 flex-1">
                  <span className="text-[48px] font-extrabold text-[var(--color-bass-grey-light)]">{s.value}</span>
                  <span className="text-base font-medium uppercase text-[var(--color-bass-grey-med)]">{s.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Subway quote */}
      <section className="relative h-[700px] w-full max-w-[1440px] mx-auto flex items-center justify-center px-20 rounded-lg overflow-hidden">
        <Image src="/images/sound-subway-7609bd.png" alt="Subway" fill className="object-cover" />
        <div className="absolute inset-0 bg-[rgba(255,0,0,0.1)]" />
        <p className="relative z-10 text-base leading-relaxed text-center text-[#090102] max-w-[800px]">&quot;The building itself was reinforced to withstand the subway lines passing through Manhattan. We realized BASSMENT wasn&apos;t just a club; it was a physical resonance chamber for the Valve system.&quot;</p>
      </section>

      {/* CTA */}
      <section className="py-[160px] flex justify-center">
        <Link href="/events" className="inline-flex h-14 px-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-base font-bold text-white hover:bg-[var(--color-primary)]/80 transition-colors">Experience It Yourself</Link>
      </section>

      <Footer />
    </div>
  );
}
