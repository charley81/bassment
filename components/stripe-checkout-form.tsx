'use client'

import { useState, type FormEvent } from 'react'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { StripeElementsOptions } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export interface PaymentResult {
  id: string
  status: string
}

function CheckoutForm({ onSuccess }: { onSuccess: (result: PaymentResult) => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + window.location.pathname.replace('/buy', '/confirmation'),
      },
      redirect: 'if_required',
    })

    if (submitError) {
      setError(submitError.message || 'Payment failed')
      setLoading(false)
    } else if (paymentIntent) {
      onSuccess({ id: paymentIntent.id, status: paymentIntent.status })
    } else {
      setError('Payment could not be confirmed')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement />
      {error && <p className="text-sm text-primary">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="h-14 rounded-none bg-primary text-btn text-bass-white hover:bg-primary/80 transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing…' : 'Pay'}
      </button>
    </form>
  )
}

interface Props {
  clientSecret: string
  onSuccess: (result: PaymentResult) => void
}

const elementsOptions = (clientSecret: string): StripeElementsOptions => ({
  clientSecret,
  appearance: { theme: 'night' },
  // @ts-expect-error — `fields` is supported by Stripe.js at runtime but
  // missing from the installed @stripe/stripe-js typings
  fields: { billingDetails: { email: 'auto' } },
})

export function StripeCheckoutForm({ clientSecret, onSuccess }: Props) {
  return (
    <Elements stripe={stripePromise} options={elementsOptions(clientSecret)}>
      <CheckoutForm onSuccess={onSuccess} />
    </Elements>
  )
}
