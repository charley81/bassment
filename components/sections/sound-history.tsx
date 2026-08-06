/* BASSMENT — Sound System History Section */
import { toParagraphs } from "@/lib/portable-text";
import Image from "next/image";

interface Props {
  label?: string;
  body?: unknown;
  title?: string;
  image: string;
}

export function SoundHistory({ label, body, title, image }: Props) {
  const paragraphs = body ? toParagraphs(body) : []
  if (!label && paragraphs.length === 0 && !title) return null

  return (
    <section className="py-20 md:py-[160px] px-2 lg:px-20 flex flex-col lg:flex-row justify-center gap-8 md:gap-12 max-w-1440 mx-auto">
      <div className="flex flex-col gap-6 md:gap-8 flex-1">
        {label && (
          <p className="text-label text-bass-white">{label}</p>
        )}
        {title && (
          <h2 className="text-subtitle text-bass-grey-light">{title}</h2>
        )}
        <div className="flex flex-col gap-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-body text-bass-grey-med">{p}</p>
          ))}
        </div>
      </div>
      <div className="w-full lg:w-lg shrink-0 p-4">
        <div className="relative h-[300px] md:h-[342px] rounded-lg overflow-hidden">
          <Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, 512px" className="object-cover grayscale" />
          <div className="absolute inset-0 bg-primary/10 z-1" />
        </div>
      </div>
    </section>
  );
}
