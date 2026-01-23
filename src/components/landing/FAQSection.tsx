import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Do you offer custom service, and how long does a custom piece take?',
    answer: 'Yes, we offer bespoke design services. Custom pieces typically take 4-6 weeks from design approval to completion, depending on complexity and materials.',
  },
  {
    question: 'Is a deposit required to make an order?',
    answer: 'Yes, we require a 50% deposit for all orders. The remaining balance is due upon completion before shipping.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship worldwide. International orders are fully insured and tracked. Shipping times vary by destination.',
  },
  {
    question: 'Can I see the diamond before it is set in the jewellery?',
    answer: 'Absolutely. We can arrange for you to view and approve your diamond before setting, either in our showroom or via detailed photographs and certificates.',
  },
  {
    question: 'Do you sell natural or lab-grown diamonds?',
    answer: 'We offer both natural and lab-grown diamonds. Both options come with full certification and our quality guarantee.',
  },
  {
    question: "What is your returns policy?",
    answer: 'We offer a 30-day return policy for unworn items in original condition. Custom pieces are final sale but we offer free resizing within 60 days.',
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="henig-container">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-sm px-6 data-[state=open]:shadow-subtle"
              >
                <AccordionTrigger className="text-left font-serif text-lg hover:no-underline hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
