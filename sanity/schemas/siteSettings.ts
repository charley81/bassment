import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', title: 'Site Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'newsletterTitle', title: 'Newsletter Title', type: 'string' }),
    defineField({ name: 'newsletterDescription', title: 'Newsletter Description', type: 'text' }),
    defineField({ name: 'newsletterPlaceholder', title: 'Newsletter Placeholder', type: 'string' }),
    defineField({ name: 'newsletterDisclaimer', title: 'Newsletter Disclaimer', type: 'string' }),
    defineField({ name: 'venueAddress', title: 'Venue Address', type: 'string' }),
    defineField({ name: 'venueLat', title: 'Venue Latitude', type: 'number' }),
    defineField({ name: 'venueLng', title: 'Venue Longitude', type: 'number' }),
  ],
})
