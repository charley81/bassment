/* BASSMENT — Resident DJ Carousel Section */
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { residentDjs } from "@/lib/data";

export function ResidentDjs() {
  return (
    <section className="py-20 md:py-[120px] px-6 md:px-20 flex flex-col items-center gap-4">
      <p className="text-label-medium text-(--color-primary)">RESIDENT</p>
      <Carousel className="w-full max-w-[520px]" opts={{ loop: true }}>
        <CarouselContent>
          {residentDjs.map((dj) => (
            <CarouselItem
              key={dj.name}
              className="flex flex-col items-center gap-8"
            >
              <div className="w-[180px] h-[180px] md:w-[240px] md:h-[240px] relative rounded-full overflow-hidden">
                <Image
                  src={dj.image}
                  alt={dj.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-subtitle-center text-bass-white">
                {dj.name}
              </h3>
              <p className="text-body text-center text-bass-grey-light">
                {dj.description}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {dj.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex h-8 px-3 items-center rounded-lg border border-bass-grey-light bg-bass-grey-dark text-nav text-bass-grey-light"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-3 mt-6">
          <CarouselPrevious className="static w-10 h-10 rounded-full border border-bass-border text-arrow text-bass-text hover:border-(--color-primary) translate-y-0" />
          <CarouselNext className="static w-10 h-10 rounded-full border border-bass-border text-arrow text-bass-text hover:border-(--color-primary) translate-y-0" />
        </div>
      </Carousel>
    </section>
  );
}
