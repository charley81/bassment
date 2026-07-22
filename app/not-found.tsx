/* BASSMENT — 404 Page (v1-latest, node #368:1035) */
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-full bg-[#090102]">
      <Header />
      <main className="flex-1 flex items-center justify-center py-[280px]">
        <div className="flex flex-col items-center gap-16 max-w-[1440px] w-full">
          <div className="flex flex-col items-center gap-6">
            <span className="text-[128px] font-extrabold text-white leading-none">404</span>
            <h1 className="text-[48px] font-bold uppercase text-white">LOST IN THE BASS</h1>
          </div>
          <div className="flex flex-col items-center gap-8">
            <p className="text-base leading-6 text-center text-[var(--color-bass-grey-med)] max-w-[480px]">This page doesn&apos;t exist. Maybe it never did. The bass can disorient.</p>
            <Link href="/" className="inline-flex h-12 px-6 items-center justify-center rounded-lg text-base font-bold text-white hover:text-[var(--color-primary)] transition-colors">Back to Home →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
