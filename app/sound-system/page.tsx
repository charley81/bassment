/* BASSMENT — Sound System (v1-latest) */
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { soundHeroData, soundHistoryData, soundSpecs, soundSubwayData, soundCtaData } from "@/lib/data";

export default function SoundSystem() {
  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />

      <section className="relative h-[600px] md:h-[900px] w-full flex items-center px-6 md:px-20 overflow-hidden">
        <Image src={soundHeroData.image} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-[var(--color-primary)]/10 z-[1]" />
        <div className="relative z-[2] flex flex-col gap-6 md:gap-8 max-w-[800px]">
          <p className="text-label-sm text-bass-grey-light">{soundHeroData.eyebrow}</p>
          <h1 className="text-h2 text-bass-white">{soundHeroData.headline}</h1>
          <p className="text-quote text-bass-grey-light max-w-[600px]">{soundHeroData.quote}</p>
        </div>
      </section>

      <section className="py-20 md:py-[160px] px-6 md:px-20 flex flex-col md:flex-row justify-center gap-8 md:gap-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-6 md:gap-8 flex-1">
          <p className="text-label text-bass-white">{soundHistoryData.label}</p>
          <h2 className="text-subtitle text-bass-grey-light">{soundHistoryData.title}</h2>
          <div className="flex flex-col gap-4">
            {soundHistoryData.paragraphs.map((p, i) => (
              <p key={i} className="text-body text-bass-grey-med">{p}</p>
            ))}
          </div>
        </div>
        <div className="w-full md:w-[512px] h-[300px] md:h-[342px] relative shrink-0">
          <Image src={soundHistoryData.image} alt="" fill className="object-cover" />
        </div>
      </section>

      <section className="py-20 md:py-[120px] px-6 md:px-20 flex flex-col items-center gap-16 md:gap-20">
        <p className="text-label text-bass-white">THE SPECS</p>
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 max-w-[900px] w-full">
          {[0, 2].map((start) => (
            <div key={start} className="flex justify-center gap-10 md:gap-20 flex-1">
              {soundSpecs.slice(start, start + 2).map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-3 flex-1">
                  <span className="text-h6 text-bass-grey-light">{s.value}</span>
                  <span className="text-label-medium text-bass-grey-med">{s.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="relative h-[400px] md:h-[700px] w-full max-w-[1440px] mx-auto flex items-center justify-center px-6 md:px-20 rounded-lg overflow-hidden">
        <Image src={soundSubwayData.image} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-[rgba(255,0,0,0.1)] z-[1]" />
        <p className="relative z-[2] text-body text-center text-bass-dark max-w-[800px]">{soundSubwayData.quote}</p>
      </section>

      <section className="py-20 md:py-[160px] flex justify-center">
        <Link href="/events" className="inline-flex h-14 px-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-btn text-bass-white hover:bg-[var(--color-primary)]/80 transition-colors">{soundCtaData.label}</Link>
      </section>

      <Footer />
    </div>
  );
}
