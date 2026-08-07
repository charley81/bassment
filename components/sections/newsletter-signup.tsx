/* BASSMENT — Newsletter Signup Section */
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { newsletterData } from "@/lib/data";

export function NewsletterSignup() {
  return (
    <section
      id="newsletter"
      className="py-20 md:py-120 px-4 lg:px-20"
    >
      <div className="max-w-[520px] md:max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-start gap-10 md:gap-14">
        <div className="flex flex-col items-start gap-4 text-left max-w-[560px]">
          <h3 className="text-h5 text-bass-white">
            {newsletterData.title}
          </h3>
          <p className="text-body text-bass-grey-light">
            {newsletterData.description}
          </p>
        </div>
        <div className="w-full md:w-[480px] shrink-0">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
