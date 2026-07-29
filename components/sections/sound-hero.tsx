/* BASSMENT — Sound System Hero Section */
import Image from "next/image";

interface Props {
  image: string;
  eyebrow?: string;
  headline?: string;
  quote?: string;
}

export function SoundHero({ image, eyebrow, headline, quote }: Props) {
  return (
    <section className="relative h-600 md:h-900 w-full flex items-center px-6 md:px-20 overflow-hidden">
      <Image
        src={image}
        alt=""
        fill
        className="object-cover grayscale"
        priority
      />
      <div className="absolute inset-0 bg-primary/10 z-1" />
      <div className="relative z-2 flex flex-col gap-6 md:gap-8 max-w-800">
        {eyebrow && (
          <p className="text-label-sm text-bass-grey-light">{eyebrow}</p>
        )}
        {headline && (
          <h1 className="text-h2 text-bass-white">{headline}</h1>
        )}
        {quote && (
          <p className="text-quote text-bass-grey-light max-w-600">{quote}</p>
        )}
      </div>
    </section>
  );
}
