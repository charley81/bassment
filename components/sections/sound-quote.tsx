/* BASSMENT — Sound System Quote Section */
import Image from "next/image";

interface Props {
  quote?: string;
  image: string;
}

export function SoundQuote({ quote, image }: Props) {
  if (!quote) return null

  return (
    <section className="relative h-400 md:h-[700px] w-full flex items-center justify-center overflow-hidden bg-bass-dark">
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover grayscale"
        priority
      />
      <div className="absolute inset-0 bg-primary/10 z-1" />
      <p className="relative z-2 text-body text-center text-bass-dark max-w-800 px-4 lg:px-20">
        {quote}
      </p>
    </section>
  );
}
