/* BASSMENT — Venue History Section */
import { venueHistoryData } from "@/lib/data";

export function VenueHistory() {
  return (
    <section className="py-20 md:py-120 flex flex-col items-center gap-12 md:gap-16 px-6">
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
  );
}
