/* BASSMENT — Sound System History Section */
import Image from "next/image";

function blocksToText(blocks: unknown): string[] {
  if (!Array.isArray(blocks)) return []
  return blocks
    .filter((b: { _type?: string }) => b._type === 'block')
    .flatMap((b: { children?: { text?: string }[] }) =>
      b.children?.map((c) => c.text ?? '').join('') ?? []
    )
}

interface Props {
  label?: string;
  body?: unknown;
  title?: string;
  image: string;
}

export function SoundHistory({ label, body, title, image }: Props) {
  const paragraphs = body ? blocksToText(body) : []
  if (!label && paragraphs.length === 0 && !title) return null

  return (
    <section className="py-20 md:py-[160px] px-6 md:px-20 flex flex-col md:flex-row justify-center gap-8 md:gap-12 max-w-1440 mx-auto">
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
      <div className="w-full md:w-lg h-[300px] md:h-[342px] relative shrink-0">
        <Image src={image} alt="" fill className="object-cover" />
      </div>
    </section>
  );
}
