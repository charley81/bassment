/* BASSMENT — Venue History Section */

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
}

export function VenueHistory({ label, body }: Props) {
  const paragraphs = body ? blocksToText(body) : []
  if (!label && paragraphs.length === 0) return null

  return (
    <section className="py-20 md:py-120 flex flex-col items-center gap-12 md:gap-16 px-6">
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
