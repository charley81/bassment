import { notFound, redirect } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BuyPageClient } from './BuyPageClient'
import { getEventBySlug } from '@/lib/sanity/fetch'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BuyPage({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event || !event.ticketPrice) notFound()

  // Only allow purchase flow for on-sale events (matches /api/payment)
  if (event.ticketStatus !== 'onSale' && event.ticketStatus !== 'lowTickets') {
    redirect(`/events/${slug}`)
  }

  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />
      <main className="pt-200 md:pt-280 pb-20 md:pb-120 px-2 lg:px-20 flex flex-col items-center">
        <BuyPageClient
          eventSlug={slug}
          eventTitle={event.title}
          ticketPrice={event.ticketPrice}
        />
      </main>
      <Footer />
    </div>
  )
}
