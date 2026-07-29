/* BASSMENT — Venue Stats Section */
import { venueStats } from "@/lib/data";

export function VenueStats() {
  return (
    <section className="py-16 md:py-20 flex justify-center px-6">
      <div className="grid grid-cols-2 md:flex md:justify-between gap-8 w-full max-w-1000">
        {venueStats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-3">
            <span className="text-stat text-bass-text">{s.value}</span>
            <span className="text-label-medium text-bass-muted">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
