/* BASSMENT — Venue History Section */

import { toParagraphs } from "@/lib/portable-text";

interface Props {
  label?: string;
  body?: unknown;
}

export function VenueHistory({ label, body }: Props) {
  const paragraphs = body ? toParagraphs(body) : []
  if (!label && paragraphs.length === 0) return null

  return (
    <section className="py-20 md:py-120 flex flex-col items-center gap-12 md:gap-16 px-2 lg:px-20">
      <div className="flex flex-col gap-6 md:gap-8 max-w-[720px]">
        {label && (
          <h2 className="text-label-center text-bass-white">{label}</h2>
        )}
        {paragraphs.map((p, i) => (
          <p key={i} className="text-body text-bass-grey-med">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
