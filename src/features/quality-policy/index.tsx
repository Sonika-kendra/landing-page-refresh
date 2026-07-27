import PageLayout from '@/components/shared/layout/PageLayout';
import { motion } from 'framer-motion';
import PolicyTabs from '@/components/shared/policy/PolicyTabs';

const sections = [
  {
    id: 'commitment',
    heading: 'Our Commitment to Quality',
    content: (
      <p>
        At Henig Diamonds Ltd, quality is at the heart of everything we do. Since 1973, we have
        built our reputation on supplying diamonds and fine jewellery of the highest standard to
        the trade. Our Quality Policy reflects our ongoing commitment to excellence in products,
        service, and business practices.
      </p>
    ),
  },
  {
    id: 'standards',
    heading: 'Product Standards',
    content: (
      <>
        <p>All diamonds and jewellery supplied by Henig Diamonds Ltd are:</p>
        <ul className="mt-3 space-y-2 list-disc list-outside pl-5">
          <li>Sourced from reputable and ethical suppliers.</li>
          <li>Graded and certified by internationally recognised gemological laboratories where applicable (including IGI, GIA).</li>
          <li>Inspected for quality before dispatch.</li>
          <li>Accurately described in terms of weight, colour, clarity, and cut grades.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ethical',
    heading: 'Ethical Sourcing',
    content: (
      <p>
        We are committed to the responsible sourcing of diamonds and precious materials. We comply
        with the Kimberley Process Certification Scheme and work only with suppliers who adhere to
        ethical trade standards. We continually review our supply chain to ensure compliance with
        anti-money laundering (AML) regulations and modern slavery legislation.
      </p>
    ),
  },
  {
    id: 'continuous-improvement',
    heading: 'Continuous Improvement',
    content: (
      <p>
        We are committed to continuous improvement in all areas of our operations. We regularly
        review our processes, seek feedback from our trade customers, and invest in staff training
        to ensure that we maintain the highest standards of product quality and customer service.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact Us',
    content: (
      <>
        <p>For quality-related enquiries, please contact us:</p>
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

const QualityPolicy = () => {
  return (
    <PageLayout>
      <section className="bg-accent text-accent-foreground py-10 md:py-14">
        <div className="henig-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="henig-heading-display mb-4"
          >
            Quality Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="henig-body-large text-accent-foreground/70 max-w-2xl mx-auto"
          >
            Our commitment to the highest standards in diamonds and jewellery.
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

export default QualityPolicy;
