import { defineType, defineField } from 'sanity'

export const venuePage = defineType({
  name: 'venuePage',
  title: 'Venue Page',
  type: 'document',
  fields: [
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'string' }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'heroImageAlt', title: 'Hero Image Alt', type: 'string' }),
    defineField({ name: 'historyLabel', title: 'History Section Label', type: 'string' }),
    defineField({ name: 'historyBody', title: 'History Body', type: 'blockContent' }),
    defineField({ name: 'stats', title: 'Stats', type: 'array', of: [{ type: 'object', fields: [
      { name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() },
      { name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() },
    ] }] }),
    defineField({ name: 'photoGrid', title: 'Photo Grid', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'mapFallbackImage', title: 'Map Fallback Image', type: 'image' }),
    defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
  ],
})
