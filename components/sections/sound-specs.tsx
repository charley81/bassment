/* BASSMENT — Sound System Specs Section */
import { soundSpecs } from "@/lib/data";

export function SoundSpecs() {
  return (
    <section className="py-20 md:py-120 px-6 md:px-20 flex flex-col items-center gap-16 md:gap-20">
      <p className="text-label text-bass-white">THE SPECS</p>
      <div className="flex flex-col md:flex-row gap-10 md:gap-20 max-w-900 w-full">
        {[0, 2].map((start) => (
          <div
            key={start}
            className="flex justify-center gap-10 md:gap-20 flex-1"
          >
            {soundSpecs.slice(start, start + 2).map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-3 flex-1"
              >
                <span className="text-h6 text-bass-grey-light">
                  {s.value}
                </span>
                <span className="text-label-medium text-bass-grey-med">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
