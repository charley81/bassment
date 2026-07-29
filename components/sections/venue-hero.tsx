/* BASSMENT — Venue Hero Section */
import Image from "next/image";

interface Props {
  headline: string;
  subtitle?: string;
  image: string;
}

export function VenueHero({ headline, subtitle, image }: Props) {
  return (
    <section className="relative h-600 md:h-900 w-full overflow-hidden">
      <Image
        src={image}
        alt=""
        fill
        className="object-cover grayscale"
        priority
      />
      <div className="absolute inset-0 bg-primary/10 z-1" />
      <div className="absolute left-6 md:left-20 bottom-20 md:bottom-[213px] flex flex-col gap-4 max-w-800 z-2">
        <h1 className="text-h6 text-bass-white">{headline}</h1>
        {subtitle && (
          <p className="text-body-large text-bass-white">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
