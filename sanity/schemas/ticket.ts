import { defineType, defineField } from 'sanity'

/* One document per successful purchase. The _id IS the Stripe PaymentIntent
   ID (set by the webhook) — that deterministic key is what makes webhook
   retries and duplicate endpoints safe. spec: docs/ticket-orders/spec.md */
export const ticket = defineType({
  name: 'ticket',
  title: 'Ticket',
  type: 'document',
  fields: [
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
      weak: true, // survives the event being deleted
    }),
    defineField({ name: 'eventSlug', title: 'Event Slug', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'eventTitle', title: 'Event Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'email',
      title: 'Buyer Email',
      type: 'string',
      description: 'Editable — fix typos here when a buyer contacts support.',
      validation: (r) => r.required().email(),
    }),
    defineField({ name: 'amount', title: 'Amount (cents)', type: 'number', validation: (r) => r.required() }),
    defineField({ name: 'currency', title: 'Currency', type: 'string', initialValue: 'usd' }),
    defineField({ name: 'orderRef', title: 'Order Reference', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['paid', 'refunded'] },
      initialValue: 'paid',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'purchasedAt', title: 'Purchased At', type: 'datetime', validation: (r) => r.required() }),
    defineField({
      name: 'emailSentAt',
      title: 'Ticket Email Sent At',
      type: 'datetime',
      description: 'Empty = the order exists but the ticket email has not gone out yet.',
      readOnly: true,
    }),
    defineField({
      name: 'lastResentAt',
      title: 'Last Resent At',
      type: 'datetime',
      description: 'Set by the self-serve resend flow; also its durable throttle.',
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: 'orderRef', subtitle: 'email', event: 'eventTitle' },
    prepare: ({ title, subtitle, event }) => ({
      title: `${title} — ${event}`,
      subtitle,
    }),
  },
  orderings: [
    {
      title: 'Newest first',
      name: 'purchasedAtDesc',
      by: [{ field: 'purchasedAt', direction: 'desc' }],
    },
  ],
})
