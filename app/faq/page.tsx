/* BASSMENT — FAQ Page (v1-latest, node #368:936) */
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const faqs = [
  { q: "Where is BASSMENT located?", a: "70 Pine Street, Manhattan. Enter through the unmarked door on the east side of the building. Take the stairs down three flights. You'll hear it before you see it.", open: true },
  { q: "What are the age restrictions?", a: "", open: false },
  { q: "How do I buy tickets?", a: "All tickets are sold through our website via DICE. Sign up to the mailing list for early access — our events sell out fast. Day-of tickets are occasionally available at the door, cash only.", open: true },
  { q: "What is the Valve Sound System?", a: "", open: false },
  { q: "Can I take photos inside?", a: "", open: false },
  { q: "Is there a coat check?", a: "", open: false },
  { q: "What time do headliners usually go on?", a: "", open: false },
  { q: "Do you serve food?", a: "", open: false },
];

export default function FAQ() {
  return (
    <div className="flex flex-col min-h-full bg-[#090102]">
      <Header />
      <main className="pt-[280px] pb-[120px] flex flex-col items-center gap-16">
        <div className="w-[720px] flex flex-col gap-16">
          <h1 className="text-[72px] font-extrabold text-white">FAQ</h1>
          <div className="flex flex-col">
            {faqs.map((faq, i) => (
              <div key={i} className={`py-6 border-b border-[var(--color-bass-grey-dark)] ${faq.open ? "" : ""}`}>
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-[30px] font-bold text-white">{faq.q}</h2>
                  <span className="text-2xl font-bold text-[var(--color-bass-grey-light)] shrink-0">{faq.open ? "−" : "+"}</span>
                </div>
                {faq.a && (
                  <p className="text-base leading-relaxed text-[var(--color-bass-grey-med)] mt-4">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
