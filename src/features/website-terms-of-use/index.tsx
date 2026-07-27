import PageLayout from '@/components/shared/layout/PageLayout';
import { motion } from 'framer-motion';
import PolicyTabs from '@/components/shared/policy/PolicyTabs';
import { renderBlocks, type PolicyBlock } from '@/components/shared/policy/richText';

const sections: { id: string; heading: string; blocks: PolicyBlock[] }[] = [
  {
    id: 'definitions',
    heading: 'Definitions',
    blocks: [
      { type: 'p', text: "Unless otherwise defined in Henig Diamonds Ltd's General Terms & Conditions, the following definitions apply to these Website Terms of Use." },
      { type: 'p', text: '**"Account"** means any online account, customer portal account, supplier portal account or other electronic account created to access the Website or Services.' },
      { type: 'p', text: '**"Content"** means all text, photographs, images, videos, product information, CAD designs, renders, logos, trademarks, graphics, documents, catalogues, software, databases and other materials available on the Website.' },
      { type: 'p', text: '**"Services"** means any online services provided by Henig through the Website, customer portal, supplier portal, API or other electronic platforms.' },
      { type: 'p', text: '**"User"** means any person accessing or using the Website.' },
      { type: 'p', text: '**"Website"** means the official Henig Diamonds website and any associated websites, customer portals, supplier portals, mobile applications, APIs or electronic platforms operated by Henig.' },
      { type: 'p', text: '**"Website Terms"** means these Website Terms of Use.' },
    ],
  },
  {
    id: 'acceptance-of-these-website-terms',
    heading: 'Acceptance of These Website Terms',
    blocks: [
      { type: 'p', text: '2.1 By accessing or using the Website, the User confirms that they have read, understood and agree to be bound by these Website Terms.' },
      { type: 'p', text: '2.2 If the User is accessing the Website on behalf of a company or other legal entity, the User confirms that they have authority to bind that organisation.' },
      { type: 'p', text: '2.3 If the User does not agree to these Website Terms, they must immediately cease using the Website.' },
      { type: 'p', text: "2.4 These Website Terms should be read together with Henig's:" },
      {
        type: 'ul',
        items: [
          'General Terms & Conditions;',
          'Supply of Goods Terms & Conditions;',
          'Purchase of Goods Terms & Conditions;',
          'Privacy Policy;',
          'Cookie Policy; and',
          'any other applicable Policies published by Henig.',
        ],
      },
    ],
  },
  {
    id: 'about-the-website',
    heading: 'About the Website',
    blocks: [
      { type: 'p', text: '3.1 The Website is owned and operated by Henig Diamonds Ltd.' },
      { type: 'p', text: '3.2 The Website is intended primarily for trade customers and businesses operating within the jewellery, diamond and luxury goods industries.' },
      { type: 'p', text: '3.3 Access to certain parts of the Website may be restricted to approved Users.' },
      { type: 'p', text: '3.4 Henig reserves the right to modify, suspend or withdraw any part of the Website at any time without prior notice.' },
    ],
  },
  {
    id: 'permitted-use',
    heading: 'Permitted Use',
    blocks: [
      { type: 'p', text: 'The User may use the Website solely for legitimate business purposes, including:' },
      {
        type: 'ul',
        items: [
          'browsing products;',
          'requesting quotations;',
          'applying for trade accounts;',
          'placing enquiries;',
          'accessing approved customer or supplier services;',
          'viewing account information;',
          'managing orders;',
          'using authorised API services.',
        ],
      },
      { type: 'p', text: 'The User shall comply with all applicable laws and regulations when using the Website.' },
    ],
  },
  {
    id: 'prohibited-use',
    heading: 'Prohibited Use',
    blocks: [
      { type: 'p', text: 'The User shall not:' },
      {
        type: 'ul',
        items: [
          'use the Website for any unlawful or fraudulent purpose;',
          'interfere with the security, operation or functionality of the Website;',
          'attempt to gain unauthorised access to any systems, servers, databases or Accounts;',
          'upload viruses, malware, ransomware or other malicious software;',
          "use bots, spiders, crawlers, scraping tools or automated systems without Henig's prior written consent;",
          'copy, reproduce, download, distribute or exploit Website Content except as expressly authorised;',
          'attempt to reverse engineer, decompile or otherwise interfere with the Website or its software;',
          'impersonate another individual or organisation;',
          'provide false or misleading information;',
          "interfere with another User's access to the Website;",
          "use the Website in any manner that may damage Henig's reputation, systems or business.",
        ],
      },
    ],
  },
  {
    id: 'trade-accounts-and-online-accounts',
    heading: 'Trade Accounts and Online Accounts',
    blocks: [
      { type: 'p', text: '6.1 Certain Website features may require the creation of an Account.' },
      { type: 'p', text: '6.2 Users are responsible for maintaining the confidentiality of their login credentials.' },
      { type: 'p', text: '6.3 Users shall immediately notify Henig of any suspected unauthorised use of their Account.' },
      { type: 'p', text: "6.4 Users remain responsible for all activity carried out through their Account unless caused by Henig's negligence." },
      { type: 'p', text: '6.5 Henig may suspend, restrict or terminate any Account at its sole discretion where it reasonably believes these Website Terms have been breached, fraudulent activity has occurred, or continued access may expose Henig or other Users to risk.' },
    ],
  },
  {
    id: 'product-information-and-availability',
    heading: 'Product Information and Availability',
    blocks: [
      { type: 'p', text: '7.1 Henig makes reasonable efforts to ensure that product information is accurate at the time of publication.' },
      { type: 'p', text: '7.2 Product descriptions, specifications, pricing, certifications, stock availability, photographs and videos are provided for general information only.' },
      { type: 'p', text: '7.3 Product images, CAD renders and videos are illustrative only and may not represent the exact appearance of the Goods supplied.' },
      { type: 'p', text: '7.4 Variations in colour, finish, dimensions, metal weight, gemstone characteristics and manufacturing tolerances shall not constitute defects.' },
      { type: 'p', text: '7.5 Stock availability displayed on the Website does not constitute a guarantee that Goods remain available.' },
      { type: 'p', text: "7.6 Nothing on the Website constitutes a legally binding offer to sell Goods. Orders are only accepted in accordance with Henig's Supply of Goods Terms & Conditions." },
      { type: 'p', text: 'Product availability displayed on the Website is indicative only. Due to the fast-moving nature of the diamond and jewellery trade, Goods may be sold, reserved, withdrawn or otherwise become unavailable before the Website is updated. Henig does not guarantee the availability of any Goods displayed on the Website.' },
    ],
  },
  {
    id: 'pricing',
    heading: 'Pricing',
    blocks: [
      { type: 'p', text: '8.1 Prices displayed on the Website are provided for information purposes only and may be amended at any time without prior notice.' },
      { type: 'p', text: '8.2 Henig makes reasonable efforts to ensure that prices displayed on the Website are accurate and kept up to date. However, due to fluctuations in the prices of diamonds, gemstones, precious metals, foreign exchange rates, manufacturing costs and other market conditions, there may occasionally be a delay before such changes are reflected on the Website.' },
      { type: 'p', text: '8.3 The price applicable to any Goods shall be the price confirmed by Henig in writing at the time the relevant Order is accepted.' },
      { type: 'p', text: '8.4 The publication of any price on the Website does not constitute a binding quotation or offer to sell Goods at that price.' },
      { type: 'p', text: '8.5 Henig reserves the right to correct any pricing, typographical, administrative or technical error at any time, including after an enquiry or Order has been submitted but before it has been accepted.' },
      { type: 'p', text: '8.6 All Orders remain subject to acceptance by Henig in accordance with the Supply of Goods Terms & Conditions.' },
    ],
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual Property',
    blocks: [
      { type: 'p', text: '9.1 All intellectual property rights relating to the Website and its Content remain the exclusive property of Henig or its licensors.' },
      { type: 'p', text: 'This includes:' },
      {
        type: 'ul',
        items: [
          'logos;',
          'trademarks;',
          'trade names;',
          'product images;',
          'CAD designs;',
          'renders;',
          'videos;',
          'catalogues;',
          'technical drawings;',
          'product descriptions;',
          'pricing structures;',
          'databases;',
          'software;',
          'source code;',
          'documentation.',
        ],
      },
      { type: 'p', text: "9.2 Nothing contained on the Website grants any licence or right to use Henig's intellectual property except as expressly authorised in writing." },
    ],
  },
  {
    id: 'api-and-digital-services',
    heading: 'API and Digital Services',
    blocks: [
      { type: 'p', text: '10.1 Henig may provide API access, customer portals or other digital integrations.' },
      { type: 'p', text: '10.2 API access may be suspended, restricted or withdrawn at any time.' },
      { type: 'p', text: '10.3 Users must ensure that API credentials remain secure.' },
      { type: 'p', text: "10.4 Users shall not attempt to manipulate, overload, disrupt or interfere with Henig's systems through any electronic integration." },
      { type: 'p', text: '10.5 Henig accepts no responsibility for losses arising from third-party software or integrations.' },
    ],
  },
  {
    id: 'third-party-links',
    heading: 'Third-Party Links',
    blocks: [
      { type: 'p', text: 'The Website may contain links to third-party websites.' },
      { type: 'p', text: 'Henig does not control and is not responsible for:' },
      {
        type: 'ul',
        items: [
          'third-party content;',
          'privacy practices;',
          'availability;',
          'products or services offered by third parties.',
        ],
      },
      { type: 'p', text: "Accessing third-party websites is entirely at the User's own risk." },
    ],
  },
  {
    id: 'website-availability',
    heading: 'Website Availability',
    blocks: [
      { type: 'p', text: '12.1 Henig does not guarantee uninterrupted or error-free access to the Website.' },
      { type: 'p', text: '12.2 Maintenance, updates, security improvements or technical issues may result in temporary interruptions.' },
      { type: 'p', text: '12.3 Henig may suspend access immediately where necessary to protect its systems, Users or business operations.' },
    ],
  },
  {
    id: 'privacy-and-cookies',
    heading: 'Privacy and Cookies',
    blocks: [
      { type: 'p', text: "Personal information collected through the Website is processed in accordance with Henig's:" },
      {
        type: 'ul',
        items: [
          'Privacy Policy; and',
          'Cookie Policy.',
        ],
      },
      { type: 'p', text: 'Users should review those documents before using the Website.' },
    ],
  },
  {
    id: 'disclaimer',
    heading: 'Disclaimer',
    blocks: [
      { type: 'p', text: '14.1 To the fullest extent permitted by law, the Website and all Content are provided on an "as is" and "as available" basis.' },
      { type: 'p', text: '14.2 Henig does not warrant that:' },
      {
        type: 'ul',
        items: [
          'the Website will always be available;',
          'the Website will be free from errors;',
          'the Website will be free from viruses or malicious code;',
          'information published will always be complete, current or accurate.',
        ],
      },
      { type: 'p', text: "14.3 Users are responsible for ensuring that any reliance placed upon Website Content is appropriate for their own business purposes." },
    ],
  },
  {
    id: 'limitation-of-liability',
    heading: 'Limitation of Liability',
    blocks: [
      { type: 'p', text: '15.1 Nothing in these Website Terms excludes liability where such exclusion would be unlawful.' },
      { type: 'p', text: '15.2 Subject to Clause 15.1, Henig shall not be liable for:' },
      {
        type: 'ul',
        items: [
          'Website downtime;',
          'temporary loss of access;',
          'interruption of business;',
          'loss of profits;',
          'loss of revenue;',
          'loss of opportunity;',
          'loss of goodwill;',
          'loss of data;',
          'indirect or consequential losses arising from use of the Website.',
        ],
      },
      { type: 'p', text: '15.3 Users acknowledge that use of the Website is entirely at their own risk.' },
    ],
  },
  {
    id: 'suspension-and-termination',
    heading: 'Suspension and Termination',
    blocks: [
      { type: 'p', text: 'Henig may suspend or terminate access to the Website, any Account or any digital service immediately where:' },
      {
        type: 'ul',
        items: [
          'these Website Terms are breached;',
          'fraudulent or unlawful activity is suspected;',
          'the security of the Website may be compromised;',
          'required by law or regulatory authorities.',
        ],
      },
      { type: 'p', text: 'Termination shall not affect any accrued rights or obligations.' },
    ],
  },
  {
    id: 'amendments',
    heading: 'Amendments',
    blocks: [
      { type: 'p', text: 'Henig reserves the right to amend these Website Terms at any time.' },
      { type: 'p', text: 'The latest version published on the Website shall apply from the date of publication unless otherwise stated.' },
    ],
  },
  {
    id: 'governing-law',
    heading: 'Governing Law',
    blocks: [
      { type: 'p', text: '18.1 These Website Terms shall be governed by and construed in accordance with the laws of England and Wales.' },
      { type: 'p', text: '18.2 The courts of England and Wales shall have exclusive jurisdiction to determine any dispute arising out of or in connection with these Website Terms.' },
    ],
  },
];

const WebsiteTermsOfUse = () => {
  return (
    <PageLayout>
      <section className="bg-accent text-accent-foreground py-10 md:py-14">
        <div className="henig-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="henig-heading-display mb-4"
          >
            Website Terms of Use
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="henig-body-large text-accent-foreground/70 max-w-2xl mx-auto"
          >
            The terms that govern access to and use of the Henig Diamonds website.
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
                Version 1.0. Effective Date: 20/07/2026.
              </p>
            </article>

          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default WebsiteTermsOfUse;
