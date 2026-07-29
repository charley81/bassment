/* BASSMENT — Newsletter Signup Section */
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { newsletterData } from "@/lib/data";

export function NewsletterSignup() {
  return (
    <section
      id="newsletter"
      className="py-20 md:py-120 flex flex-col items-center bg-bass-grey-dark px-6"
    >
      <div className="flex flex-col items-center gap-6 md:gap-8 max-w-[520px]">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-subtitle-center text-bass-white">
            {newsletterData.title}
          </h3>
          <p className="text-center text-bass-grey-light">
            {newsletterData.description}
          </p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
