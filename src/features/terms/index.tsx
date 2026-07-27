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
      { type: 'p', text: '**"Business Day"** means any day other than a Saturday, Sunday or public holiday in England.' },
      { type: 'p', text: '**"Customer"** means any individual, company, partnership or other legal entity trading with Henig.' },
      { type: 'p', text: '**"Goods"** means any diamonds, gemstones, jewellery, precious metals, watches or other products supplied by or purchased by Henig.' },
      { type: 'p', text: '**"Henig"** means Henig Diamonds Ltd, its successors and permitted assigns.' },
      { type: 'p', text: '**"Order"** means any order placed verbally, electronically, by email, telephone, website, API, Zoho or any other approved sales platform.' },
      { type: 'p', text: '**"Policies"** means all policies, procedures and guidelines published by Henig from time to time.' },
      { type: 'p', text: '**"Terms"** means these General Terms & Conditions.' },
      { type: 'p', text: '**"Website"** means the official Henig Diamonds website and any associated online platforms operated by Henig.' },
    ],
  },
  {
    id: 'application-of-terms',
    heading: 'Application of Terms',
    blocks: [
      { type: 'p', text: '2.1 These Terms & Conditions apply to all business conducted between Henig and its Customers.' },
      { type: 'p', text: "2.2 By placing an Order, opening an account, accepting Goods, supplying Goods, or otherwise conducting business with Henig, the Customer agrees to be bound by these Terms and all applicable Policies." },
      { type: 'p', text: "2.3 These Terms should be read together with Henig's Supply of Goods Terms & Conditions, Purchase of Goods Terms & Conditions and all applicable Policies." },
      { type: 'p', text: '2.4 In the event of any inconsistency, the document most directly applicable to the transaction shall prevail.' },
    ],
  },
  {
    id: 'business-customers-only',
    heading: 'Business Customers Only',
    blocks: [
      { type: 'p', text: '3.1 Henig supplies and purchases Goods primarily on a business-to-business basis.' },
      { type: 'p', text: '3.2 Customers warrant that they are acting in the course of a business, profession or trade unless otherwise agreed in writing.' },
      { type: 'p', text: '3.3 Henig reserves the right to refuse transactions where it believes consumer legislation may apply or where additional legal obligations would arise.' },
    ],
  },
  {
    id: 'account-opening-credit-facilities',
    heading: 'Account Opening & Credit Facilities',
    blocks: [
      { type: 'p', text: '4.1 Henig may require Customers to complete account opening documentation and provide company registration details, identification, VAT information, trade references, financial information and any other documentation reasonably required.' },
      { type: 'p', text: "4.2 Any credit facility is granted entirely at Henig's discretion." },
      { type: 'p', text: '4.3 Henig may amend, suspend, reduce or withdraw any credit facility at any time without prior notice.' },
      { type: 'p', text: '4.4 Customers shall promptly notify Henig of any material change to their legal status, ownership or financial position.' },
    ],
  },
  {
    id: 'anti-money-laundering-compliance',
    heading: 'Anti-Money Laundering & Compliance',
    blocks: [
      { type: 'p', text: "5.1 Customers shall provide all information reasonably requested by Henig for anti-money laundering, sanctions, fraud prevention, Know Your Business (KYB) and regulatory compliance purposes." },
      { type: 'p', text: '5.2 Henig reserves the right to delay, suspend, refuse or cancel any transaction where compliance concerns arise.' },
      { type: 'p', text: '5.3 Henig may request updated information at any time to satisfy its legal or regulatory obligations.' },
      { type: 'p', text: "5.4 Further details are available in Henig's {{LINK:AML & Compliance Procedure|/aml-policy}}." },
    ],
  },
  {
    id: 'confidentiality',
    heading: 'Confidentiality',
    blocks: [
      { type: 'p', text: '6.1 All commercial, financial, technical, supplier, pricing, inventory and business information disclosed by Henig shall remain confidential.' },
      { type: 'p', text: "6.2 Customers shall not disclose such information to any third party without Henig's prior written consent unless required by law." },
      { type: 'p', text: '6.3 This obligation survives termination of the business relationship.' },
    ],
  },
  {
    id: 'data-protection-privacy',
    heading: 'Data Protection & Privacy',
    blocks: [
      { type: 'p', text: '7.1 Henig processes personal data in accordance with applicable data protection legislation.' },
      { type: 'p', text: '7.2 Personal data may be processed for account management, compliance, fraud prevention, contractual performance and other legitimate business purposes.' },
      { type: 'p', text: "7.3 Further information is available in Henig's {{LINK:Privacy Policy|/privacy-policy}}." },
    ],
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual Property',
    blocks: [
      { type: 'p', text: '8.1 All intellectual property rights belonging to Henig, including logos, trademarks, trade names, product images, CAD designs, renders, videos, website content, catalogues, marketing materials and documentation remain the exclusive property of Henig unless otherwise agreed in writing.' },
      { type: 'p', text: '8.2 No licence or ownership rights are granted except as expressly stated.' },
    ],
  },
  {
    id: 'website-electronic-services',
    heading: 'Website & Electronic Services',
    blocks: [
      { type: 'p', text: "9.1 Access to and use of Henig's Website, customer portal, API and any other online services are governed by the Henig {{LINK:Website Terms of Use|/website-terms-of-use}}, which form part of Henig's overall legal framework." },
      { type: 'p', text: 'Henig may communicate electronically with Customers and Suppliers, including by email, customer portal, API, electronic data interchange (EDI) or any other approved electronic platform.' },
      { type: 'p', text: 'Electronic quotations, purchase orders, invoices, statements, notices, approvals and other communications shall have the same legal effect as written communications.' },
      { type: 'p', text: 'Henig may rely upon electronic records, CRM records, ERP records, website logs, API logs and other system records as evidence of transactions, communications and contractual agreements.' },
    ],
  },
  {
    id: 'limitation-of-liability',
    heading: 'Limitation of Liability',
    blocks: [
      { type: 'p', text: '10.1 Nothing in these Terms excludes liability where such exclusion would be unlawful.' },
      { type: 'p', text: "10.2 Subject to Clause 10.1, Henig's total liability arising out of any transaction shall not exceed the value of the Goods or services giving rise to the claim." },
      { type: 'p', text: '10.3 Henig shall not be liable for indirect, consequential, special or economic loss, including loss of profit, business interruption, loss of opportunity or loss of goodwill.' },
    ],
  },
  {
    id: 'indemnity',
    heading: 'Indemnity',
    blocks: [
      { type: 'p', text: "11.1 The Customer agrees to indemnify and keep indemnified Henig against all losses, liabilities, claims, damages, costs and expenses arising from the Customer's breach of these Terms, negligence, unlawful acts or misuse of the Goods." },
    ],
  },
  {
    id: 'force-majeure',
    heading: 'Force Majeure',
    blocks: [
      { type: 'p', text: '12.1 Henig shall not be liable for any delay or failure to perform its obligations where caused by events beyond its reasonable control, including but not limited to natural disasters, strikes, transport disruption, supplier failures, cyber-attacks, government actions, pandemics, customs delays or utility failures.' },
    ],
  },
  {
    id: 'assignment',
    heading: 'Assignment',
    blocks: [
      { type: 'p', text: "13.1 The Customer may not assign or transfer any rights or obligations under these Terms without Henig's prior written consent." },
      { type: 'p', text: '13.2 Henig may assign or transfer its rights and obligations at any time.' },
    ],
  },
  {
    id: 'severability',
    heading: 'Severability',
    blocks: [
      { type: 'p', text: '14.1 If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.' },
    ],
  },
  {
    id: 'waiver',
    heading: 'Waiver',
    blocks: [
      { type: 'p', text: '15.1 Failure or delay by Henig in exercising any right or remedy shall not constitute a waiver of that right or remedy.' },
    ],
  },
  {
    id: 'entire-agreement',
    heading: 'Entire Agreement',
    blocks: [
      { type: 'p', text: '16.1 These Terms, together with any applicable Supply of Goods Terms & Conditions, Purchase of Goods Terms & Conditions and incorporated Policies, constitute the entire agreement between Henig and the Customer.' },
      { type: 'p', text: '16.2 They supersede all previous discussions, negotiations, understandings and agreements relating to the relevant transaction.' },
    ],
  },
  {
    id: 'third-party-rights',
    heading: 'Third Party Rights',
    blocks: [
      { type: 'p', text: '17.1 Unless expressly stated otherwise, no person who is not a party to these Terms shall have any right to enforce any provision under the Contracts (Rights of Third Parties) Act 1999.' },
    ],
  },
  {
    id: 'policies-procedures',
    heading: 'Policies & Procedures',
    blocks: [
      { type: 'p', text: '18.1 The following documents form part of these Terms and are incorporated by reference:' },
      {
        type: 'ul',
        items: [
          'Supply of Goods Terms & Conditions: {{LINK:[Link]|/supply-of-goods-terms}}',
          'Purchase of Goods Terms & Conditions: **[Link]**',
          'Return Policy: {{LINK:[Link]|/cancellation-returns-policy}}',
          'Warranty Policy: {{LINK:[Link]|/warranty-policy}}',
          'KYB & Supplier Onboarding Procedure: **[Link]**',
          'AML & Compliance Procedure: {{LINK:[Link]|/aml-policy}}',
          'Responsible Sourcing Procedure: **[Link]**',
          'Privacy Policy: {{LINK:[Link]|/privacy-policy}}',
          'Website Terms of Use: {{LINK:[Link]|/website-terms-of-use}}',
          'IT & Cyber Security Policy (where applicable): **[Link]**',
        ],
      },
      { type: 'p', text: 'Customers agree to comply with all applicable Policies published by Henig from time to time.' },
      { type: 'p', text: "Henig reserves the right to amend, replace or withdraw any Policy at its sole discretion." },
      { type: 'p', text: "The version published on Henig's website at the time of the relevant transaction shall apply unless otherwise agreed in writing." },
    ],
  },
  {
    id: 'amendments',
    heading: 'Amendments',
    blocks: [
      { type: 'p', text: '19.1 Henig reserves the right to amend these Terms at any time.' },
      { type: 'p', text: "19.2 Updated versions shall become effective upon publication on Henig's website unless otherwise stated." },
    ],
  },
  {
    id: 'governing-law',
    heading: 'Governing Law',
    blocks: [
      { type: 'p', text: '20.1 These Terms shall be governed by and construed in accordance with the laws of England and Wales.' },
      { type: 'p', text: '20.2 The courts of England and Wales shall have exclusive jurisdiction in relation to any dispute arising out of or in connection with these Terms.' },
    ],
  },
];

const TermsAndConditions = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-accent text-accent-foreground py-10 md:py-14">
        <div className="henig-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="henig-heading-display mb-4"
          >
            Terms & Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="henig-body-large text-accent-foreground/70 max-w-2xl mx-auto"
          >
            The general terms that govern the supply of goods and services by Henig Diamonds Ltd.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="pt-10 pb-16 md:pt-14 md:pb-24 section-ivory">
        <div className="henig-container">
          <div>

            <PolicyTabs />

            {/* Main content */}
            <article>
              {/* Table of contents */}
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

              {/* Sections */}
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

export default TermsAndConditions;
