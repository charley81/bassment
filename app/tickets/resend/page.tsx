import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ResendTicketForm } from "@/components/forms/resend-ticket-form";

export const metadata = {
  title: "Resend Ticket — BASSMENT",
  description: "Lost your ticket email? Have it sent again.",
};

export default function ResendTicket() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <div className="h-120 md:h-40 shrink-0" />
      <main className="py-10 pb-20 md:pb-120 flex flex-col items-center px-4 lg:px-20">
        <div className="w-full max-w-[640px] flex flex-col gap-12 md:gap-16">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-h3 text-bass-white">Resend Your Ticket</h1>
            <p className="text-center-18 text-bass-grey-med">
              Enter the email you used at checkout and we&apos;ll send your
              ticket confirmation again. Wrong email at checkout?{" "}
              <a href="/contact" className="text-bass-grey-light underline underline-offset-4 hover:text-bass-white transition-colors">
                Contact us
              </a>{" "}
              with your order reference.
            </p>
          </div>
          <ResendTicketForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
