import { defineType, defineField } from 'sanity'

export const soundSystemPage = defineType({
  name: 'soundSystemPage',
  title: 'Sound System Page',
  type: 'document',
  fields: [
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'heroImageAlt', title: 'Hero Image Alt', type: 'string' }),
    defineField({ name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'string' }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'heroQuote', title: 'Hero Quote', type: 'string' }),
    defineField({ name: 'heroDescription', title: 'Hero Description', type: 'string' }),
    defineField({ name: 'historyLabel', title: 'History Section Label', type: 'string' }),
    defineField({ name: 'historyBody', title: 'History Body', type: 'blockContent' }),
    defineField({ name: 'historyImage', title: 'History Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'historyImageAlt', title: 'History Image Alt', type: 'string' }),
    defineField({ name: 'specs', title: 'Specifications', type: 'array', of: [{ type: 'object', fields: [
      { name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() },
      { name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() },
    ] }] }),
    defineField({ name: 'subwayQuote', title: 'Subway Section Quote', type: 'string' }),
    defineField({ name: 'subwayImage', title: 'Subway Section Image', type: 'image' }),
    defineField({ name: 'subwayImageAlt', title: 'Subway Image Alt', type: 'string' }),
    defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
  ],
})
