/* BASSMENT — Sound System Hero Section */
import Image from "next/image";
import { Reveal } from "@/components/animations/reveal";

interface Props {
  image: string;
  eyebrow?: string;
  headline?: string;
  quote?: string;
}

export function SoundHero({ image, eyebrow, headline, quote }: Props) {
  return (
    <section className="relative h-600 md:h-900 w-full flex items-center px-4 lg:px-20 overflow-hidden bg-bass-dark">
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover grayscale"
        priority
      />
      <div className="absolute inset-0 bg-primary/10 z-1" />
      <div className="relative z-2 flex flex-col gap-6 md:gap-8 max-w-800">
        {eyebrow && (
          <Reveal mode="load" delay={0.05} y={16}>
            <p className="text-label-sm text-bass-grey-light">{eyebrow}</p>
          </Reveal>
        )}
        {headline && (
          <Reveal mode="load" delay={0.2} y={32}>
            <h1 className="text-h2 text-bass-white">{headline}</h1>
          </Reveal>
        )}
        {quote && (
          <Reveal mode="load" delay={0.35} y={24}>
            <p className="text-quote text-bass-grey-light max-w-600">{quote}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
