import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, InstagramSvg, Linkedin, Youtube, Whatsapp } from '@/assets/footer';
import { brandConfig } from '@/config/landing/theme';
import { websiteUrlConfig } from '@/config/config';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Logo from '@/assets/icons/logoDark.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  // Smooth scroll to FAQ section
  const handleFaqClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (location.pathname === websiteUrlConfig.Home) {
      const faqSection = document.getElementById('faq');
      faqSection?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(websiteUrlConfig.Home, { replace: false });
      setTimeout(() => {
        const faqSection = document.getElementById('faq');
        faqSection?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="bg-accent text-accent-foreground">

      {/* Newsletter Section */}
      {/* <div className="border-b border-accent-foreground/10">
        <div className="henig-container py-10 md:py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-serif text-xl sm:text-2xl mb-3 md:mb-4">Newsletter Signup</h3>
            <p className="text-accent-foreground/70 mb-5 md:mb-6 text-xs sm:text-sm leading-relaxed">
              Subscribe to receive updates on new collections, exclusive offers, and more.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 items-stretch">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full flex-1 h-12 sm:h-14 px-4 sm:px-5 bg-accent-foreground/5 border border-accent-foreground/20 rounded-sm text-base sm:text-base placeholder:text-accent-foreground/40 focus:outline-none focus:border-primary"
              />
              <Button className="btn-henig-gold h-8 sm:h-14 py-0 px-6 w-full sm:w-auto text-xs sm:text-sm">Subscribe</Button>
            </form>
          </div>
        </div>
      </div> */}

      {/* Main Footer */}
      <div className="henig-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">

          {/* Brand */}
          <div>
            <div className="mb-6">
              <Link to={websiteUrlConfig.Home} className="inline-flex items-center justify-center">
                <img
                  src={Logo}
                  alt="Henig Diamonds"
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </Link>
            </div>

            <p className="text-sm text-accent-foreground/70 mb-6">
              A heritage of trust, innovation, and excellence in diamonds since 1973.
            </p>

            <div className="flex gap-4">
              {[
                { href: brandConfig.social.linkedin, src: Linkedin, alt: "Linkedin" },
                { href: brandConfig.social.instagram, src: InstagramSvg, alt: "Instagram" },
                { href: brandConfig.social.whatsApp, src: Whatsapp, alt: "Whatsapp" },
              ].map(({ href, src, alt }) => (
                <a
                  key={alt}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={href}
                  className="text-accent-foreground/60 hover:text-primary transition-colors"
                >
                  <img src={src} alt={alt} className="w-7 h-7 brightness-0 invert" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h5 className="font-serif text-lg mb-4">Company</h5>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-accent-foreground/70 hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-accent-foreground/70 hover:text-primary transition-colors">
                  Why Henig
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-accent-foreground/70 hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <Link
                  to={websiteUrlConfig.Blogs}
                  className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="font-serif text-lg mb-4">Customer Care</h5>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  onClick={handleFaqClick}
                  className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-accent-foreground/70 hover:text-primary transition-colors">
                  How to Order
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-accent-foreground/70 hover:text-primary transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-accent-foreground/70 hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-serif text-lg mb-4">Contact Us</h5>
            <ul className="space-y-4">

              {/* Phone */}
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-sm text-accent-foreground/70">+44 (0)207 404 0146</span>
              </li>

              {/* Emails */}
              {/* <li>
                <h6 className="text-sm font-medium text-accent-foreground/80 mb-1">Emails</h6>
                <ul className="space-y-1 ml-6">
                  <li className="flex items-center gap-2">
                    <span className="text-sm text-accent-foreground/70">Purchase Enquiries:</span>
                    <a
                      href="mailto:sales@henigdiamonds.co.uk"
                      className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                    >
                      sales@henigdiamonds.co.uk
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sm text-accent-foreground/70">Info:</span>
                    <a
                      href="mailto:info@henigdiamonds.co.uk"
                      className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                    >
                      info@henigdiamonds.co.uk
                    </a>
                  </li>
                </ul>
              </li> */}

              {/* Address */}
              <li>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Henig+Diamonds+63-66+Hatton+Garden+London+EC1N+8AN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <MapPin className="w-4 h-4 text-primary mt-0.5 group-hover:text-primary/80 transition-colors" />
                  <span className="text-sm text-accent-foreground/70 group-hover:text-primary transition-colors">
                    Henig Diamonds Suite Two,<br />
                    First Floor,<br />
                    63-66 Hatton Garden,<br />
                    London EC1N 8LE
                  </span>
                </a>
              </li>

            </ul>
          </div>

          {/* Emails */}
          <div>
            <h5 className="font-serif text-lg mb-4">Email</h5>
            <ul className="space-y-4">
              <li>
                <ul className="space-y-2">
                  <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                    <span className="text-sm font-medium text-accent-foreground/80 w-40 md:w-auto">
                      Purchase Enquiries
                    </span>

                  </li>
                  <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 ml-2">
                    <a
                      href="mailto:sales@henigdiamonds.co.uk"
                      className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                    >
                      sales@henigdiamonds.co.uk
                    </a>
                  </li>
                  <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                    <span className="text-sm font-medium text-accent-foreground/80 w-40 md:w-auto">
                      General Enquiries
                    </span>
                  </li>
                  <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 ml-2">
                    <a
                      href="mailto:info@henigdiamonds.co.uk"
                      className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                    >
                      info@henigdiamonds.co.uk
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-accent-foreground/10">
        <div className="henig-container py-6">
          <p className="text-center text-xs text-accent-foreground/50">
            © {currentYear} Henig Diamonds Ltd. All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
