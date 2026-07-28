/* BASSMENT — FAQ (v1-latest) */
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqTitle, faqItems } from "@/lib/data";

export default function FAQ() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="pt-[200px] md:pt-[280px] pb-20 md:pb-[120px] flex flex-col items-center gap-12 md:gap-16 px-6">
        <div className="w-full max-w-[720px] flex flex-col gap-12 md:gap-16">
          <h1 className="text-h1 text-bass-white">{faqTitle}</h1>
          <Accordion className="flex flex-col">
            {faqItems.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-bass-grey-dark py-6">
                <AccordionTrigger className="text-faq-question text-bass-white hover:text-(--color-primary) transition-colors [&[data-state=open]>span]:text-bass-grey-light">
                  {faq.question}
                </AccordionTrigger>
                {faq.answer && (
                  <AccordionContent className="text-body text-bass-grey-med pt-4">
                    {faq.answer}
                  </AccordionContent>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}
