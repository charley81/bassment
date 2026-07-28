/* BASSMENT — 404 (v1-latest) */
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { notFoundData } from "@/lib/data";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1 flex items-center justify-center py-40 md:py-[280px] px-6">
        <div className="flex flex-col items-center gap-12 md:gap-16 max-w-[1440px] w-full">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <span className="text-display text-bass-white">404</span>
            <h1 className="text-section-heading text-bass-white">{notFoundData.title}</h1>
          </div>
          <div className="flex flex-col items-center gap-6 md:gap-8">
            <p className="text-body-center text-bass-grey-med max-w-[480px]">{notFoundData.description}</p>
            <Link href="/" className="inline-flex h-12 px-6 items-center justify-center rounded-lg text-btn text-bass-white hover:text-(--color-primary) transition-colors">{notFoundData.cta}</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
