import PageLayout from '@/components/shared/layout/PageLayout';
import { motion } from 'framer-motion';
import PolicyTabs from '@/components/shared/policy/PolicyTabs';
import { renderBlocks, type PolicyBlock } from '@/components/shared/policy/richText';

const sections: { id: string; heading: string; blocks: PolicyBlock[] }[] = [
  {
    id: 'about-us',
    heading: 'About Us',
    blocks: [
      { type: 'p', text: 'Henig Diamonds Ltd ("Henig Diamonds", "we", "our" or "us") is committed to protecting and respecting your privacy.' },
      { type: 'p', text: 'This Privacy Policy explains how we collect, use, disclose and safeguard personal information when you:' },
      {
        type: 'ul',
        items: [
          'Visit our Website;',
          'Apply for a trade account;',
          'Submit enquiries;',
          'Purchase products;',
          'Interact with our team; or',
          'Use our services.',
        ],
      },
      { type: 'subheading', text: 'Company Details' },
      {
        type: 'address',
        lines: [
          'Henig Diamonds Ltd',
          'Suite 2 First Floor',
          '63–66 Hatton Garden',
          'London',
          'EC1N 8LE',
          'United Kingdom',
          'Company Registration Number: **11618219**',
          'Email: **info@henigdiamonds.co.uk**',
        ],
      },
    ],
  },
  {
    id: 'who-this-applies-to',
    heading: 'Who This Policy Applies To',
    blocks: [
      { type: 'p', text: 'This Privacy Policy applies to:' },
      {
        type: 'ul',
        items: [
          'Trade account applicants;',
          'Business customers;',
          'Suppliers;',
          'Website visitors;',
          'Service providers;',
          'Business contacts.',
        ],
      },
      { type: 'p', text: 'The Henig Diamonds Website is intended for business customers.' },
    ],
  },
  {
    id: 'personal-data-we-collect',
    heading: 'Personal Data We Collect',
    blocks: [
      { type: 'subheading', text: 'Trade Account Information' },
      { type: 'p', text: 'When applying for a trade account, we may collect:' },
      {
        type: 'ul',
        items: [
          'Full name;',
          'Company name;',
          'Job title;',
          'Email address;',
          'Telephone number;',
          'Business address;',
          'Delivery address;',
          'Company registration number;',
          'VAT registration number; (Where applicable)',
          'Trade references; and',
          'Any other information or documentation we reasonably require verifying your business, establish your trade account, or comply with our legal and regulatory obligations.',
        ],
      },
      { type: 'subheading', text: 'Order Information' },
      { type: 'p', text: 'When placing enquiries or orders, we may collect:' },
      {
        type: 'ul',
        items: [
          'Product requests;',
          'Purchase history;',
          'Delivery information;',
          'Invoice information;',
          'Payment information;',
          'Return and refund information;',
          'Return authorisation details;',
          'Warranty claim information (where applicable);',
          'Product inspection and verification records relating to returned goods.',
        ],
      },
      { type: 'subheading', text: 'Technical Information' },
      { type: 'p', text: 'When visiting our Website, we may collect:' },
      {
        type: 'ul',
        items: [
          'IP address;',
          'Browser information;',
          'Device information;',
          'Operating system information;',
          'Website usage information;',
          'Cookie data.',
        ],
      },
    ],
  },
  {
    id: 'how-we-collect-information',
    heading: 'How We Collect Information',
    blocks: [
      { type: 'p', text: 'Information may be collected when you:' },
      {
        type: 'ul',
        items: [
          'Visit our Website;',
          'Apply for a trade account;',
          'Submit enquiries;',
          'Place orders;',
          'Contact our team;',
          'Subscribe to updates.',
        ],
      },
      { type: 'p', text: 'We may also obtain information from publicly available business records and third-party verification providers.' },
    ],
  },
  {
    id: 'how-we-use-personal-data',
    heading: 'How We Use Personal Data',
    blocks: [
      { type: 'p', text: 'We may use personal information to:' },
      {
        type: 'ul',
        items: [
          'Verify trade customers;',
          'Create and manage accounts;',
          'Process enquiries and orders;',
          'Deliver products;',
          'Manage payments;',
          'Communicate with customers;',
          'Improve our services;',
          'Comply with legal obligations;',
          'Prevent fraud and financial crime;',
          'Assess creditworthiness, manage credit accounts, recover outstanding debts, and share relevant information with credit reference agencies (such as Credit safe) or similar organisations where appropriate;',
          'Process returns, refunds and warranty claims;',
          'Verify returned products and investigate discrepancies, damaged goods or suspected fraud.',
        ],
      },
    ],
  },
  {
    id: 'aml-compliance-checks',
    heading: 'AML & Compliance Checks',
    blocks: [
      { type: 'p', text: 'As a business operating within the diamond and jewellery industry, Henig Diamonds may conduct customer due diligence and verification checks.' },
      { type: 'p', text: 'Information may be used to:' },
      {
        type: 'ul',
        items: [
          'Verify customer identity;',
          'Verify business legitimacy;',
          'Comply with anti-money laundering requirements;',
          'Prevent fraud and financial crime.',
        ],
      },
      {
        type: 'p',
        text: 'Henig Diamonds may carry out customer due diligence and identity verification checks in accordance with applicable anti-money laundering legislation. For further information, please refer to our {{LINK:Anti-Money Laundering (AML) Policy|/aml-policy}}.',
      },
    ],
  },
  {
    id: 'legal-basis-for-processing',
    heading: 'Legal Basis for Processing',
    blocks: [
      { type: 'p', text: 'We process personal information where necessary:' },
      {
        type: 'ul',
        items: [
          'To perform a contract;',
          'To comply with legal obligations;',
          'For legitimate business interests;',
          'Where consent has been provided.',
        ],
      },
    ],
  },
  {
    id: 'marketing-communications',
    heading: 'Marketing Communications',
    blocks: [
      { type: 'p', text: 'Henig Diamonds may send marketing communications regarding products, services, promotions, events, industry updates and other business-related information where permitted by law.' },
      { type: 'p', text: 'Customers and website visitors may also subscribe to our newsletter to receive updates and marketing communications.' },
      { type: 'p', text: 'Recipients may opt out or unsubscribe from marketing communications at any time by following the unsubscribe link included in our emails or by contacting us directly.' },
    ],
  },
  {
    id: 'sharing-information',
    heading: 'Sharing Information',
    blocks: [
      { type: 'p', text: 'We may share information with:' },
      {
        type: 'ul',
        items: [
          'Delivery providers;',
          'Independent certification laboratories (where required for product verification, re-certification or authentication);',
          'Payment providers;',
          'IT service providers;',
          'Website hosting providers;',
          'Marketing and analytics providers;',
          'Professional advisers;',
          'Regulatory authorities;',
          'Law enforcement agencies where legally required;',
          'Zoho and other business management platforms used to manage customer relationships, orders and business operations.',
        ],
      },
      { type: 'p', text: 'Henig Diamonds does not sell personal information.' },
    ],
  },
  {
    id: 'international-transfers',
    heading: 'International Transfers',
    blocks: [
      { type: 'p', text: 'Personal information may be processed within the United Kingdom and other countries where our service providers operate.' },
      { type: 'p', text: 'In some cases, personal information may need to be shared with overseas delivery providers, logistics providers, customs authorities or other third parties where necessary to fulfil orders or arrange international shipments.' },
      { type: 'p', text: 'Where personal information is transferred or accessed outside the United Kingdom, we will ensure that appropriate safeguards are in place in accordance with applicable data protection laws to protect your personal information.' },
    ],
  },
  {
    id: 'data-security',
    heading: 'Data Security',
    blocks: [
      { type: 'p', text: 'Henig Diamonds implements appropriate technical and organisational measures to protect personal information.' },
      { type: 'p', text: 'Access to personal information is restricted to authorised personnel who require access for legitimate business purposes.' },
      { type: 'p', text: 'However, no method of transmission over the internet can be guaranteed to be completely secure.' },
    ],
  },
  {
    id: 'data-retention',
    heading: 'Data Retention',
    blocks: [
      { type: 'p', text: 'We retain personal information only for as long as necessary:' },
      {
        type: 'ul',
        items: [
          'To provide services;',
          'To comply with legal obligations;',
          'To maintain business records;',
          'To prevent fraud; and',
          'To meet the minimum retention periods required by applicable laws and regulatory requirements.',
        ],
      },
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your Rights',
    blocks: [
      { type: 'p', text: 'Subject to applicable law, you may have the right to:' },
      {
        type: 'ul',
        items: [
          'Access personal information;',
          'Correct inaccurate information;',
          'Request deletion;',
          'Restrict processing;',
          'Object to processing;',
          'Withdraw consent where applicable.',
        ],
      },
      { type: 'p', text: 'Henig Diamonds will respond to legitimate requests in accordance with applicable data protection legislation.' },
      { type: 'p', text: 'Requests may be submitted to: info@henigdiamonds.co.uk' },
    ],
  },
  {
    id: 'cookies',
    heading: 'Cookies',
    blocks: [
      { type: 'p', text: 'The Website uses cookies and similar technologies.' },
      { type: 'p', text: 'Further details are available in our {{LINK:Cookie Policy|/cookies-policy}}.' },
    ],
  },
  {
    id: 'third-party-websites',
    heading: 'Third-Party Websites',
    blocks: [
      { type: 'p', text: 'Our Website may contain links to third-party websites.' },
      { type: 'p', text: 'Henig Diamonds is not responsible for the privacy practices, content or security of external websites and encourages users to review the privacy policies of any third-party websites they visit.' },
    ],
  },
  {
    id: 'complaints',
    heading: 'Complaints',
    blocks: [
      { type: 'p', text: 'If you have concerns regarding our handling of personal information, please contact us first.' },
      { type: 'p', text: "You may also lodge a complaint with the Information Commissioner's Office (ICO): https://www.ico.org.uk" },
    ],
  },
  {
    id: 'changes-to-this-policy',
    heading: 'Changes to This Policy',
    blocks: [
      { type: 'p', text: 'Henig Diamonds reserves the right to update this Privacy Policy at any time.' },
      { type: 'p', text: 'Updated versions will be published on the Website.' },
      { type: 'p', text: 'Continued use of the Website following publication of an updated Privacy Policy constitutes acceptance of the revised version.' },
    ],
  },
];

const PrivacyPolicy = () => {
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
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="henig-body-large text-accent-foreground/70 max-w-2xl mx-auto"
          >
            How Henig Diamonds Ltd collects, uses, and protects your personal data.
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
                Last updated: 01.07.2026.
              </p>
            </article>

          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default PrivacyPolicy;
