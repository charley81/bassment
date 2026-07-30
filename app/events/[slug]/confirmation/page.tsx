import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ConfirmationPage({ params }: Props) {
  const { slug } = await params

  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />
      <main className="pt-200 md:pt-280 pb-20 md:pb-120 px-6 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-8 max-w-480 text-center">
          <div className="flex flex-col gap-4">
            <h1 className="text-h2 text-bass-white">You&apos;re In.</h1>
            <p className="text-body text-bass-grey-light">
              Your ticket has been purchased. Check your email for confirmation.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href={`/events/${slug}`}
              className="inline-flex h-14 items-center justify-center rounded-none px-8 bg-bass-grey-dark border border-bass-grey-med text-btn text-bass-white hover:border-primary transition-colors"
            >
              Back to Event
            </Link>
            <Link
              href="/events"
              className="inline-flex h-14 items-center justify-center rounded-none px-8 bg-primary text-btn text-bass-white hover:bg-primary/80 transition-colors"
            >
              More Events
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
