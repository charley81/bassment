/* BASSMENT — Sound System History Section */
import Image from "next/image";
import { soundHistoryData } from "@/lib/data";

export function SoundHistory() {
  return (
    <section className="py-20 md:py-[160px] px-6 md:px-20 flex flex-col md:flex-row justify-center gap-8 md:gap-12 max-w-1440 mx-auto">
      <div className="flex flex-col gap-6 md:gap-8 flex-1">
        <p className="text-label text-bass-white">{soundHistoryData.label}</p>
        <h2 className="text-subtitle text-bass-grey-light">
          {soundHistoryData.title}
        </h2>
        <div className="flex flex-col gap-4">
          {soundHistoryData.paragraphs.map((p, i) => (
            <p key={i} className="text-body text-bass-grey-med">
              {p}
            </p>
          ))}
        </div>
      </div>
      <div className="w-full md:w-lg h-[300px] md:h-[342px] relative shrink-0">
        <Image
          src={soundHistoryData.image}
          alt=""
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}
