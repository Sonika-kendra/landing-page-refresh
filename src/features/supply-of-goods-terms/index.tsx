import PageLayout from '@/components/shared/layout/PageLayout';
import { motion } from 'framer-motion';
import PolicyTabs from '@/components/shared/policy/PolicyTabs';
import { renderBlocks, type PolicyBlock } from '@/components/shared/policy/richText';

const sections: { id: string; heading: string; blocks: PolicyBlock[] }[] = [
  {
    id: 'definitions',
    heading: 'Definitions',
    blocks: [
      { type: 'p', text: '1.1 In these Terms:' },
      { type: 'p', text: '**"Appro"** means Goods supplied on approval/memo where title remains with Henig until invoiced and paid in full.' },
      { type: 'p', text: '**"Business Day"** means any day other than a Saturday, Sunday, public holiday in England, or any day on which Henig Diamonds is officially closed for business.' },
      { type: 'p', text: '**"Customer"** means the person, company or legal entity purchasing or receiving Goods from Henig.' },
      { type: 'p', text: '**"Goods"** means any diamonds, gemstones, jewellery, precious metals, watches or other products supplied by Henig.' },
      { type: 'p', text: '**"Henig"** means Henig Diamonds Ltd.' },
      { type: 'p', text: '**"Order"** means any order placed verbally, by email, telephone, Zoho, API, website or any other approved sales platform.' },
      { type: 'p', text: "**\"Policies\"** means Henig's published policies, as amended from time to time, including the {{LINK:Return Policy|/cancellation-returns-policy}}, {{LINK:Warranty Policy|/cancellation-returns-policy#warranty-definitions}}, {{LINK:AML & Compliance Procedure|/aml-policy}}, {{LINK:Privacy Policy|/privacy-policy}} and any other applicable policy available here: **[Link]**." },
    ],
  },
  {
    id: 'application',
    heading: 'Application',
    blocks: [
      { type: 'p', text: '2.1 These Terms apply to every sale or supply of Goods by Henig.' },
      { type: 'p', text: '2.2 By placing an Order, accepting delivery or receiving Goods on Appro, the Customer accepts these Terms.' },
      { type: 'p', text: '2.3 These Terms override any purchasing conditions issued by the Customer unless expressly agreed by Henig in writing.' },
      { type: 'p', text: "2.4 These Terms should be read together with Henig's {{LINK:General Terms & Conditions|/terms-and-conditions}}." },
    ],
  },
  {
    id: 'customer-accounts-credit',
    heading: 'Customer Accounts & Credit',
    blocks: [
      { type: 'p', text: "3.1 Credit facilities are granted entirely at Henig's discretion and are subject to Henig's Credit Account Procedure, available here: **[Link]**." },
      { type: 'p', text: '3.2 Henig may request financial information, trade references or any other information before approving or reviewing a credit account.' },
      { type: 'p', text: '3.3 Henig may reduce, suspend or withdraw credit facilities at any time without prior notice.' },
      { type: 'p', text: '3.4 Customers must immediately notify Henig of any material change to their financial position.' },
    ],
  },
  {
    id: 'orders',
    heading: 'Orders',
    blocks: [
      { type: 'p', text: '4.1 All Orders are subject to acceptance by Henig.' },
      { type: 'p', text: '4.2 Henig reserves the right to refuse, amend or cancel any Order before dispatch.' },
      { type: 'p', text: '4.3 Product availability is not guaranteed until dispatch.' },
      { type: 'p', text: '4.4 Estimated delivery dates are provided in good faith but are not guaranteed.' },
    ],
  },
  {
    id: 'pricing',
    heading: 'Pricing',
    blocks: [
      { type: 'p', text: '5.1 All prices are exclusive of VAT unless stated otherwise.' },
      { type: 'p', text: '5.2 The Customer shall be responsible for any applicable VAT, customs duties, import duties, taxes, levies or other governmental charges arising in connection with the purchase, importation or delivery of the Goods, unless otherwise agreed in writing.' },
      { type: 'p', text: '5.3 Henig may offer different commercial pricing structures, including Standard Appro Price, Cash Price and Promotional Price.' },
      { type: 'p', text: "5.4 Cash Prices apply only where payment is made within the agreed cash terms, no Appro is granted, and the Goods are non-returnable except for manufacturing defects. Further details are set out in Henig's {{LINK:Return Policy|/cancellation-returns-policy}}." },
    ],
  },
  {
    id: 'payment-terms',
    heading: 'Payment Terms',
    blocks: [
      { type: 'p', text: '6.1 Payment shall be made strictly in accordance with the payment terms stated on the relevant invoice, account agreement, order confirmation, or otherwise agreed in writing by Henig.' },
      { type: 'p', text: '6.2 Unless otherwise agreed in writing, invoices are payable within **30 calendar days** from the invoice date.' },
      { type: 'p', text: '6.3 Time for payment is of the essence. The Customer must pay all invoices in full, without deduction, set-off, counterclaim or withholding, except where required by law.' },
      { type: 'p', text: '6.4 Henig may require payment in advance, payment on delivery, or immediate payment at its sole discretion, including where the Customer has no approved credit facility, has exceeded its credit limit, or has overdue invoices.' },
      { type: 'p', text: '6.5 Henig may reduce, suspend or withdraw credit facilities at any time and without prior notice.' },
      { type: 'p', text: "6.6 Henig reserves the right to place the Customer's account on stop, suspend deliveries, refuse further Orders, withdraw Appro facilities, cancel pending Orders, or require immediate payment where any invoice becomes overdue or where Henig has concerns regarding the Customer's creditworthiness." },
      { type: 'p', text: '6.7 Any dispute relating to an invoice must be raised in writing within **5 Business Days** of the invoice date. The Customer shall remain liable to pay all undisputed amounts by the due date.' },
    ],
  },
  {
    id: 'late-payment-debt-recovery',
    heading: 'Late Payment & Debt Recovery',
    blocks: [
      { type: 'p', text: '7.1 Any overdue balance shall incur interest at **0.1% per calendar day**, calculated daily from the due date until payment is received in full, whether before or after judgment.' },
      { type: 'p', text: "7.2 The Customer shall reimburse Henig for all reasonable costs incurred in recovering overdue amounts, including, but not limited to, debt collection agency fees, solicitor's fees, court fees, enforcement costs and any other associated recovery expenses." },
      { type: 'p', text: '7.3 If any invoice remains overdue, Henig reserves the right to suspend or cancel outstanding Orders, withdraw or suspend credit facilities, refuse further deliveries or Appro facilities, require payment in advance for future Orders, and exercise its rights under the Retention of Title provisions contained within these Terms.' },
      { type: 'p', text: '7.4 Henig may apply any payment received from the Customer against the oldest outstanding invoice first, unless otherwise agreed in writing.' },
      { type: 'p', text: '7.5 Acceptance of any late or partial payment by Henig shall not constitute a waiver of any rights or remedies available under these Terms.' },
      { type: 'p', text: '7.6 Where the Customer disputes an invoice in good faith, the undisputed portion of the invoice shall remain payable in accordance with the agreed payment terms.' },
    ],
  },
  {
    id: 'delivery',
    heading: 'Delivery',
    blocks: [
      { type: 'p', text: '8.1 Delivery shall be made to the delivery address agreed with Henig.' },
      { type: 'p', text: '8.2 Delivery costs shall be charged to the Customer unless Henig agrees otherwise in writing.' },
      { type: 'p', text: '8.3 Where Goods are returned due to customer cancellation, customer error, refused delivery, non-payment, or failure to comply with these Terms, all related shipping, insurance and handling costs shall be borne by the Customer.' },
      { type: 'p', text: '8.4 Where Goods are returned due to a confirmed Henig error or verified manufacturing defect, Henig shall be responsible for reasonable return delivery costs, subject to prior approval.' },
      { type: 'p', text: '8.5 Risk passes to the Customer upon delivery or collection.' },
      { type: 'p', text: '8.6 Delivery dates are estimates only.' },
      { type: 'p', text: '8.7 Henig shall not be liable for delays caused by couriers, customs, suppliers or events beyond its reasonable control.' },
    ],
  },
  {
    id: 'retention-of-title',
    heading: 'Retention of Title',
    blocks: [
      { type: 'p', text: '9.1 Ownership of all Goods shall remain with Henig until full payment has been received.' },
      { type: 'p', text: "9.2 Until title passes, the Customer shall store the Goods separately, insure them adequately, not pledge or charge them, and keep them identifiable as Henig's property." },
      { type: 'p', text: '9.3 Henig may recover unpaid Goods where payment remains outstanding.' },
    ],
  },
  {
    id: 'appro-memo',
    heading: 'Appro (Memo)',
    blocks: [
      { type: 'p', text: '10.1 Henig may supply Goods on Appro at its sole discretion.' },
      { type: 'p', text: '10.2 Standard Appro periods are:' },
      {
        type: 'table',
        headers: ['Product', 'Appro Period'],
        rows: [
          ['Natural Certified Diamonds', '14 days'],
          ['Natural Jewellery', '30 days'],
          ['Lab-Grown Certified Diamonds', '14 days'],
          ['Lab-Grown Jewellery', '14 days'],
          ['Uncertified (Parcels) Natural and Lab grown', '14 days'],
        ],
      },
      { type: 'p', text: '10.3 Goods below £200 shall be supplied on a straight-to-invoice basis and are payable within seven (7) calendar days from the invoice date. Such Goods are not eligible for Appro.' },
      { type: 'p', text: '10.4 Bespoke and special-order Goods are supplied on a straight-to-invoice basis only.' },
      { type: 'p', text: "10.5 Appro may be extended a maximum of **two (2) times**, with each extension not exceeding **five (5) calendar days**, subject to Henig's approval before expiry." },
      { type: 'p', text: '10.6 Goods not returned before expiry shall be automatically invoiced.' },
      { type: 'p', text: "10.7 Further details are set out in Henig's {{LINK:Appro & Return Policy|/cancellation-returns-policy}}." },
    ],
  },
  {
    id: 'returns',
    heading: 'Returns',
    blocks: [
      { type: 'p', text: "11.1 Standard returns are accepted within **30 calendar days**, subject to Henig's {{LINK:Return Policy|/cancellation-returns-policy}}." },
      { type: 'p', text: '11.2 The following Goods are non-returnable: Bespoke or special-order Goods, any specific sales enquiry, Cash Price purchases, Goods below £200, Goods damaged, altered or resized by the Customer, and Goods specifically sourced for the Customer unless otherwise agreed.' },
      { type: 'p', text: '11.3 All returned Goods remain subject to inspection before credit is issued.' },
    ],
  },
  {
    id: 'warranty',
    heading: 'Warranty',
    blocks: [
      { type: 'p', text: '12.1 Jewellery is covered by a **90-day manufacturing warranty**.' },
      { type: 'p', text: '12.2 The warranty applies only to genuine manufacturing defects.' },
      { type: 'p', text: '12.3 The warranty does not cover accidental damage, wear and tear, misuse, third-party repairs, resizing by third parties, or loss resulting from negligence.' },
      { type: 'p', text: '12.4 Diamonds are not supplied with any additional warranty beyond any applicable laboratory certificate.' },
      { type: 'p', text: "12.5 Full warranty terms are set out in Henig's {{LINK:Warranty Policy|/cancellation-returns-policy#warranty-definitions}}." },
    ],
  },
  {
    id: 'bespoke-special-orders',
    heading: 'Bespoke & Special Orders',
    blocks: [
      { type: 'p', text: '13.1 Bespoke and special-order Goods are manufactured specifically for the Customer.' },
      { type: 'p', text: '13.2 Once production has commenced, Orders may not be cancelled.' },
      { type: 'p', text: '13.3 Bespoke Goods are non-returnable except in the event of a verified manufacturing defect.' },
      { type: 'p', text: "13.4 Further details are set out in Henig's {{LINK:Return Policy|/cancellation-returns-policy}} and {{LINK:Warranty Policy|/cancellation-returns-policy#warranty-definitions}}." },
    ],
  },
  {
    id: 'product-information-certificates',
    heading: 'Product Information & Certificates',
    blocks: [
      { type: 'p', text: '14.1 Diamond grading reports are opinions issued by independent laboratories.' },
      { type: 'p', text: '14.2 Henig accepts no liability for differences in grading opinions between laboratories.' },
      { type: 'p', text: '14.3 Minor manufacturing tolerances shall not constitute defects.' },
    ],
  },
  {
    id: 'customer-obligations',
    heading: 'Customer Obligations',
    blocks: [
      { type: 'p', text: "The Customer shall be responsible for any loss of, theft of or damage to the Goods whilst they are in its possession and shall indemnify Henig Diamonds for any resulting loss or damage, except were caused by Henig Diamonds' negligence or wilful misconduct." },
    ],
  },
  {
    id: 'default-suspension',
    heading: 'Default & Suspension',
    blocks: [
      { type: 'p', text: 'Henig may immediately suspend or terminate trading where the Customer fails to pay invoices, breaches these Terms, becomes insolvent, provides false information, or commits fraud.' },
    ],
  },
  {
    id: 'limitation-of-liability',
    heading: 'Limitation of Liability',
    blocks: [
      { type: 'p', text: "17.1 Henig's total liability shall not exceed the invoice value of the relevant Goods." },
      { type: 'p', text: '17.2 Henig shall not be liable for any indirect or consequential loss, loss of profits or business interruption.' },
    ],
  },
  {
    id: 'force-majeure',
    heading: 'Force Majeure',
    blocks: [
      { type: 'p', text: 'Henig shall not be liable for any delay or failure caused by events beyond its reasonable control.' },
    ],
  },
  {
    id: 'general',
    heading: 'General',
    blocks: [
      { type: 'p', text: "19.1 These Terms should be read alongside Henig's {{LINK:General Terms & Conditions|/terms-and-conditions}} and published Policies." },
      { type: 'p', text: '19.2 If any provision is held invalid, the remaining provisions shall remain in force.' },
    ],
  },
  {
    id: 'governing-law',
    heading: 'Governing Law',
    blocks: [
      { type: 'p', text: 'These Terms shall be governed by the laws of England and Wales, and the courts of England and Wales shall have exclusive jurisdiction.' },
    ],
  },
];

const SupplyOfGoodsTerms = () => {
  return (
    <PageLayout>
      <section className="bg-accent text-accent-foreground py-10 md:py-14">
        <div className="henig-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="henig-heading-display mb-4"
          >
            Supply of Goods Terms & Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="henig-body-large text-accent-foreground/70 max-w-2xl mx-auto"
          >
            The terms that govern every sale and supply of Goods by Henig Diamonds Ltd.
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
                Supply of Goods Terms & Conditions.
              </p>
            </article>

          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default SupplyOfGoodsTerms;
