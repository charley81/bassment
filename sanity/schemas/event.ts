import { defineType, defineField } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'date', title: 'Event Date', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'doorsOpen', title: 'Doors Open', type: 'datetime' }),
    defineField({ name: 'supportText', title: 'Support Text', type: 'string', description: 'e.g. "with Lemon D, Goldie, and DJ Storm"' }),
    defineField({ name: 'lineup', title: 'Lineup', type: 'array', of: [{ type: 'reference', to: [{ type: 'artist' }] }] }),
    defineField({ name: 'description', title: 'Description', type: 'blockContent' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'altText', title: 'Alt Text', type: 'string' }),
    defineField({ name: 'ticketUrl', title: 'Ticket URL', type: 'url' }),
    defineField({ name: 'ticketPrice', title: 'Ticket Price (cents)', type: 'number', description: 'e.g. 2500 = $25.00, 5000 = $50.00' }),
    defineField({ name: 'ticketStatus', title: 'Ticket Status', type: 'string', options: { list: ['onSale', 'lowTickets', 'soldOut', 'atDoor', 'past'] }, initialValue: 'onSale', validation: (r) => r.required() }),
    defineField({ name: 'capacity', title: 'Capacity', type: 'number', description: 'Max tickets to sell. Leave empty for unlimited. When reached, the event flips itself to soldOut.', validation: (r) => r.min(1) }),
    defineField({ name: 'ticketsSold', title: 'Tickets Sold', type: 'number', description: 'Counter maintained automatically by the purchase webhook. For a refund: set the ticket status to refunded AND decrement this by hand.', initialValue: 0, readOnly: true }),
    defineField({ name: 'featured', title: 'Featured Event', type: 'boolean', initialValue: false }),
    defineField({ name: 'badge', title: 'Badge', type: 'string', description: 'e.g. "ON SALE NOW", "LOW TICKETS"' }),
  ],
  preview: { select: { title: 'title', subtitle: 'date', media: 'image' } },
})
