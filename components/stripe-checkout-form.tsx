'use client'

import { useState, useMemo, type FormEvent } from 'react'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export interface PaymentResult {
  id: string
  status: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface CheckoutFormProps {
  clientSecret: string
  price: string
  onSuccess: (result: PaymentResult) => void
}

function CheckoutForm({ clientSecret, price, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  // Email committed on blur feeds the Payment Element's billing prefill and
  // lets Stripe Link recognize returning buyers (verified saved emails).
  // Committed on blur only: changing PaymentElement options REMOUNTS the
  // element, so per-keystroke updates would drop card-field focus.
  const [prefillEmail, setPrefillEmail] = useState('')

  function commitEmailPrefill() {
    const trimmed = email.trim()
    if (EMAIL_RE.test(trimmed) && trimmed !== prefillEmail) {
      setPrefillEmail(trimmed)
    }
  }

  const paymentOptions = useMemo<StripePaymentElementOptions>(
    () => ({ defaultValues: { billingDetails: { email: prefillEmail || undefined } } }),
    [prefillEmail]
  )

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    const trimmedEmail = email.trim()
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError('Enter a valid email so we can send your ticket.')
      return
    }

    setLoading(true)
    setError('')

    // Attach the email to the PaymentIntent BEFORE confirming — the webhook
    // sends the ticket to metadata.customerEmail once payment succeeds.
    try {
      const res = await fetch('/api/payment/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientSecret, email: trimmedEmail }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setError('Could not save your email — please try again.')
      setLoading(false)
      return
    }

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
      <div className="flex flex-col gap-2">
        <label htmlFor="checkout-email" className="text-label-medium text-bass-grey-light">
          Where should we send your ticket?
        </label>
        <input
          id="checkout-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={commitEmailPrefill}
          placeholder="your@email.com"
          className="h-14 px-5 rounded-lg bg-bass-dark border border-bass-border text-nav text-bass-grey-med placeholder:text-bass-grey-med focus-visible:border-primary focus-visible:ring-0"
        />
      </div>

      <PaymentElement options={paymentOptions} />

      {error && <p className="text-sm text-primary">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="h-14 rounded-none bg-primary text-btn text-bass-white hover:bg-primary/80 transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing…' : `Pay ${price}`}
      </button>
    </form>
  )
}

interface Props {
  clientSecret: string
  price: string
  onSuccess: (result: PaymentResult) => void
}

const elementsOptions = (clientSecret: string): StripeElementsOptions => ({
  clientSecret,
  appearance: { theme: 'night' },
})

export function StripeCheckoutForm({ clientSecret, price, onSuccess }: Props) {
  return (
    <Elements stripe={stripePromise} options={elementsOptions(clientSecret)}>
      <CheckoutForm clientSecret={clientSecret} price={price} onSuccess={onSuccess} />
    </Elements>
  )
}
