/* BASSMENT — Event Description Section */
import { eventDetailData } from "@/lib/data";

export function EventDescription() {
  return (
    <div className="flex flex-col gap-6 pt-16 md:pt-20 max-w-[800px] mx-auto">
      {eventDetailData.description.map((p, i) => (
        <p key={i} className="text-body text-bass-grey-med">
          {p}
        </p>
      ))}
    </div>
  );
}
