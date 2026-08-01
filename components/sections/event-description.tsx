/* BASSMENT — Event Description Section */
import { toParagraphs, type PortableTextBlockLike } from "@/lib/portable-text";

interface Props {
  description?: PortableTextBlockLike[];
}

export function EventDescription({ description }: Props) {
  const paragraphs = toParagraphs(description);
  if (paragraphs.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 pt-16 md:pt-20 max-w-800 mx-auto">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-body text-bass-grey-med">
          {p}
        </p>
      ))}
    </div>
  );
}
