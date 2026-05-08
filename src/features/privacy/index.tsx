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
          Henig Diamonds Ltd ("we", "us", "our") is committed to protecting your personal data and
          respecting your privacy. This Privacy Policy explains how we collect, use, store, and
          protect your personal information when you interact with us — whether through our website,
          in person at our offices, or by any other means of communication.
        </p>
        <p className="mt-3">
          We are registered in England and Wales. Our registered office is Suite Two, First Floor,
          63–66 Hatton Garden, London EC1N 8LE. We are the data controller for the personal
          information we hold about you.
        </p>
        <p className="mt-3">
          Please read this policy carefully. If you have any questions, you can contact us at{' '}
          <a href="mailto:info@henigdiamonds.co.uk" className="text-primary hover:underline">
            info@henigdiamonds.co.uk
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    heading: 'Information We Collect',
    content: (
      <>
        <p>We may collect and process the following categories of personal data:</p>
        <ul className="mt-3 space-y-2 list-disc list-outside pl-5">
          <li>
            <strong>Identity data:</strong> your name, title, company name, and position.
          </li>
          <li>
            <strong>Contact data:</strong> your email address, telephone number, and business or
            billing address.
          </li>
          <li>
            <strong>Transaction data:</strong> details of orders placed, invoices, payments, and
            goods purchased or enquired about.
          </li>
          <li>
            <strong>Technical data:</strong> IP address, browser type and version, pages visited,
            and other diagnostic data when you use our website.
          </li>
          <li>
            <strong>Communications data:</strong> any correspondence you send us by email,
            telephone, or post.
          </li>
          <li>
            <strong>Marketing preferences:</strong> your choices regarding receiving marketing
            communications from us.
          </li>
        </ul>
        <p className="mt-3">
          We collect this information directly from you, from third parties such as referral
          partners, or automatically through the use of cookies and similar technologies on our
          website.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use',
    heading: 'How We Use Your Information',
    content: (
      <>
        <p>We use your personal data for the following purposes:</p>
        <ul className="mt-3 space-y-2 list-disc list-outside pl-5">
          <li>To process and fulfil orders, quotations, and enquiries.</li>
          <li>To manage our business relationship with you.</li>
          <li>To send you pricing, availability updates, and other relevant trade information.</li>
          <li>
            To comply with our legal and regulatory obligations, including anti-money laundering
            (AML) and know-your-customer (KYC) requirements.
          </li>
          <li>To improve our website and services through analytics.</li>
          <li>
            To send you marketing communications where you have consented or where we have a
            legitimate business interest in doing so.
          </li>
          <li>To respond to enquiries, complaints, or disputes.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'legal-basis',
    heading: 'Legal Basis for Processing',
    content: (
      <>
        <p>
          Under the UK General Data Protection Regulation (UK GDPR), we rely on the following legal
          bases to process your personal data:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-outside pl-5">
          <li>
            <strong>Contract:</strong> processing is necessary to perform a contract with you or to
            take steps at your request before entering into one.
          </li>
          <li>
            <strong>Legal obligation:</strong> processing is necessary to comply with a legal
            obligation (e.g., AML regulations, tax requirements).
          </li>
          <li>
            <strong>Legitimate interests:</strong> processing is necessary for our legitimate
            business interests, such as maintaining trade relationships and improving our services,
            where these interests are not overridden by your rights.
          </li>
          <li>
            <strong>Consent:</strong> where you have given clear and specific consent for us to
            process your data for a particular purpose (e.g., marketing communications).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-sharing',
    heading: 'Who We Share Your Information With',
    content: (
      <>
        <p>
          We do not sell your personal data to third parties. We may share your data with:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-outside pl-5">
          <li>
            <strong>Service providers and processors:</strong> companies that provide services on
            our behalf, such as IT systems, courier and logistics partners, accounting software, and
            email service providers. These parties are bound by data processing agreements and may
            only use your data as instructed by us.
          </li>
          <li>
            <strong>Professional advisers:</strong> lawyers, accountants, auditors, and insurers
            where necessary in the course of providing professional services to us.
          </li>
          <li>
            <strong>Regulatory authorities:</strong> government bodies, law enforcement agencies,
            or other authorities where we are required or permitted to do so by law.
          </li>
          <li>
            <strong>Business transfers:</strong> in the event of a merger, acquisition, or sale of
            all or part of our business.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-retention',
    heading: 'Data Retention',
    content: (
      <p>
        We retain your personal data only for as long as necessary to fulfil the purposes for which
        it was collected, including to satisfy any legal, accounting, or reporting requirements.
        Trade and financial records are typically retained for a minimum of six years in accordance
        with UK tax and commercial law. Where data is no longer required, we will securely delete
        or anonymise it.
      </p>
    ),
  },
  {
    id: 'your-rights',
    heading: 'Your Rights Under UK GDPR',
    content: (
      <>
        <p>You have the following rights in relation to your personal data:</p>
        <ul className="mt-3 space-y-2 list-disc list-outside pl-5">
          <li>
            <strong>Right of access:</strong> to request a copy of the personal data we hold about
            you.
          </li>
          <li>
            <strong>Right to rectification:</strong> to request correction of inaccurate or
            incomplete data.
          </li>
          <li>
            <strong>Right to erasure:</strong> to request deletion of your data in certain
            circumstances.
          </li>
          <li>
            <strong>Right to restrict processing:</strong> to ask us to limit how we use your data.
          </li>
          <li>
            <strong>Right to data portability:</strong> to receive your data in a structured,
            machine-readable format.
          </li>
          <li>
            <strong>Right to object:</strong> to object to processing based on legitimate interests
            or for direct marketing purposes.
          </li>
          <li>
            <strong>Rights related to automated decision-making:</strong> we do not use solely
            automated decision-making processes that produce legal or similarly significant effects.
          </li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, please contact us at{' '}
          <a href="mailto:info@henigdiamonds.co.uk" className="text-primary hover:underline">
            info@henigdiamonds.co.uk
          </a>
          . You also have the right to lodge a complaint with the Information Commissioner's Office
          (ICO) at{' '}
          <a
            href="https://ico.org.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            ico.org.uk
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    heading: 'Cookies',
    content: (
      <p>
        Our website uses cookies to distinguish you from other users and to improve your browsing
        experience. Cookies are small text files stored on your device. We use strictly necessary
        cookies (required for the site to function), analytical cookies (to understand how the site
        is used), and, where you have consented, marketing cookies. You may disable cookies in your
        browser settings; however, some parts of our website may not function as intended as a
        result.
      </p>
    ),
  },
  {
    id: 'security',
    heading: 'Security',
    content: (
      <p>
        We implement appropriate technical and organisational measures to protect your personal data
        against unauthorised access, loss, alteration, or disclosure. Access to personal data is
        restricted to employees and contractors who need it to perform their duties, and all
        personnel are bound by confidentiality obligations. In the event of a personal data breach
        that is likely to result in risk to your rights and freedoms, we will notify the relevant
        supervisory authority and, where required, you directly, in accordance with applicable law.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to This Policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this
        page with a revised effective date. We encourage you to review this policy periodically.
        Continued use of our website or services after any update constitutes acceptance of the
        revised policy.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact Us',
    content: (
      <>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or how we
          handle your personal data, please contact us:
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

const PrivacyPolicy = () => {
  const { pathname } = useLocation();

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
      <section className="py-16 md:py-24 section-ivory">
        <div className="henig-container">
          <div>

            <nav className="mb-10 border-b border-border">
              <ul className="flex flex-wrap gap-x-1 justify-center">
                {policyNav.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className={`block text-sm py-2 px-4 -mb-px border-b-2 transition-colors ${
                          isActive
                            ? 'border-primary text-primary font-medium'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

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
                This policy was last reviewed and updated in 2025.
              </p>
            </article>

          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default PrivacyPolicy;
