/* BASSMENT — Venue Plan Your Visit Section */
import { venuePlanData } from "@/lib/data";

export function VenuePlan() {
  return (
    <section className="py-20 md:py-120 flex flex-col items-center px-6">
      <div className="p-6 md:p-8 flex flex-col gap-6 md:gap-8 max-w-800 w-full bg-bass-grey-dark border border-bass-grey-med rounded-lg">
        <h3 className="text-stat text-bass-white">{venuePlanData.title}</h3>
        <div className="flex flex-col gap-4">
          {venuePlanData.items.map((l, i) => (
            <p key={i} className="text-body text-bass-grey-light">
              {l}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
