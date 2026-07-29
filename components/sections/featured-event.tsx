/* BASSMENT — Featured Event Section */
import Image from "next/image";
import Link from "next/link";
import { featuredEvent } from "@/lib/data";

export function FeaturedEvent() {
  return (
    <section className="py-20 md:py-[160px] px-6 md:px-20">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
        <h2 className="text-section-heading text-bass-white">Next event</h2>
        <div className="flex flex-col md:flex-row rounded overflow-hidden">
          <div className="w-full md:w-[768px] h-[400px] md:h-[1028px] relative shrink-0">
            <Image
              src={featuredEvent.image}
              alt={featuredEvent.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center gap-6 md:gap-8 p-6 md:p-12">
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex flex-col gap-1 md:gap-2">
                <p className="text-nav text-bass-grey-light">
                  {featuredEvent.date}
                </p>
                <h3 className="text-subtitle text-bass-white">
                  {featuredEvent.title}
                </h3>
              </div>
              <p className="text-nav text-(--color-primary)">
                {featuredEvent.support}
              </p>
              <p className="text-body text-bass-grey-light">
                {featuredEvent.description}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/events" className="btn-cta px-6">
                {featuredEvent.cta}
              </Link>
              <span className="inline-flex h-8 px-3 items-center rounded-full bg-bass-grey-dark border border-bass-grey-light text-label text-bass-grey-light">
                {featuredEvent.badge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
