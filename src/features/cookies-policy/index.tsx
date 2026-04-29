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
    id: 'what-are-cookies',
    heading: 'What Are Cookies?',
    content: (
      <p>
        Cookies are small text files that are stored on your device (computer, tablet, or mobile)
        when you visit a website. They are widely used to make websites work more efficiently and
        to provide information to the website owner. This Cookies Policy explains how Henig
        Diamonds Ltd ("we", "us", "our") uses cookies on our website.
      </p>
    ),
  },
  {
    id: 'types-of-cookies',
    heading: 'Types of Cookies We Use',
    content: (
      <>
        <p>We use the following categories of cookies:</p>
        <ul className="mt-3 space-y-3 list-disc list-outside pl-5">
          <li>
            <strong>Strictly Necessary Cookies:</strong> These cookies are essential for the
            website to function properly. They enable core features such as navigation, security,
            and access to certain areas. You cannot opt out of these cookies.
          </li>
          <li>
            <strong>Analytical / Performance Cookies:</strong> These cookies allow us to
            understand how visitors interact with our website by collecting and reporting
            information anonymously. This helps us improve the website's performance and content.
          </li>
          <li>
            <strong>Functionality Cookies:</strong> These cookies remember your preferences and
            choices (such as language settings) to provide a more personalised experience.
          </li>
          <li>
            <strong>Marketing / Targeting Cookies:</strong> These cookies may be set through our
            site by advertising partners. They may be used to build a profile of your interests
            and show you relevant adverts on other sites. They do not store directly personal
            information but work by uniquely identifying your browser and device.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'managing-cookies',
    heading: 'Managing Cookies',
    content: (
      <>
        <p>
          You can control and manage cookies in a number of ways. Most web browsers automatically
          accept cookies, but you can modify your browser settings to decline cookies if you
          prefer. Please note that disabling certain cookies may affect the functionality of our
          website.
        </p>
        <p className="mt-3">
          To find out more about cookies, including how to see what cookies have been set and how
          to manage and delete them, visit{' '}
          <a
            href="https://www.allaboutcookies.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            www.allaboutcookies.org
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'third-party-cookies',
    heading: 'Third-Party Cookies',
    content: (
      <p>
        Some cookies on our website are set by third parties, including analytics providers (such
        as Google Analytics) and social media platforms. We do not control these third-party
        cookies and they are subject to the respective third parties' own privacy and cookie
        policies.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to This Policy',
    content: (
      <p>
        We may update this Cookies Policy from time to time. Any changes will be published on this
        page with a revised effective date. We encourage you to review this policy periodically to
        stay informed about how we use cookies.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact Us',
    content: (
      <>
        <p>
          If you have any questions about our use of cookies, please contact us:
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

const CookiesPolicy = () => {
  const { pathname } = useLocation();

  return (
    <PageLayout>
      <section className="bg-accent text-accent-foreground py-20 md:py-28">
        <div className="henig-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="henig-heading-display mb-4"
          >
            Cookies Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="henig-body-large text-accent-foreground/70 max-w-2xl mx-auto"
          >
            How we use cookies and similar technologies on our website.
          </motion.p>
        </div>
      </section>

      <section className="py-16 md:py-24 section-ivory">
        <div className="henig-container">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 lg:gap-16 items-start">

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

export default CookiesPolicy;
