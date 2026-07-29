/* BASSMENT — Sound System Quote Section */
import Image from "next/image";

interface Props {
  quote?: string;
  image: string;
}

export function SoundQuote({ quote, image }: Props) {
  if (!quote) return null

  return (
    <section className="relative h-400 md:h-[700px] w-full max-w-1440 mx-auto flex items-center justify-center px-6 md:px-20 rounded-lg overflow-hidden">
      <Image
        src={image}
        alt=""
        fill
        className="object-cover grayscale"
      />
      <div className="absolute inset-0 bg-primary/10 z-1" />
      <p className="relative z-2 text-body text-center text-bass-dark max-w-800">
        {quote}
      </p>
    </section>
  );
}
