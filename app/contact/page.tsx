/* BASSMENT — Contact (v1-latest) */
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/forms/contact-form";
import { contactData } from "@/lib/data";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <div className="h-120 md:h-40 shrink-0" />
      <main className="py-10 pb-20 md:pb-40 flex flex-col items-center px-6">
        <div className="w-full max-w-[640px] flex flex-col gap-12 md:gap-16">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-h3 text-bass-white">{contactData.title}</h1>
            <p className="text-center-18 text-bass-grey-med">{contactData.subtitle}</p>
            <p className="text-center-18 text-bass-grey-med">
              Missing a ticket?{' '}
              <Link href="/tickets/resend" className="text-bass-grey-light underline underline-offset-4 hover:text-bass-white transition-colors">
                Resend it instantly
              </Link>{' '}
              — no need to wait on us.
            </p>
          </div>
          <ContactForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
