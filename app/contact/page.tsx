/* BASSMENT — Contact Page (v1-latest, node #368:1105) */
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-full bg-[#090102]">
      <Header />
      {/* Spacer — 160px height as in Figma */}
      <div className="h-[160px] shrink-0" />
      <main className="py-10 pb-[160px] flex flex-col items-center">
        <div className="w-[640px] flex flex-col gap-16">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-[56px] font-extrabold uppercase text-white">CONTACT US</h1>
            <p className="text-lg text-center text-[var(--color-bass-grey-med)]">Get in touch with the BASSMENT team</p>
          </div>

          <form className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase text-[var(--color-bass-grey-med)]">Full Name</label>
              <div className="h-[52px] px-4 flex items-center rounded-lg bg-[#090102] border border-[var(--color-bass-grey-med)]">
                <span className="text-base text-[var(--color-bass-grey-med)]">John Doe</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase text-[var(--color-bass-grey-med)]">Email Address</label>
              <div className="h-[52px] px-4 flex items-center rounded-lg bg-[#090102] border border-[var(--color-bass-grey-med)]">
                <span className="text-base text-[var(--color-bass-grey-med)]">john@example.com</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase text-[var(--color-bass-grey-med)]">Message</label>
              <div className="h-[160px] p-4 flex rounded-lg bg-[#090102] border border-[var(--color-bass-grey-med)]">
                <span className="text-base text-[var(--color-bass-grey-med)]">Tell us how we can help...</span>
              </div>
            </div>
            <button type="submit" className="h-14 rounded-md bg-[var(--color-primary)] text-base font-bold text-white hover:bg-[var(--color-primary)]/80 transition-colors">SUBMIT</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
