'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { resendTickets } from '@/app/actions/resend-ticket'
import { toast } from 'sonner'

const schema = z.object({
  email: z.email('Please enter a valid email address.'),
  botField: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const GENERIC_SUCCESS =
  "If we have tickets for that email, they're on their way. Check your spam folder too."

export function ResendTicketForm() {
  const [pending, setPending] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', botField: '' },
  })

  async function onSubmit(values: FormValues) {
    setPending(true)
    try {
      const result = await resendTickets(values)
      if (result.success) {
        toast.success(GENERIC_SUCCESS)
        form.reset()
      } else {
        toast.error(result.error || 'Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setPending(false)
    }
  }

  const { errors } = form.formState

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 w-full">
      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...form.register('botField')} />
      <FormField name="email" error={errors.email?.message}>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="h-52 px-4 rounded-lg bg-bass-dark border border-bass-grey-med text-nav placeholder:text-bass-grey-med focus-visible:border-primary focus-visible:ring-0"
          {...form.register('email')}
        />
        <FormMessage />
      </FormField>

      <button
        type="submit"
        disabled={pending}
        className="h-14 rounded-md bg-primary text-btn text-bass-white hover:bg-primary/80 transition-colors disabled:opacity-50"
      >
        {pending ? 'SENDING...' : 'RESEND MY TICKET'}
      </button>
    </Form>
  )
}
