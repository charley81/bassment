'use client'

import { useState, type FormEvent } from 'react'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const inputClass =
  'h-14 px-4 rounded-lg bg-bass-dark border border-bass-border text-nav text-bass-text placeholder:text-bass-grey-med focus-visible:border-primary focus-visible:ring-0 w-full'

function CardForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement)!,
      },
    })

    if (confirmError) {
      setError(confirmError.message || 'Payment failed')
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase text-bass-grey-med">Card Number</label>
          <CardNumberElement className={inputClass} />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-bold uppercase text-bass-grey-med">Expiry</label>
            <CardExpiryElement className={inputClass} />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-bold uppercase text-bass-grey-med">CVC</label>
            <CardCvcElement className={inputClass} />
          </div>
        </div>
      </div>

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
  onSuccess: () => void
}

export function StripeCheckoutForm({ clientSecret, onSuccess }: Props) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
      <CardForm clientSecret={clientSecret} onSuccess={onSuccess} />
    </Elements>
  )
}
