import PageLayout from '@/components/shared/layout/PageLayout';
import { motion } from 'framer-motion';
import PolicyTabs from '@/components/shared/policy/PolicyTabs';
import { renderBlocks, type PolicyBlock } from '@/components/shared/policy/richText';

const sections: { id: string; heading: string; blocks: PolicyBlock[] }[] = [
  {
    id: 'definitions',
    heading: 'Definitions',
    blocks: [
      { type: 'p', text: "Unless otherwise defined in Henig Diamonds Ltd's General Terms & Conditions, the following definitions apply to this Policy:" },
      { type: 'p', text: '**"Customer"** means the original trade customer who purchased the Jewellery directly from Henig.' },
      { type: 'p', text: '**"Jewellery"** means any finished jewellery item supplied by Henig and covered by this Policy.' },
      { type: 'p', text: '**"Manufacturing Defect"** means a defect in workmanship, assembly or materials existing at the time the Jewellery was supplied, excluding normal wear and tear, accidental damage, misuse, negligence, unauthorised repair, alteration or third-party intervention.' },
      { type: 'p', text: '**"Original Condition"** means the condition in which the Jewellery was supplied by Henig, without resizing, engraving, repair, polishing, plating, stone replacement or any other modification carried out by anyone other than Henig.' },
      { type: 'p', text: '**"Warranty Period"** means ninety (90) calendar days from the original invoice date.' },
    ],
  },
  {
    id: 'scope-of-warranty',
    heading: 'Scope of Warranty',
    blocks: [
      { type: 'p', text: '2.1 Henig provides the original Customer with a limited **90-day manufacturing warranty** from the invoice date.' },
      { type: 'p', text: '2.2 This warranty applies only to Jewellery supplied by Henig and covers genuine Manufacturing Defects.' },
      { type: 'p', text: '2.3 This warranty is personal to the original Customer, is non-transferable and does not extend to any subsequent purchaser or end consumer.' },
      { type: 'p', text: "2.4 This Policy forms part of Henig's {{LINK:Supply of Goods Terms & Conditions|/supply-of-goods-terms}}." },
    ],
  },
  {
    id: 'warranty-conditions',
    heading: 'Warranty Conditions',
    blocks: [
      { type: 'p', text: '3.1 To remain valid, the Jewellery must:' },
      {
        type: 'ul',
        items: [
          'remain in its Original Condition;',
          'be used only for its intended purpose;',
          'be properly stored and handled; and',
          'not be subjected to unauthorised repairs or alterations.',
        ],
      },
      { type: 'p', text: '3.2 The warranty shall immediately become void if the Jewellery has been:' },
      {
        type: 'ul',
        items: [
          'resized;',
          'engraved after supply;',
          'repaired or altered by any person other than Henig;',
          'reset, had stones removed or replaced;',
          'polished, replated or modified;',
          'damaged through misuse, negligence or accidental damage.',
        ],
      },
    ],
  },
  {
    id: 'making-a-warranty-claim',
    heading: 'Making a Warranty Claim',
    blocks: [
      { type: 'p', text: '4.1 The Customer shall notify Henig as soon as reasonably practicable after discovering the alleged defect.' },
      { type: 'p', text: '4.2 No repair or alteration shall be carried out before Henig has inspected the Jewellery or given written authorisation.' },
      { type: 'p', text: '4.3 Warranty claims must include:' },
      {
        type: 'ul',
        items: [
          'the original invoice number;',
          'original certificate(s), where applicable;',
          'original labels or tags where available;',
          'all accompanying documentation;',
          'photographs where requested; and',
          'the Jewellery securely packaged and individually bagged.',
        ],
      },
      { type: 'p', text: '4.4 Henig reserves the right to refuse any claim that does not comply with this Policy.' },
    ],
  },
  {
    id: 'inspection-assessment',
    heading: 'Inspection & Assessment',
    blocks: [
      { type: 'p', text: '5.1 All warranty claims shall be inspected by Henig.' },
      { type: 'p', text: '5.2 Henig may consider:' },
      {
        type: 'ul',
        items: [
          'original QC records;',
          'manufacturing specifications;',
          'supplier information;',
          'photographs;',
          'laboratory reports where applicable; and',
          'any other relevant evidence.',
        ],
      },
      { type: 'p', text: '5.3 Henig shall determine, acting reasonably and in good faith, whether the issue results from:' },
      {
        type: 'ul',
        items: [
          'a Manufacturing Defect;',
          'normal wear and tear;',
          'accidental damage;',
          'misuse;',
          'third-party intervention; or',
          'another excluded circumstance.',
        ],
      },
      { type: 'p', text: "5.4 Henig's assessment shall be final unless otherwise required by applicable law." },
    ],
  },
  {
    id: 'warranty-resolution',
    heading: 'Warranty Resolution',
    blocks: [
      { type: 'p', text: '6.1 Where a warranty claim is accepted, Henig may, at its sole discretion:' },
      {
        type: 'ul',
        items: [
          'repair the Jewellery;',
          'replace the Jewellery;',
          'issue a credit note;',
          'issue a refund; or',
          'offer another commercially reasonable remedy.',
        ],
      },
      { type: 'p', text: '6.2 The remedy selected by Henig shall constitute full settlement of the warranty claim.' },
    ],
  },
  {
    id: 'rejected-claims',
    heading: 'Rejected Claims',
    blocks: [
      { type: 'p', text: '7.1 Where a warranty claim is rejected:' },
      {
        type: 'ul',
        items: [
          "the Jewellery shall be returned at the Customer's expense unless otherwise agreed;",
          'any requested repair shall be chargeable;',
          'no refund, replacement or credit shall be provided.',
        ],
      },
      { type: 'p', text: '7.2 If the Customer requests a replacement instead of a repair, the replacement shall be treated as a new sale and invoiced at the prevailing market price.' },
    ],
  },
  {
    id: 'warranty-exclusions',
    heading: 'Warranty Exclusions',
    blocks: [
      { type: 'p', text: 'This warranty does not cover:' },
      {
        type: 'ul',
        items: [
          'normal wear and tear;',
          'scratches, dents or cosmetic damage;',
          'accidental or impact damage;',
          'bent claws, worn settings or worn components caused by use;',
          'broken chains, clasps or catches resulting from wear or misuse;',
          'chemical, perfume, cosmetic, heat or cleaning product damage;',
          'improper storage or handling;',
          'loss of stones after delivery unless caused by a verified Manufacturing Defect;',
          'resizing, engraving, polishing or any alteration;',
          'repairs carried out by third parties;',
          'theft or loss;',
          'laboratory grading reports or changes in grading opinion; or',
          "claims made by or on behalf of the Customer's own customer or any third party.",
        ],
      },
    ],
  },
  {
    id: 'expiry-of-warranty',
    heading: 'Expiry of Warranty',
    blocks: [
      { type: 'p', text: '9.1 No warranty claim shall be accepted after expiry of the Warranty Period except where rights cannot legally be excluded.' },
      { type: 'p', text: '9.2 Expiry of the Warranty Period does not affect any statutory rights that cannot lawfully be excluded.' },
    ],
  },
  {
    id: 'limitation-of-liability',
    heading: 'Limitation of Liability',
    blocks: [
      { type: 'p', text: '10.1 To the fullest extent permitted by law, Henig shall not be liable for:' },
      {
        type: 'ul',
        items: [
          'indirect or consequential losses;',
          'loss of profit;',
          'business interruption;',
          'reputational damage;',
          'claims made by third parties; or',
          "any costs incurred by the Customer before Henig has authorised the warranty claim.",
        ],
      },
      { type: 'p', text: "10.2 Henig's total liability under this Policy shall not exceed the original invoice value of the relevant Jewellery." },
    ],
  },
  {
    id: 'business-to-business-supply',
    heading: 'Business-to-Business Supply',
    blocks: [
      { type: 'p', text: '11.1 All Jewellery supplied by Henig is supplied strictly on a business-to-business basis.' },
      { type: 'p', text: '11.2 The Customer confirms that it is purchasing in the course of business and not as a consumer.' },
    ],
  },
  {
    id: 'policy-amendments',
    heading: 'Policy Amendments',
    blocks: [
      { type: 'p', text: '12.1 Henig reserves the right to amend this Policy from time to time.' },
      { type: 'p', text: "12.2 The version published on Henig's website at the date of the relevant invoice shall apply unless otherwise agreed in writing." },
    ],
  },
  {
    id: 'governing-law',
    heading: 'Governing Law',
    blocks: [
      { type: 'p', text: '13.1 This Policy shall be governed by and interpreted in accordance with the laws of England and Wales.' },
      { type: 'p', text: '13.2 The courts of England and Wales shall have exclusive jurisdiction over any dispute arising from or in connection with this Policy.' },
    ],
  },
];

