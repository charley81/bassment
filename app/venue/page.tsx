/* BASSMENT — Venue (v1-latest) */
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  venueHeroData,
  venueHistoryData,
  venuePhotos,
  venueStats,
  venuePlanData,
} from '@/lib/data'

export default function Venue() {
  return (
    <div className="flex flex-col min-h-full bg-bass-black">
      <Header />

      <section className="relative h-[600px] md:h-[900px] w-full overflow-hidden">
        <Image
          src={venueHeroData.image}
          alt=""
          fill
          className="object-cover img-greyscale"
        />
        <div className="absolute inset-0 bg-(--color-primary)/10 z-[1]" />
        <div className="absolute left-6 md:left-20 bottom-20 md:bottom-[213px] flex flex-col gap-4 max-w-[800px] z-[2]">
          <h1 className="text-h6 text-bass-white">{venueHeroData.headline}</h1>
          <p className="text-body-large text-bass-white">
            {venueHeroData.subtitle}
          </p>
        </div>
      </section>

      <section className="py-20 md:py-[120px] flex flex-col items-center gap-12 md:gap-16 px-6">
        <div className="flex flex-col gap-6 md:gap-8 max-w-[720px]">
          <h2 className="text-label-center text-bass-white">
            {venueHistoryData.label}
          </h2>
          {venueHistoryData.paragraphs.slice(0, 2).map((p, i) => (
            <p key={i} className="text-body text-bass-grey-med">
              {p}
            </p>
          ))}
          <blockquote className="border-l-2 border-bass-grey-light pl-6 py-0">
            <p className="text-body-sm text-bass-text">
              {venueHistoryData.pullQuote}
            </p>
          </blockquote>
          {venueHistoryData.paragraphs.slice(2).map((p, i) => (
            <p key={i + 2} className="text-body text-bass-grey-med">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Photo Grid — fixed with proper containers */}
      <section className="py-20 md:py-[120px] px-6 md:px-20 flex flex-col items-center gap-8">
        <h2 className="text-label-center text-bass-white">THE SPACE TODAY</h2>
        <div className="flex flex-col gap-4 max-w-[1280px] w-full">
          {[
            [venuePhotos[0], venuePhotos[1], venuePhotos[2]],
            [venuePhotos[3], venuePhotos[4], venuePhotos[5]],
          ].map((row, ri) => (
            <div
              key={ri}
              className="flex flex-col md:flex-row gap-4 h-auto md:h-[420px]"
            >
              {row.map((src, i) => (
                <div
                  key={i}
                  className="relative w-full h-[250px] md:h-full md:flex-1 rounded-lg overflow-hidden"
                >
                  <Image
                    src={src}
                    alt={`Venue photo ${ri * 3 + i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20 flex justify-center px-6">
        <div className="grid grid-cols-2 md:flex md:justify-between gap-8 w-full max-w-[1000px]">
          {venueStats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-3">
              <span className="text-stat text-bass-text">{s.value}</span>
              <span className="text-label-medium text-bass-muted">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-[120px] flex flex-col items-center px-6">
        <div className="p-6 md:p-8 flex flex-col gap-6 md:gap-8 max-w-[800px] w-full bg-bass-grey-dark border border-bass-grey-med rounded-lg">
          <h3 className="text-stat text-bass-white">{venuePlanData.title}</h3>
          <div className="flex flex-col gap-4">
            {venuePlanData.items.map((l, i) => (
              <p key={i} className="text-body text-bass-grey-light">
                {l}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-[120px] px-6 md:px-20 flex justify-center">
        <div className="relative w-full max-w-[1440px] h-[250px] md:h-[420px] rounded-lg overflow-hidden border border-bass-border flex items-center justify-center">
          <Image
            src={venuePlanData.mapImage}
            alt="Map"
            fill
            className="object-cover"
          />
          <span className="relative z-10 text-nav text-bass-muted">
            {venuePlanData.mapLabel}
          </span>
        </div>
      </section>

      <section className="h-[150px] md:h-[216px] flex items-center justify-center">
        <Link
          href="/events"
          className="inline-flex h-14 px-10 items-center justify-center rounded-lg bg-(--color-primary) text-btn text-bass-white hover:bg-(--color-primary)/80 transition-colors"
        >
          {venuePlanData.cta}
        </Link>
      </section>

      <Footer />
    </div>
  )
}
