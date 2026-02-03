import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqItems } from '@/config/theme';

const FAQSection = () => {
  return (
    <section id="faq" className="py-8 md:py-12 w-full bg-secondary">
      {/* Full width container with horizontal padding */}
      <div className="px-4 sm:px-6 lg:px-12 w-full">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="henig-heading-section text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <div className="henig-separator mx-auto" />
        </motion.div>

        {/* FAQ Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 w-full">
            {faqItems.map((faq, index) => (
              <Accordion
                key={index}
                type="single"
                collapsible
                className="space-y-4 w-full"
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border border-border rounded-sm px-6 data-[state=open]:shadow-subtle w-full"
                >
                  <AccordionTrigger className="text-left font-serif text-lg hover:no-underline hover:text-primary py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
