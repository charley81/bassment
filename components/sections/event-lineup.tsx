/* BASSMENT — Event Lineup Section */
import type { SanityArtist } from "@/lib/sanity/types";

interface Props {
  lineup?: SanityArtist[];
}

export function EventLineup({ lineup }: Props) {
  if (!lineup || lineup.length === 0) return null;

  return (
    <div className="flex flex-col gap-10 md:gap-12 pt-16 md:pt-20">
      <h2 className="text-label-center text-bass-white">LINEUP</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {lineup.map((a) => (
          <div key={a._id} className="flex flex-col items-center gap-1">
            <span className="text-artist-name text-bass-grey-light">
              {a.name}
            </span>
            <span className="text-nav text-bass-grey-med">
              {a.tags?.[0] || (a.role === 'resident' ? 'Resident' : 'Guest')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
