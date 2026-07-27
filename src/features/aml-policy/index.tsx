import PageLayout from '@/components/shared/layout/PageLayout';
import { motion } from 'framer-motion';
import PolicyTabs from '@/components/shared/policy/PolicyTabs';
import { renderBlocks, type PolicyBlock } from '@/components/shared/policy/richText';

const sections: { id: string; heading: string; blocks: PolicyBlock[] }[] = [
  {
    id: 'introduction',
    heading: 'Introduction',
    blocks: [
      { type: 'p', text: 'Henig Diamonds is committed to complying with all applicable Anti-Money Laundering (AML), Counter-Terrorist Financing (CTF), sanctions, anti-bribery and anti-corruption legislation, including the Proceeds of Crime Act 2002, the Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017 (as amended), the Sanctions and Anti-Money Laundering Act 2018, the Bribery Act 2010, and any other applicable laws and regulatory requirements.' },
      { type: 'p', text: 'The purpose of this procedure is to ensure that Henig Diamonds conducts business only with legitimate customers and counterparties and complies with all applicable legal and regulatory requirements.' },
    ],
  },
  {
    id: 'customer-due-diligence',
    heading: 'Customer Due Diligence (CDD)',
    blocks: [
      { type: 'p', text: 'Before opening an account or conducting transactions where required, Henig Diamonds may request:' },
      {
        type: 'ul',
        items: [
          'Proof of identity;',
          'Proof of address;',
          'Company registration documents;',
          'Beneficial ownership information;',
          'Director and shareholder information;',
          'VAT registration details (where applicable);',
          'Trade references; and',
          'Any additional information reasonably required.',
        ],
      },
    ],
  },
  {
    id: 'enhanced-due-diligence',
    heading: 'Enhanced Due Diligence (EDD)',
    blocks: [
      { type: 'p', text: 'Enhanced due diligence may be required for:' },
      {
        type: 'ul',
        items: [
          'High-value transactions;',
          'Politically Exposed Persons (PEPs);',
          'High-risk jurisdictions;',
          'Complex ownership structures;',
          'Unusual transaction patterns; or',
          'Any situation deemed higher risk by management.',
        ],
      },
    ],
  },
  {
    id: 'sanctions-screening',
    heading: 'Sanctions Screening',
    blocks: [
      { type: 'p', text: 'Henig Diamonds reserves the right to screen customers, beneficial owners, counterparties and transactions against applicable sanctions lists and may refuse to proceed with any transaction where concerns are identified.' },
    ],
  },
  {
    id: 'source-of-funds',
    heading: 'Source of Funds',
    blocks: [
      { type: 'p', text: "Henig Diamonds may request evidence of the source of funds and/or source of wealth where required by applicable law or where considered appropriate based on the Company's risk assessment. Customers may also be required to provide additional documentation or information to support the legitimacy of a transaction or business relationship." },
    ],
  },
  {
    id: 'ongoing-monitoring',
    heading: 'Ongoing Monitoring',
    blocks: [
      { type: 'p', text: 'Customer accounts and trading activity may be monitored on an ongoing basis to identify unusual, suspicious or high-risk activity.' },
    ],
  },
  {
    id: 'suspicious-activity-reporting',
    heading: 'Suspicious Activity Reporting (SAR)',
    blocks: [
      { type: 'p', text: "Where Henig Diamonds knows, suspects, or has reasonable grounds to suspect that money laundering, terrorist financing, fraud or any other financial crime may be taking place, employees must immediately report their concerns internally to the Company's nominated Anti-Money Laundering Officer (\"AML Officer\") or designated member of senior management." },
      { type: 'p', text: 'Henig Diamonds reserves the right to suspend or delay any transaction whilst appropriate enquiries are undertaken.' },
      { type: 'p', text: 'Where required by applicable law, the AML Officer shall determine whether a Suspicious Activity Report (SAR) should be submitted to the National Crime Agency (NCA) or any other competent authority. Employees must not disclose or "tip off" any customer or third party that a report has been made or is being considered.' },
    ],
  },
  {
    id: 'refusal-of-business',
    heading: 'Refusal of Business',
    blocks: [
      { type: 'p', text: 'Henig Diamonds reserves the right, at its sole discretion, to:' },
      {
        type: 'ul',
        items: [
          'Refuse to open an account;',
          'Suspend an account;',
          'Refuse, suspend or delay any transaction;',
          'Request additional documentation; or',
          'Terminate a business relationship,',
        ],
      },
      { type: 'p', text: 'where compliance concerns arise or where required information is not provided.' },
    ],
  },
  {
    id: 'record-keeping',
    heading: 'Record Keeping',
    blocks: [
      { type: 'p', text: 'Henig Diamonds will retain AML and compliance records for a minimum of five (5) years from the end of the business relationship or completion of the relevant transaction, or for such longer period as may be required by applicable law or regulatory requirements.' },
    ],
  },
  {
    id: 'aml-responsibility',
    heading: 'AML Responsibility',
    blocks: [
      { type: 'p', text: 'Henig Diamonds shall designate one or more suitably authorised members of management or employees to oversee the implementation of this Procedure, maintain appropriate AML records, coordinate compliance activities, receive internal reports of suspicious activity and manage any reporting obligations arising under applicable law.' },
      { type: 'p', text: 'Henig Diamonds may change the designated person or persons responsible for these duties at any time without requiring any amendment to this Procedure.' },
    ],
  },
  {
    id: 'contact',
    heading: 'Contact',
    blocks: [
      { type: 'p', text: 'Any AML or compliance-related queries should be directed to:' },
      { type: 'p', text: 'info@henigdiamonds.co.uk' },
    ],
  },
];

const AmlPolicy = () => {
  return (
    <PageLayout>
      <section className="bg-accent text-accent-foreground py-10 md:py-14">
        <div className="henig-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="henig-heading-display mb-4"
          >
            AML & Compliance Procedure
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="henig-body-large text-accent-foreground/70 max-w-2xl mx-auto"
          >
            Our approach to anti-money laundering, counter-terrorist financing and sanctions compliance.
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
                AML & Compliance Procedure.
              </p>
            </article>

          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AmlPolicy;
