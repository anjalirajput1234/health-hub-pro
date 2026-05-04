import { LifeBuoy, Mail, MessageCircle, Phone, FileQuestion } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/animations";
import { Button } from "@/components/ui/button";

const faqs = [
  { q: "How do I cancel an appointment?", a: "Open My Appointments → tap Cancel on the booking. Free cancellation up to 2 hours before." },
  { q: "Are video consultations recorded?", a: "No. Calls are end-to-end encrypted and never recorded." },
  { q: "How do I redeem loyalty points?", a: "Go to Loyalty Points and pick a reward. Redemption is instant." },
  { q: "Can I download my prescriptions?", a: "Yes — visit Health Records, every uploaded record can be downloaded any time." },
  { q: "Is DoctorKhoj available offline?", a: "Limited offline mode is available for saved doctors and upcoming appointments." },
];

export default function Support() {
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Reveal>
        <h1 className="text-3xl font-display font-bold">Help & Support</h1>
        <p className="text-muted-foreground text-sm mb-6">We're here 24/7 to help you with your healthcare journey.</p>
      </Reveal>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { i: Phone, t: "Call us", d: "1800-DOCTOR", color: "from-primary to-primary-glow" },
          { i: Mail, t: "Email", d: "help@doctorkhoj.in", color: "from-secondary to-accent" },
          { i: MessageCircle, t: "Live chat", d: "Avg. 2 min wait", color: "from-accent to-primary" },
        ].map((c) => (
          <div key={c.t} className={`rounded-2xl bg-gradient-to-br ${c.color} text-primary-foreground p-5 hover-lift shadow-card`}>
            <c.i className="w-6 h-6 mb-2" />
            <p className="font-medium">{c.t}</p>
            <p className="text-sm opacity-90">{c.d}</p>
          </div>
        ))}
      </div>

      <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><FileQuestion className="w-4 h-4" />Frequently asked</h3>
      <div className="rounded-2xl border border-border bg-card p-2">
        <Accordion type="single" collapsible>
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`f-${i}`}>
              <AccordionTrigger className="px-4 text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
