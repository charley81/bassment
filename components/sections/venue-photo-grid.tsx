/* BASSMENT — Venue Photo Grid Section */
import Image from "next/image";
import { venuePhotos } from "@/lib/data";

const rows: [string, string, string][] = [
  [venuePhotos[0], venuePhotos[1], venuePhotos[2]],
  [venuePhotos[3], venuePhotos[4], venuePhotos[5]],
];

export function VenuePhotoGrid() {
  return (
    <section className="py-20 md:py-120 px-6 md:px-20 flex flex-col items-center gap-8">
      <h2 className="text-label-center text-bass-white">THE SPACE TODAY</h2>
      <div className="flex flex-col gap-4 max-w-7xl w-full">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="flex flex-col md:flex-row gap-4 h-auto md:h-420"
          >
            {row.map((src, i) => (
              <div
                key={i}
                className="relative w-full h-250 md:h-full md:flex-1 rounded-lg overflow-hidden"
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
  );
}
