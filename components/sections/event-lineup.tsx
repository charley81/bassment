/* BASSMENT — Event Lineup Section */
import { eventDetailData } from "@/lib/data";

export function EventLineup() {
  return (
    <div className="flex flex-col gap-10 md:gap-12 pt-16 md:pt-20">
      <h2 className="text-label-center text-bass-white">LINEUP</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {eventDetailData.lineup.map((a) => (
          <div key={a.name} className="flex flex-col items-center gap-1">
            <span className="text-artist-name text-bass-grey-light">
              {a.name}
            </span>
            <span className="text-nav text-bass-grey-med">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