const WarrantyPolicy = () => {
  return (
    <PageLayout>
      <section className="bg-accent text-accent-foreground py-10 md:py-14">
        <div className="henig-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="henig-heading-display mb-4"
          >
            Client Warranty Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="henig-body-large text-accent-foreground/70 max-w-2xl mx-auto"
          >
            Our 90-day manufacturing warranty on jewellery supplied by Henig Diamonds Ltd.
          </motion.p>
        </div>
      </section>

      <section className="pt-10 pb-16 md:pt-14 md:pb-24 section-ivory">
        <div className="henig-container">
          <div>

            <PolicyTabs />

            <article>
              <div className="bg-card border border-border rounded-sm p-6 mb-10">
                <h2 className="font-serif text-base text-foreground mb-3">Contents</h2>
                <ol className="space-y-1">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {i + 1}. {s.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-10">
                {sections.map((s, i) => (
                  <motion.div
                    key={s.id}
                    id={s.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <h2 className="font-serif text-xl text-foreground mb-3 pb-2 border-b border-border">
                      {s.heading}
                    </h2>
                    <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                      {renderBlocks(s.blocks)}
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="mt-12 text-xs text-muted-foreground border-t border-border pt-6">
                Version 1.0. Effective Date: [Insert Date].
              </p>
            </article>

          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default WarrantyPolicy;
