import { defineType, defineField } from 'sanity'

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'altText', title: 'Alt Text', type: 'string' }),
    defineField({ name: 'size', title: 'Size', type: 'string', options: { list: ['tall', 'short'] }, initialValue: 'short', validation: (r) => r.required() }),
    defineField({ name: 'order', title: 'Order', type: 'number', validation: (r) => r.required() }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'altText', media: 'image', subtitle: 'size' } },
})
