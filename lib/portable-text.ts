/* Shared Portable Text (Sanity block content) helpers */

export interface PortableTextBlockLike {
  _type?: string
  children?: { text?: string }[]
}

/** Block content → array of paragraph strings */
export function toParagraphs(blocks: unknown): string[] {
  if (typeof blocks === 'string') return blocks ? [blocks] : []
  if (!Array.isArray(blocks)) return []
  return blocks
    .filter((b: PortableTextBlockLike) => b._type === 'block')
    .flatMap((b: PortableTextBlockLike) =>
      b.children?.map((c) => c.text ?? '').join('') ?? []
    )
}

/** Block content → single joined string */
export function toPlainText(blocks: unknown): string {
  return toParagraphs(blocks).join(' ')
}
