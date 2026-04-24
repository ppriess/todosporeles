import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import content from "@/data/home-content.json"

const { faq } = content

export function FAQ() {
  return (
    <section id="faq" className="py-24 px-6 lg:px-8 bg-surface-container-low">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-primary tracking-tight mb-4">
          {faq.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed">{faq.description}</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faq.items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-surface-container-lowest rounded-lg shadow-sm border border-border/20 px-6 data-[state=open]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="py-5 text-left font-display font-bold text-primary text-base hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
