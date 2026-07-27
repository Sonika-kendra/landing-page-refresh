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
      { type: 'p', text: '**"Appro"** means Goods supplied on approval or memo before being invoiced.' },
      { type: 'p', text: '**"Customer"** means the trade customer returning Goods to Henig.' },
      { type: 'p', text: '**"Goods"** means diamonds, gemstones, jewellery, precious metals or any other products supplied by Henig.' },
      { type: 'p', text: '**"Return Period"** means the applicable period during which Goods may be returned in accordance with this Policy.' },
      { type: 'p', text: '**"Policy"** means this Return Policy, as amended from time to time.' },
    ],
  },
  {
    id: 'purpose-and-scope',
    heading: 'Purpose and Scope',
    blocks: [
      { type: 'p', text: '2.1 This Policy applies to all returns of Goods supplied by Henig.' },
      { type: 'p', text: '2.2 Due to the high-value and traceable nature of diamonds and jewellery, all returns are subject to strict inspection, certification and inventory verification.' },
      { type: 'p', text: "2.3 This Policy forms part of Henig's {{LINK:Supply of Goods Terms & Conditions|/supply-of-goods-terms}}." },
    ],
  },
  {
    id: 'return-process-required-information',
    heading: 'Return Process and Required Information',
    blocks: [
      { type: 'p', text: '3.1 Goods supplied on Appro may be returned without prior written authorisation only where the return is made within the applicable Return Period and the Goods fully comply with this Policy.' },
      { type: 'p', text: '3.2 Any return made outside the applicable Return Period, or any return of Goods that are not eligible for return under this Policy, must be approved in writing by Henig before the Goods are sent back.' },
      { type: 'p', text: "3.3 If a Customer returns Goods outside the applicable Return Period without Henig's prior written approval, Henig reserves the right to reject the return, return the Goods to the Customer, and invoice or maintain the invoice for the Goods in full." },
      { type: 'p', text: '3.4 In such circumstances, the Customer shall be responsible for all related costs, including return shipping, re-delivery, insurance, handling, administration, inspection, certification, and any loss or reduction in value.' },
      { type: 'p', text: '3.5 Late returns shall not prevent Henig from automatically invoicing the Goods in accordance with the applicable Appro terms.' },
      { type: 'p', text: '3.6 The Customer must complete a return slip including the Customer name/business name, Appro or invoice number, item details, and reason for return.' },
      { type: 'p', text: '3.7 The completed return slip must be included inside the return package.' },
      { type: 'p', text: "3.8 Returns received without the required information may be delayed, refused, or returned to the Customer at the Customer's expense." },
      { type: 'p', text: '3.9 Receipt of returned Goods by Henig does not constitute acceptance of the return. All returned Goods remain subject to inspection, verification and final acceptance by Henig.' },
    ],
  },
  {
    id: 'return-eligibility',
    heading: 'Return Eligibility',
    blocks: [
      { type: 'p', text: '4.1 Standard Return Periods:' },
      {
        type: 'table',
        headers: ['Product Type', 'Return / Appro Terms'],
        rows: [
          ['Natural Certified Diamonds', '14-day Appro, returnable'],
          ['Natural Loose Diamonds under £200', 'Straight to invoice, returnable'],
          ['Natural Loose Diamonds over £200', '14-day Appro, returnable'],
          ['Lab-Grown Certified Diamonds under £200', 'Straight to invoice, non-returnable'],
          ['Lab-Grown Certified Diamonds over £200', '14-day Appro, returnable'],
          ['Natural Jewellery under £200', 'Straight to invoice, returnable'],
          ['Natural Jewellery over £200', '30-day Appro, returnable'],
          ['Lab-Grown Jewellery under £200', 'Straight to invoice, returnable'],
          ['Lab-Grown Jewellery over £200', '14-day Appro, returnable'],
          ['Cash Price Purchases (all categories)', 'Straight to invoice, non-returnable, 30-day payment terms'],
          ['Bespoke / Special Orders', 'Straight to invoice, non-returnable'],
          ['Jewellery Manufacturing Defects', "Subject to Henig's {{LINK:Warranty Policy|/warranty-policy}}"],
        ],
      },
      { type: 'p', text: "4.2 Appro terms may be extended only before the auto-invoicing date, up to a maximum of two (2) extensions of no more than five (5) calendar days each, subject to Henig's written approval." },
      { type: 'p', text: '4.3 Goods not returned within the applicable Return Period may be automatically invoiced.' },
    ],
  },
  {
    id: 'general-return-policy',
    heading: 'General Return Policy',
    blocks: [
      { type: 'p', text: '5.1 Unless otherwise stated in this Policy, Goods may be returned within **30 calendar days** from the invoice date, provided they comply with all return conditions.' },
      { type: 'p', text: '5.2 The following Goods are **not eligible for return** unless Henig has provided prior written approval:' },
      {
        type: 'ul',
        items: [
          'Cash Price purchases;',
          'Lab-Grown Certified Diamonds under £200;',
          'Bespoke or special-order Goods;',
          'Goods specifically sourced or manufactured for the Customer;',
          'Goods that have been altered, resized, engraved, repaired or modified;',
          'Goods that do not otherwise comply with this Policy.',
        ],
      },
      { type: 'p', text: '5.3 Natural diamonds and jewellery supplied on a straight-to-invoice basis for Goods under £200 remain returnable for the time being, subject to this Policy. Henig reserves the right to amend this arrangement at any time.' },
    ],
  },
  {
    id: 'condition-of-returned-goods',
    heading: 'Condition of Returned Goods',
    blocks: [
      { type: 'p', text: '6.1 Returned Goods must be received in the same condition as originally supplied.' },
      { type: 'p', text: '6.2 Diamonds must:' },
      {
        type: 'ul',
        items: [
          'match the original grading specification;',
          'match the original certificate details;',
          'match the original weight and measurements;',
          'be free from chips, scratches, abrasions or damage.',
        ],
      },
      { type: 'p', text: '6.3 Jewellery must:' },
      {
        type: 'ul',
        items: [
          'be unworn and in saleable condition;',
          'be free from damage, resizing, repair, engraving or modification;',
          'include all original stones and components;',
          'retain all hallmarks and identification markings;',
          'be individually bagged and securely packaged.',
        ],
      },
      { type: 'p', text: '6.4 Henig may reject any return where Goods are not returned in their original supplied condition.' },
    ],
  },
  {
    id: 'certificates-labels-documentation',
    heading: 'Certificates, Labels and Documentation',
    blocks: [
      { type: 'p', text: '7.1 Where Goods were supplied with certificates, grading reports or documentation, these must be returned with the Goods.' },
      { type: 'p', text: '7.2 This includes certificates issued by laboratories such as GIA, IGI, HRD, SGL, GSI or any other relevant laboratory.' },
      { type: 'p', text: '7.3 If a certificate is missing, Henig may:' },
      {
        type: 'ul',
        items: [
          'place the return on hold;',
          'refuse credit until the issue is resolved;',
          "require recertification at the Customer's expense;",
          'deduct recertification, shipping, insurance and administration costs;',
          'reduce the credit value to reflect loss of market value.',
        ],
      },
      { type: 'p', text: '7.4 All original tags, labels, barcodes and stock references must also be returned.' },
      { type: 'p', text: '7.5 If Henig cannot confirm the identity of the returned Goods, the return may be rejected.' },
    ],
  },
  {
    id: 'shipping-and-risk',
    heading: 'Shipping and Risk',
    blocks: [
      { type: 'p', text: '8.1 Returns must be shipped using a secure and approved shipping method.' },
      { type: 'p', text: '8.2 The Customer is responsible for:' },
      {
        type: 'ul',
        items: [
          'adequate packaging;',
          'correct insurance;',
          'secure tracking;',
          "compliance with Henig's shipping instructions.",
        ],
      },
      { type: 'p', text: '8.3 The Customer remains responsible for the Goods until they are physically received and accepted by Henig.' },
      { type: 'p', text: '8.4 Henig shall not be liable for Goods lost or damaged in transit where the Customer arranged the return shipment or failed to follow Henig’s instructions.' },
    ],
  },
  {
    id: 'return-shipping-costs',
    heading: 'Return Shipping Costs',
    blocks: [
      { type: 'p', text: '9.1 Henig shall bear reasonable return shipping costs only where:' },
      {
        type: 'ul',
        items: [
          'the incorrect Goods were supplied;',
          'the Goods do not match the agreed specification;',
          'a manufacturing defect has been confirmed;',
          'Henig made an administrative error; or',
          'Henig specifically requested the return.',
        ],
      },
      { type: 'p', text: '9.2 The Customer shall bear all shipping, insurance, handling and associated costs where:' },
      {
        type: 'ul',
        items: [
          'Goods are returned because they are no longer required;',
          'the Customer ordered incorrectly;',
          'the return falls outside the agreed Return Period;',
          'the return is rejected following inspection; or',
          "the Customer returns non-returnable Goods without Henig's prior written approval.",
        ],
      },
      { type: 'p', text: "9.3 Where non-returnable Goods are returned without Henig's prior written approval, Henig may, at its sole discretion:" },
      {
        type: 'ul',
        items: [
          'refuse to accept the return;',
          'retain the Goods pending collection by the Customer;',
          "return the Goods to the Customer at the Customer's expense; and/or",
          'maintain or issue the original invoice in full.',
        ],
      },
    ],
  },
  {
    id: 'receiving-and-verification',
    heading: 'Receiving and Verification',
    blocks: [
      { type: 'p', text: '10.1 All returned Goods are subject to inspection and verification before any credit, refund, exchange or replacement is approved.' },
      { type: 'p', text: '10.2 Henig may verify:' },
      {
        type: 'ul',
        items: [
          'quantity received;',
          'packaging condition;',
          'certificate inclusion;',
          'carat weight;',
          'measurements;',
          'certificate matching;',
          'stone identity;',
          'jewellery condition;',
          'metal type and purity;',
          'hallmarks;',
          'signs of wear, damage, alteration or substitution.',
        ],
      },
      { type: 'p', text: '10.3 Receipt of returned Goods does not constitute acceptance of the return.' },
    ],
  },
  {
    id: 'discrepancies-and-rejection',
    heading: 'Discrepancies and Rejection',
    blocks: [
      { type: 'p', text: '11.1 Henig may reject a return where:' },
      {
        type: 'ul',
        items: [
          'certificate numbers do not match;',
          'stone characteristics differ from original records;',
          'weights or measurements differ materially;',
          'Goods have been altered, worn or damaged;',
          'stones have been substituted;',
          'hallmarks, labels or identifying marks are missing or altered;',
          'documentation is incomplete;',
          'the return is outside the applicable Return Period.',
        ],
      },
      { type: 'p', text: '11.2 Any suspected tampering, substitution or fraud may be escalated for management review and may result in account suspension or further action.' },
    ],
  },
  {
    id: 'memo-and-appro-returns',
    heading: 'Memo and Appro Returns',
    blocks: [
      { type: 'p', text: '12.1 Goods supplied on Appro remain the property of Henig until invoiced and paid in full.' },
      { type: 'p', text: '12.2 The Customer is responsible for any loss, theft, damage or reduction in value while Goods are in its possession.' },
      { type: 'p', text: '12.3 Missing Goods, missing certificates or damaged Goods may be invoiced at the agreed replacement value.' },
      { type: 'p', text: '12.4 Goods not returned within the agreed Appro period may be automatically invoiced.' },
    ],
  },
  {
    id: 'non-returnable-goods',
    heading: 'Non-Returnable Goods',
    blocks: [
      { type: 'p', text: '13.1 The following Goods are non-returnable unless Henig agrees otherwise in writing or where a confirmed manufacturing defect or supply error exists:' },
      {
        type: 'ul',
        items: [
          'Cash Price purchases;',
          'Lab-Grown Certified Diamonds under £200;',
          'Bespoke or custom-made jewellery;',
          'Special-order diamonds or jewellery;',
          'Goods specifically sourced for the Customer;',
          'Goods that have been resized, engraved, repaired or otherwise modified;',
          "Goods altered at the Customer's request.",
        ],
      },
      { type: 'p', text: "13.2 Any non-returnable Goods returned without Henig's prior written approval may be rejected and returned to the Customer. The Customer shall be responsible for all shipping, insurance, handling and administration costs associated with such return." },
      { type: 'p', text: '13.3 If the Customer fails to arrange collection of rejected Goods within **30 calendar days** of notification, Henig reserves the right to charge reasonable storage costs and to take such further action as permitted by law.' },
    ],
  },
  {
    id: 'credit-notes-and-refunds',
    heading: 'Credit Notes and Refunds',
    blocks: [
      { type: 'p', text: '14.1 Credit notes, refunds or exchanges shall only be issued once Henig has inspected and accepted the returned Goods.' },
      { type: 'p', text: '14.2 Henig may deduct any reasonable costs, including recertification, repair, shipping, insurance, handling, administration or loss in value.' },
      { type: 'p', text: "14.3 Credit notes may be applied to the Customer's account and may be offset against any outstanding balance owed to Henig." },
    ],
  },
  {
    id: 'final-authority',
    heading: 'Final Authority',
    blocks: [
      { type: 'p', text: '15.1 Henig reserves the right to determine the final outcome of all returns following inspection, authentication, certification review and commercial assessment.' },
      { type: 'p', text: '15.2 Henig may approve, reject, repair, replace, credit or partially credit returned Goods at its discretion, acting reasonably and in good faith.' },
    ],
  },
  {
    id: 'governing-law',
    heading: 'Governing Law',
    blocks: [
      { type: 'p', text: '16.1 This Policy shall be governed by the laws of England and Wales.' },
      { type: 'p', text: '16.2 The courts of England and Wales shall have exclusive jurisdiction over any dispute arising from this Policy.' },
    ],
  },
];

const CancellationReturnsPolicy = () => {
  return (
    <PageLayout>
      <section className="bg-accent text-accent-foreground py-10 md:py-14">
        <div className="henig-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="henig-heading-display mb-4"
          >
            Return Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="henig-body-large text-accent-foreground/70 max-w-2xl mx-auto"
          >
            Our policy on order cancellations and product returns.
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
                Version 1.0. Effective Date: 17/07/2026.
              </p>
            </article>

          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CancellationReturnsPolicy;
