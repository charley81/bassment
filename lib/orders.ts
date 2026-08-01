/* Order reference helpers. The ref is DERIVED from the Stripe PaymentIntent
   ID (not stored-only), so the webhook, confirmation page, and ticket email
   all produce the identical reference from the same ID — and support can
   match a ref back to a Stripe payment by sight. */

/** "BSMT-X7K2PQ" — deterministic per PaymentIntent */
export function orderRefFor(paymentIntentId: string): string {
  const suffix = paymentIntentId.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()
  return `BSMT-${suffix}`
}
