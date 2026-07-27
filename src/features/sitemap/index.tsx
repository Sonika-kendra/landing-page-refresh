import PageLayout from '@/components/shared/layout/PageLayout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { websiteUrlConfig, oldWebsiteURL } from '@/config/site';
import { ChevronRight } from 'lucide-react';

const sitemapSections = [
  {
    title: 'Main Pages',
    links: [
      { label: 'Home', href: websiteUrlConfig.Home, internal: true },
      { label: 'Diamonds', href: '/diamonds', internal: true },
      { label: 'Jewellery', href: '/jewellery', internal: true },
      { label: 'Shop All Jewellery', href: '/jewellery/all', internal: true },
      { label: 'Blogs', href: websiteUrlConfig.Blogs, internal: true },
      { label: 'Contact', href: websiteUrlConfig.Contact, internal: true },
    ],
  },
  {
    title: 'About Us',
    links: [
      { label: 'Our Story', href: `${oldWebsiteURL}/about-us`, internal: false },
      { label: 'Careers', href: websiteUrlConfig.Careers, internal: true },
    ],
  },
  {
    title: 'Legal & Policies',
    links: [
      { label: 'Privacy Policy', href: websiteUrlConfig.PrivacyPolicy, internal: true },
      { label: 'Terms & Conditions', href: websiteUrlConfig.TermsAndConditions, internal: true },
      { label: 'Supply of Goods Terms', href: websiteUrlConfig.SupplyOfGoodsTerms, internal: true },
      { label: 'Website Terms of Use', href: websiteUrlConfig.WebsiteTermsOfUse, internal: true },
      { label: 'Cancellation & Returns', href: websiteUrlConfig.CancellationReturnsPolicy, internal: true },
      { label: 'Warranty Policy', href: websiteUrlConfig.WarrantyPolicy, internal: true },
      { label: 'AML & Compliance', href: websiteUrlConfig.AmlPolicy, internal: true },
      { label: 'Quality Policy', href: websiteUrlConfig.QualityPolicy, internal: true },
      { label: 'Cookies Policy', href: websiteUrlConfig.CookiesPolicy, internal: true },
    ],
  },
  {
    title: 'My Account',
    links: [
      { label: 'My Orders', href: '/account/orders', internal: true },
      { label: 'My Wishlist', href: '/account/wishlist', internal: true },
      { label: 'Address Book', href: '/account/addresses', internal: true },
      { label: 'Profile', href: '/account/profile', internal: true },
    ],
  },
];

const SitemapPage = () => {
  return (
    <PageLayout>
      <section className="bg-accent text-accent-foreground py-10 md:py-14">
        <div className="henig-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="henig-heading-display mb-4"
          >
            Sitemap
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="henig-body-large text-accent-foreground/70 max-w-2xl mx-auto"
          >
            A complete overview of all pages on the Henig Diamonds website.
          </motion.p>
        </div>
      </section>

      <section className="pt-10 pb-16 md:pt-14 md:pb-24 section-ivory">
        <div className="henig-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sitemapSections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-card border border-border rounded-sm p-6"
              >
                <h2 className="font-serif text-lg text-foreground mb-4 pb-3 border-b border-border">
                  {section.title}
                </h2>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      {link.internal ? (
                        <Link
                          to={link.href}
                          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                        >
                          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-primary/50 group-hover:translate-x-0.5 transition-transform" />
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                        >
                          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-primary/50 group-hover:translate-x-0.5 transition-transform" />
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default SitemapPage;
