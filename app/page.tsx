/* BASSMENT — Home (v1-latest) */
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import { heroData, featuredEvent, upcomingEvents, venueHomeData, residentDjs, newsletterData } from "@/lib/data";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />

      {/* HERO */}
      <section className="relative h-[600px] md:h-[900px] w-full overflow-hidden">
        <Image src={heroData.image} alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[var(--color-primary)]/10 z-[1]" />
        <div className="relative z-[2] pt-[200px] md:pt-[280px] px-6 md:px-20 flex flex-col gap-4 md:gap-8 max-w-[1343px]">
          <div className="flex flex-col gap-1 md:gap-2">
            <p className="text-label-medium text-bass-grey-light">{heroData.eyebrow}</p>
            <h1 className="text-hero text-bass-white">{heroData.headline}</h1>
          </div>
          <div className="flex flex-col gap-6 md:gap-8">
            <p className="text-body-sm text-bass-grey-light max-w-[676px]">{heroData.description}</p>
            <Link href="/events" className="inline-flex h-14 px-10 items-center justify-center rounded-lg bg-bass-white text-btn text-bass-dark hover:bg-bass-grey-light transition-colors w-fit">{heroData.cta}</Link>
          </div>
        </div>
      </section>

      {/* FEATURED EVENT */}
      <section className="py-20 md:py-[160px] px-6 md:px-20">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
          <h2 className="text-section-heading text-bass-white">Next event</h2>
          <div className="flex flex-col md:flex-row rounded overflow-hidden">
            <div className="w-full md:w-[768px] h-[400px] md:h-[1028px] relative shrink-0">
              <Image src={featuredEvent.image} alt={featuredEvent.title} fill className="object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center gap-6 md:gap-8 p-6 md:p-12">
              <div className="flex flex-col gap-6 md:gap-8">
                <div className="flex flex-col gap-1 md:gap-2">
                  <p className="text-nav text-bass-grey-light">{featuredEvent.date}</p>
                  <h3 className="text-subtitle text-bass-white">{featuredEvent.title}</h3>
                </div>
                <p className="text-nav text-[var(--color-primary)]">{featuredEvent.support}</p>
                <p className="text-body text-bass-grey-light">{featuredEvent.description}</p>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <Link href="/events/dillinja-valve" className="inline-flex h-14 px-6 items-center justify-center rounded-lg bg-[var(--color-primary)] text-btn text-bass-white hover:bg-[var(--color-primary)]/80 transition-colors">{featuredEvent.cta}</Link>
                <span className="inline-flex h-8 px-3 items-center rounded-full bg-bass-grey-dark border border-bass-grey-light text-label text-bass-grey-light">{featuredEvent.badge}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING */}
      <section className="py-20 md:py-[120px] px-6 md:px-20">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-12 md:gap-16">
          <div className="flex justify-between items-end">
            <h2 className="text-section-title text-bass-white">UPCOMING</h2>
            <Link href="/events" className="text-link text-[var(--color-primary)] hover:text-bass-white transition-colors">View All Events →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {upcomingEvents.map((e) => (
              <Link key={e.id} href={`/events/${e.id}`} className="relative flex flex-col h-[300px] md:h-[380px] rounded overflow-hidden group">
                <Image src={e.image} alt={e.title} fill className="object-cover" />
                <div className="absolute bottom-0 left-0 right-0 h-[180px] z-[1]" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-5 pb-5 flex flex-col gap-1.5 z-[2]">
                  <span className="text-heading text-bass-white leading-tight">{e.title}</span>
                  <div className="flex justify-between">
                    <span className="text-nav text-bass-grey-light">{e.date}</span>
                    <span className="text-nav text-bass-grey-light">{e.support}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VENUE */}
      <section className="py-20 md:py-[140px] px-6 md:px-20">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-[616px] h-[400px] md:h-[721px] relative shrink-0 rounded-lg overflow-hidden">
            <Image src={venueHomeData.image} alt="Venue" fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col gap-1 md:gap-2">
              <p className="text-eyebrow text-[var(--color-primary)]">{venueHomeData.eyebrow}</p>
              <h3 className="text-subtitle text-bass-white">{venueHomeData.title}</h3>
            </div>
            <p className="text-body text-bass-grey-light">{venueHomeData.description}</p>
            <Link href="/venue" className="inline-flex h-12 px-5 items-center justify-center rounded-lg bg-[var(--color-primary)] text-btn-ghost text-bass-text hover:bg-[var(--color-primary)]/80 transition-colors w-fit">{venueHomeData.cta}</Link>
          </div>
        </div>
      </section>

      {/* RESIDENT DJ CAROUSEL */}
      <section className="py-20 md:py-[120px] px-6 md:px-20 flex flex-col items-center gap-4">
        <p className="text-label-medium text-[var(--color-primary)]">RESIDENT</p>
        <Carousel className="w-full max-w-[520px]" opts={{ loop: true }}>
          <CarouselContent>
            {residentDjs.map((dj) => (
              <CarouselItem key={dj.name} className="flex flex-col items-center gap-8">
                <div className="w-[180px] h-[180px] md:w-[240px] md:h-[240px] relative rounded-full overflow-hidden">
                  <Image src={dj.image} alt={dj.name} fill className="object-cover" />
                </div>
                <h3 className="text-subtitle-center text-bass-white">{dj.name}</h3>
                <p className="text-body text-center text-bass-grey-light">{dj.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {dj.tags.map((t) => (
                    <span key={t} className="inline-flex h-8 px-3 items-center rounded-lg border border-bass-grey-light bg-bass-grey-dark text-nav text-bass-grey-light">{t}</span>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-3 mt-6">
            <CarouselPrevious className="static w-10 h-10 rounded-full border border-bass-border text-arrow text-bass-text hover:border-[var(--color-primary)] translate-y-0" />
            <CarouselNext className="static w-10 h-10 rounded-full border border-bass-border text-arrow text-bass-text hover:border-[var(--color-primary)] translate-y-0" />
          </div>
        </Carousel>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 md:py-[120px] flex flex-col items-center bg-bass-grey-dark px-6">
        <div className="flex flex-col items-center gap-6 md:gap-8 max-w-[520px]">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-subtitle-center text-bass-white">{newsletterData.title}</h3>
            <p className="text-center text-bass-grey-light">{newsletterData.description}</p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}
