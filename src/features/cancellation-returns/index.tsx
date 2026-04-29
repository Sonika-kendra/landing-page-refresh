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
    id: 'overview',
    heading: 'Overview',
    content: (
      <p>
        This Cancellation &amp; Returns Policy sets out the terms under which Henig Diamonds Ltd
        ("we", "us", "our") handles order cancellations and returns. As a trade supplier serving
        registered jewellery professionals, our policy reflects the business-to-business nature of
        our transactions. Please read this policy carefully before placing an order.
      </p>
    ),
  },
  {
    id: 'cancellations',
    heading: 'Order Cancellations',
    content: (
      <>
        <p>
          Once an order has been confirmed and accepted by Henig Diamonds Ltd, cancellations may
          only be accepted at our discretion. To request a cancellation, please contact us as soon
          as possible at{' '}
          <a href="mailto:sales@henigdiamonds.co.uk" className="text-primary hover:underline">
            sales@henigdiamonds.co.uk
          </a>{' '}
          or call{' '}
          <a href="tel:+442074040146" className="text-primary hover:underline">
            +44 (0)207 404 0146
          </a>
          .
        </p>
        <p className="mt-3">
          Orders that have already been dispatched cannot be cancelled. Any cancellation charges or
          restocking fees will be communicated at the time of the cancellation request.
        </p>
      </>
    ),
  },
  {
    id: 'returns',
    heading: 'Returns',
    content: (
      <>
        <p>
          Returns are accepted only where goods are found to be faulty or not as described at the
          time of delivery. All returns must be authorised in advance. To initiate a return, please
          contact our sales team within 7 days of receipt of goods.
        </p>
        <p className="mt-3">
          Goods must be returned in their original condition, undamaged, and in their original
          packaging. Henig Diamonds Ltd reserves the right to refuse returns that do not meet these
          conditions.
        </p>
      </>
    ),
  },
  {
    id: 'bespoke',
    heading: 'Bespoke & Special Orders',
    content: (
      <p>
        Bespoke, made-to-order, and specially sourced items cannot be cancelled or returned once
        production has commenced, unless the goods are found to be faulty. Please ensure all
        specifications are correct before confirming such orders.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact Us',
    content: (
      <>
        <p>
          For any cancellation or returns enquiries, please contact our team:
        </p>
        <address className="mt-3 not-italic space-y-1 text-muted-foreground">
          <p>Henig Diamonds Ltd</p>
          <p>Suite Two, First Floor</p>
          <p>63–66 Hatton Garden</p>
          <p>London EC1N 8LE</p>
          <p className="mt-2">
            Email:{' '}
            <a href="mailto:sales@henigdiamonds.co.uk" className="text-primary hover:underline">
              sales@henigdiamonds.co.uk
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

const CancellationReturnsPolicy = () => {
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
            Cancellation &amp; Returns Policy
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

export default CancellationReturnsPolicy;
