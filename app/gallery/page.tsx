/* BASSMENT — Gallery */
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getGallery } from "@/lib/sanity/fetch";
import type { SanityGalleryImage } from "@/lib/sanity/types";

export const revalidate = 3600

function imageUrl(img: SanityGalleryImage): string {
  const i = img.image as unknown as { asset?: { url?: string } } | undefined
  return i?.asset?.url || '/images/placeholder.png'
}

export default async function Gallery() {
  const images = await getGallery()
  const items = images || []

  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="pt-200 md:pt-280 pb-20 md:pb-120 px-6 md:px-20 flex flex-col items-center gap-12 md:gap-16">
        <div className="flex flex-col gap-10 md:gap-12 w-full max-w-7xl">
          <div className="flex justify-between items-end">
            <h1 className="text-h1 text-bass-white">GALLERY</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.length > 0 ? (
              items.map((item, i) => (
                <div key={item._id} className={`relative rounded-lg overflow-hidden ${item.size === 'tall' ? 'h-[500px]' : 'h-300'}`}>
                  <Image src={imageUrl(item)} alt={`Gallery ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              ))
            ) : (
              <p className="text-body text-bass-grey-med py-12 col-span-full text-center">
                No images yet.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
