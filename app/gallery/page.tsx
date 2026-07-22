/* BASSMENT — Gallery Page (v1-latest, node #368:779) */
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const gallery = [
  { src: "/images/gallery-01.png", tall: true },
  { src: "/images/gallery-02.png", tall: false },
  { src: "/images/gallery-03.png", tall: false },
  { src: "/images/gallery-04.png", tall: false },
  { src: "/images/gallery-05.png", tall: false },
  { src: "/images/gallery-06.png", tall: false },
  { src: "/images/gallery-07.png", tall: false },
  { src: "/images/gallery-08.png", tall: false },
  { src: "/images/gallery-09.png", tall: false },
  { src: "/images/gallery-10.png", tall: true },
  { src: "/images/gallery-11.png", tall: true },
  { src: "/images/gallery-12.png", tall: false },
  { src: "/images/gallery-13.png", tall: false },
  { src: "/images/gallery-14.png", tall: false },
  { src: "/images/gallery-15.png", tall: false },
];

export default function Gallery() {
  return (
    <div className="flex flex-col min-h-full bg-[#090102]">
      <Header />
      <main className="pt-[280px] pb-[120px] px-20 flex flex-col items-center gap-16">
        <div className="flex flex-col gap-12 w-[1280px]">
          {/* Header row */}
          <div className="flex justify-between items-end">
            <h1 className="text-[72px] font-extrabold text-white">GALLERY</h1>
            <button className="h-10 px-4 flex items-center rounded-lg bg-[var(--color-bass-grey-dark)] border border-[var(--color-bass-grey-light)] text-base text-[var(--color-bass-grey-light)]">Filter by Event ▾</button>
          </div>

          {/* Masonry grid */}
          <div className="flex flex-col gap-4">
            {/* Row 1: tall left, 4 small right */}
            <div className="flex gap-4 h-[623px]">
              <div className="relative w-[416px] rounded-lg overflow-hidden shrink-0">
                <Image src={gallery[0].src} alt="" fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex gap-4 flex-1">
                  {[1, 2].map((i) => (
                    <div key={i} className="relative flex-1 rounded-lg overflow-hidden">
                      <Image src={gallery[i].src} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 flex-1">
                  {[3, 4].map((i) => (
                    <div key={i} className="relative flex-1 rounded-lg overflow-hidden">
                      <Image src={gallery[i].src} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: 4 small left, tall right */}
            <div className="flex gap-4 h-[623px]">
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex gap-4" style={{ height: "293px" }}>
                  {[5, 6].map((i) => (
                    <div key={i} className="relative flex-1 rounded-lg overflow-hidden">
                      <Image src={gallery[i].src} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4" style={{ height: "234px" }}>
                  {[7, 8].map((i) => (
                    <div key={i} className="relative flex-1 rounded-lg overflow-hidden">
                      <Image src={gallery[i].src} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative w-[416px] rounded-lg overflow-hidden shrink-0">
                <Image src={gallery[9].src} alt="" fill className="object-cover" />
              </div>
            </div>

            {/* Row 3: tall left, 4 small right */}
            <div className="flex gap-4 h-[623px]">
              <div className="relative w-[416px] rounded-lg overflow-hidden shrink-0">
                <Image src={gallery[10].src} alt="" fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex gap-4" style={{ height: "278px" }}>
                  {[11, 12].map((i) => (
                    <div key={i} className="relative flex-1 rounded-lg overflow-hidden">
                      <Image src={gallery[i].src} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4" style={{ height: "277px" }}>
                  {[13, 14].map((i) => (
                    <div key={i} className="relative flex-1 rounded-lg overflow-hidden">
                      <Image src={gallery[i].src} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
