/* BASSMENT — Gallery (v1-latest) */
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { galleryImages } from "@/lib/data";

export default function Gallery() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="pt-[200px] md:pt-[280px] pb-20 md:pb-[120px] px-6 md:px-20 flex flex-col items-center gap-12 md:gap-16">
        <div className="flex flex-col gap-10 md:gap-12 w-full max-w-[1280px]">
          <div className="flex justify-between items-end">
            <h1 className="text-h1 text-bass-white">GALLERY</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {galleryImages.map((img, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden" style={{ height: i === 0 || i === 9 || i === 10 ? "500px" : "300px" }}>
                <Image src={img.src} alt={`Gallery ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
