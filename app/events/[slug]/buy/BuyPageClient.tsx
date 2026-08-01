'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StripeCheckoutForm } from '@/components/stripe-checkout-form'

interface Props {
  eventSlug: string
  eventTitle: string
  ticketPrice: number
}

export function BuyPageClient({ eventSlug, eventTitle, ticketPrice }: Props) {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventSlug }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setClientSecret(data.clientSecret)
      })
      .catch(() => setError('Failed to initialize payment'))
  }, [eventSlug])

  const price = `$${(ticketPrice / 100).toFixed(2)}`

  return (
    <div className="flex flex-col gap-8 max-w-480 w-full mx-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-h3 text-bass-white">Purchase Tickets</h1>
        <p className="text-body text-bass-grey-light">{eventTitle}</p>
        <div className="flex justify-between items-center py-4 border-b border-bass-border">
          <span className="text-nav text-bass-grey-med">General Admission</span>
          <span className="text-btn text-bass-white">{price}</span>
        </div>
      </div>

      {error ? (
        <p className="text-body text-primary text-center">{error}</p>
      ) : clientSecret ? (
        <StripeCheckoutForm
          clientSecret={clientSecret}
          price={price}
          onSuccess={(result) =>
            router.push(
              `/events/${eventSlug}/confirmation?payment_intent=${result.id}&redirect_status=${result.status}`
            )
          }
        />
      ) : (
        <p className="text-body text-bass-grey-med text-center">Loading…</p>
      )}
    </div>
  )
}
