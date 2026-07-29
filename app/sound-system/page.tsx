/* BASSMENT — Sound System (v1-latest) */
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SoundHero } from "@/components/sections/sound-hero";
import { SoundHistory } from "@/components/sections/sound-history";
import { SoundSpecs } from "@/components/sections/sound-specs";
import { SoundQuote } from "@/components/sections/sound-quote";
import { soundCtaData } from "@/lib/data";

export default function SoundSystem() {
  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />
      <SoundHero />
      <SoundHistory />
      <SoundSpecs />
      <SoundQuote />
      <section className="py-20 md:py-[160px] flex justify-center">
        <Link href="/events" className="inline-flex h-14 items-center justify-center rounded-none bg-primary text-btn text-bass-white w-fit transition-colors hover:bg-primary/80 px-8">
          {soundCtaData.label}
        </Link>
      </section>
      <Footer />
    </div>
  );
}
