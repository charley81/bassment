import { defineType, defineField } from 'sanity'

export const artist = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string', options: { list: ['resident', 'guest'] }, initialValue: 'guest', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'blockContent' }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'altText', title: 'Alt Text', type: 'string' }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'soundcloud', title: 'SoundCloud URL', type: 'url' }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
})
