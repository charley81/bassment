/* BASSMENT — Sound System Hero Section */
import Image from "next/image";
import { soundHeroData } from "@/lib/data";

export function SoundHero() {
  return (
    <section className="relative h-[600px] md:h-[900px] w-full flex items-center px-6 md:px-20 overflow-hidden">
      <Image
        src={soundHeroData.image}
        alt=""
        fill
        className="object-cover img-greyscale"
      />
      <div className="absolute inset-0 bg-(--color-primary)/10 z-[1]" />
      <div className="relative z-[2] flex flex-col gap-6 md:gap-8 max-w-[800px]">
        <p className="text-label-sm text-bass-grey-light">
          {soundHeroData.eyebrow}
        </p>
        <h1 className="text-h2 text-bass-white">{soundHeroData.headline}</h1>
        <p className="text-quote text-bass-grey-light max-w-[600px]">
          {soundHeroData.quote}
        </p>
      </div>
    </section>
  );
}
