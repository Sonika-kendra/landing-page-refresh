import PageLayout from '@/components/shared/layout/PageLayout';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const policyNav = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Cancellation & Returns', href: '/cancellation-returns-policy' },
  { label: 'Quality Policy', href: '/quality-policy' },
  { label: 'Cookies Policy', href: '/cookies-policy' },
];

const sections = [
  {
    id: 'introduction',
    heading: 'Introduction',
    content: (
      <>
        <p>
          These Terms and Conditions ("Terms") govern the purchase and supply of goods and services
          by Henig Diamonds Ltd ("we", "us", "our"), a company registered in England and Wales,
          with its principal place of business at Suite Two, First Floor, 63–66 Hatton Garden,
          London EC1N 8LE.
        </p>
        <p className="mt-3">
          By placing an order or entering into any agreement with us, you ("the Customer") confirm
          that you have read, understood, and agree to be bound by these Terms. These Terms apply
          to all sales, services, and quotations unless otherwise agreed in writing by a director
          of Henig Diamonds Ltd.
        </p>
        <p className="mt-3">
          We reserve the right to amend these Terms at any time. The version in force at the date
          of your order will apply to that order.
        </p>
      </>
    ),
  },
  {
    id: 'definitions',
    heading: 'Definitions',
    content: (
      <>
        <p>In these Terms, the following definitions apply:</p>
        <ul className="mt-3 space-y-2 list-disc list-outside pl-5">
          <li>
            <strong>"Goods"</strong> means diamonds, gemstones, jewellery, and any other products
            supplied by us.
          </li>
          <li>
            <strong>"Order"</strong> means a purchase order placed by the Customer for Goods or
            Services.
          </li>
          <li>
            <strong>"Services"</strong> means any advisory, sourcing, or related services we
            provide alongside or independently of Goods.
          </li>
          <li>
            <strong>"Contract"</strong> means the agreement between us and the Customer for the
            supply of Goods and/or Services, incorporating these Terms.
          </li>
          <li>
            <strong>"Writing"</strong> includes email correspondence.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'quotations-orders',
    heading: 'Quotations and Orders',
    content: (
      <>
        <p>
          All quotations issued by us are valid for a period of 48 hours from the date of issue
          unless otherwise stated in writing, and are subject to availability at the time of order
          confirmation. Prices quoted are indicative and may fluctuate in line with the diamond
          market.
        </p>
        <p className="mt-3">
          An Order constitutes an offer by the Customer to purchase Goods and/or Services. No
          Order shall be deemed accepted until we issue written confirmation. We reserve the right
          to refuse or cancel any Order at our sole discretion.
        </p>
        <p className="mt-3">
          Once an Order has been accepted and confirmed in writing, cancellation by the Customer
          will only be accepted at our discretion and may be subject to a restocking or
          cancellation fee.
        </p>
      </>
    ),
  },
  {
    id: 'pricing-payment',
    heading: 'Pricing and Payment',
    content: (
      <>
        <p>
          All prices are quoted exclusive of VAT and any applicable duties unless otherwise stated.
          VAT will be applied at the prevailing rate where applicable.
        </p>
        <p className="mt-3">Payment terms are as follows unless otherwise agreed in writing:</p>
        <ul className="mt-3 space-y-2 list-disc list-outside pl-5">
          <li>Payment is due in full prior to despatch of Goods, unless credit terms have been agreed.</li>
          <li>
            Approved account customers are subject to our standard credit terms, which will be
            communicated at the time of account opening.
          </li>
          <li>
            We accept payment by bank transfer (BACS/CHAPS). Payment must be received in cleared
            funds before Goods are released.
          </li>
          <li>
            In the event of late payment, we reserve the right to charge interest on overdue
            balances at the rate prescribed by the Late Payment of Commercial Debts (Interest) Act
            1998.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'delivery-risk',
    heading: 'Delivery and Risk',
    content: (
      <>
        <p>
          Delivery dates and times given are estimates only and time is not of the essence unless
          expressly agreed in writing. We shall not be liable for any loss or damage arising from
          delay in delivery.
        </p>
        <p className="mt-3">
          Risk in the Goods passes to the Customer upon delivery. We will use reasonable endeavours
          to deliver Goods using a secure, insured courier service. The Customer is responsible for
          arranging adequate insurance for Goods once risk has passed.
        </p>
        <p className="mt-3">
          Any claim for Goods damaged or lost in transit must be reported to us in writing within
          48 hours of receipt (or expected delivery date, in the case of non-delivery).
        </p>
      </>
    ),
  },
  {
    id: 'inspection-returns',
    heading: 'Inspection and Returns',
    content: (
      <>
        <p>
          The Customer must inspect all Goods promptly upon receipt. Any defects, shortages, or
          discrepancies must be notified to us in writing within 5 working days of delivery.
          Failure to notify us within this period will be deemed acceptance of the Goods.
        </p>
        <p className="mt-3">
          Returns will only be accepted with our prior written agreement. Goods must be returned in
          their original condition, with all certificates and documentation, and using a
          suitably insured and traceable delivery method. The cost of return postage is the
          Customer's responsibility unless the Goods are found to be defective.
        </p>
        <p className="mt-3">
          Bespoke or specially sourced items may not be returned unless they are found to be
          materially defective.
        </p>
      </>
    ),
  },
  {
    id: 'title',
    heading: 'Title to Goods',
    content: (
      <p>
        Legal and beneficial title to the Goods remains with Henig Diamonds Ltd until full payment
        has been received in cleared funds. Until title passes, the Customer must store the Goods
        separately, keep them identifiable as our property, and not pledge, mortgage, charge, or
        otherwise encumber them. We reserve the right to recover Goods in respect of which title
        has not passed at any time.
      </p>
    ),
  },
  {
    id: 'warranties',
    heading: 'Warranties and Certificates',
    content: (
      <>
        <p>
          All diamonds supplied by Henig Diamonds Ltd are warranted to be conflict-free in
          accordance with the Kimberley Process Certification Scheme. Diamond grading certificates
          from recognised gemological laboratories (such as GIA, IGI, or HRD) will be provided
          where applicable and as stated in the Order confirmation.
        </p>
        <p className="mt-3">
          Save as expressly set out in these Terms, all warranties, conditions, and other terms
          implied by statute or common law are excluded to the fullest extent permitted by
          applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'limitation-liability',
    heading: 'Limitation of Liability',
    content: (
      <>
        <p>
          Nothing in these Terms shall limit or exclude our liability for: (a) death or personal
          injury caused by our negligence; (b) fraud or fraudulent misrepresentation; or (c) any
          liability that cannot be excluded or limited by English law.
        </p>
        <p className="mt-3">
          Subject to the above, our total aggregate liability to the Customer in respect of any
          Contract shall not exceed the total price paid or payable by the Customer under that
          Contract.
        </p>
        <p className="mt-3">
          We shall not be liable for any indirect, consequential, special, or incidental loss or
          damage, including loss of profit, loss of revenue, loss of business, or loss of
          anticipated savings, arising out of or in connection with any Contract.
        </p>
      </>
    ),
  },
  {
    id: 'confidentiality',
    heading: 'Confidentiality',
    content: (
      <p>
        Both parties agree to keep confidential all information disclosed by the other that is
        identified as confidential or that should reasonably be understood to be confidential,
        including but not limited to pricing, stock details, and business arrangements. This
        obligation shall survive the termination of any Contract. Neither party shall use
        confidential information for any purpose other than to perform its obligations under these
        Terms.
      </p>
    ),
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual Property',
    content: (
      <p>
        All intellectual property rights in our website, catalogues, images, and marketing
        materials remain the property of Henig Diamonds Ltd or its licensors. Nothing in these
        Terms grants the Customer any right to use our intellectual property without our prior
        written consent.
      </p>
    ),
  },
  {
    id: 'force-majeure',
    heading: 'Force Majeure',
    content: (
      <p>
        We shall not be liable for any failure or delay in performing our obligations under a
        Contract where such failure or delay results from any cause beyond our reasonable control,
        including but not limited to acts of God, natural disasters, government action, war,
        terrorism, strikes, supply chain disruption, or pandemics. In such circumstances, we will
        notify you as soon as reasonably practicable and will use reasonable endeavours to resume
        performance.
      </p>
    ),
  },
  {
    id: 'governing-law',
    heading: 'Governing Law and Jurisdiction',
    content: (
      <p>
        These Terms and any Contract shall be governed by and construed in accordance with the laws
        of England and Wales. Each party irrevocably agrees to submit to the exclusive jurisdiction
        of the courts of England and Wales in relation to any dispute or claim arising out of or in
        connection with these Terms or any Contract.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact Us',
    content: (
      <>
        <p>
          For any queries relating to these Terms and Conditions, please contact us:
        </p>
        <address className="mt-3 not-italic space-y-1 text-muted-foreground">
          <p>Henig Diamonds Ltd</p>
          <p>Suite Two, First Floor</p>
          <p>63–66 Hatton Garden</p>
          <p>London EC1N 8LE</p>
          <p className="mt-2">
            Email:{' '}
            <a href="mailto:info@henigdiamonds.co.uk" className="text-primary hover:underline">
              info@henigdiamonds.co.uk
            </a>
          </p>
          <p>
            Tel:{' '}
            <a href="tel:+442074040146" className="text-primary hover:underline">
              +44 (0)207 404 0146
            </a>
          </p>
        </address>
      </>
    ),
  },
];

const TermsAndConditions = () => {
  const { pathname } = useLocation();

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-accent text-accent-foreground py-20 md:py-28">
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
            The terms that govern the supply of goods and services by Henig Diamonds Ltd.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 section-ivory">
        <div className="henig-container">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 lg:gap-16 items-start">

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-8">
              <div className="bg-card border border-border rounded-sm p-6">
                <h3 className="font-serif text-base text-foreground mb-4 pb-3 border-b border-border">
                  Legal
                </h3>
                <nav>
                  <ul className="space-y-1">
                    {policyNav.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <li key={link.href}>
                          <Link
                            to={link.href}
                            className={`block text-sm py-2 px-3 rounded-sm transition-colors ${
                              isActive
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </aside>

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
                      {s.content}
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="mt-12 text-xs text-muted-foreground border-t border-border pt-6">
                These Terms and Conditions were last reviewed and updated in 2025.
              </p>
            </article>

          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default TermsAndConditions;
