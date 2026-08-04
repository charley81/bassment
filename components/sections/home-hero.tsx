/* BASSMENT — Home Hero Section */
import Image from 'next/image'
import Link from 'next/link'
import { heroData } from '@/lib/data'

export function HomeHero() {
  return (
    <section className="relative h-600 md:h-900 w-full overflow-hidden bg-bass-dark">
      <Image
        src={heroData.image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover grayscale"
        priority
      />
      <div className="absolute inset-0 bg-primary/10 z-1" />
      <div className="relative z-2 pt-200 md:pt-280 px-6 md:px-20 flex flex-col gap-4 md:gap-8 max-w-[1343px]">
        <div className="flex flex-col gap-1 md:gap-2">
          <p className="text-label-medium text-bass-grey-light">
            {heroData.eyebrow}
          </p>
          <h1 className="text-hero text-bass-white [word-spacing:-1px]">
            {heroData.headline}
          </h1>
        </div>
        <div className="flex flex-col gap-6 md:gap-8">
          <p className="text-body-sm text-bass-grey-light max-w-[676px]">
            {heroData.description}
          </p>
          <Link
            href="/events"
            className="inline-flex h-14 items-center justify-center rounded-lg px-10 bg-bass-white text-btn text-bass-dark! w-fit transition-colors hover:bg-bass-grey-light!"
          >
            {heroData.cta}
          </Link>
        </div>
      </div>
    </section>
  )
}
