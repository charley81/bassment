/* BASSMENT — FAQ */
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getFaqs } from '@/lib/sanity/fetch'
import type { PortableTextBlock } from 'next-sanity'

export const revalidate = 3600 // ISR: revalidate every hour

function portableTextToPlain(blocks: PortableTextBlock[]): string {
  return blocks
    .filter((b) => b._type === 'block')
    .flatMap((b) => b.children?.map((c) => c.text) ?? [])
    .join(' ')
}

export default async function FAQ() {
  const faqs = await getFaqs()

  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="pt-200 md:pt-280 pb-20 md:pb-120 flex flex-col items-center gap-12 md:gap-16 px-6">
        <div className="w-full max-w-[720px] flex flex-col gap-12 md:gap-16">
          <h1 className="text-h1 text-bass-white">FAQ</h1>
          {faqs && faqs.length > 0 ? (
            <Accordion className="flex flex-col">
              {faqs.map((faq) => {
                const answerText = Array.isArray(faq.answer)
                  ? portableTextToPlain(faq.answer as PortableTextBlock[])
                  : (faq.answer as string)
                return (
                  <AccordionItem
                    key={faq._id}
                    value={faq._id}
                    className="border-b border-bass-grey-dark py-6"
                  >
                    <AccordionTrigger className="text-faq-question text-bass-white hover:text-bass-grey-med transition-colors duration-300 [&[data-state=open]>span]:text-bass-grey-light">
                      {faq.question}
                    </AccordionTrigger>
                    {answerText && (
                      <AccordionContent className="text-body text-bass-grey-med pt-4">
                        {answerText}
                      </AccordionContent>
                    )}
                  </AccordionItem>
                )
              })}
            </Accordion>
          ) : (
            <p className="text-body text-bass-grey-med py-12 text-center">
              No FAQs available yet.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
