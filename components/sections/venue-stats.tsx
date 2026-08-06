/* BASSMENT — Venue Stats Section */
import { CountUp } from '@/components/animations/count-up'

interface Props {
  stats?: { value: string; label: string }[] | null;
}

function isNumeric(v: string): boolean {
  return /^\d+$/.test(v)
}

export function VenueStats({ stats }: Props) {
  const items = stats || [];

  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-20 flex justify-center px-2 lg:px-20">
      <div className="grid grid-cols-2 md:flex md:justify-between gap-8 w-full max-w-[1000px]">
        {items.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-3">
            <span className="text-stat text-bass-text">
              {isNumeric(s.value) ? <CountUp target={parseInt(s.value)} /> : s.value}
            </span>
            <span className="text-label-medium text-bass-muted">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
