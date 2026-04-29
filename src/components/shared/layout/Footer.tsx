import { Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstagramSvg, Linkedin, Whatsapp } from '@/assets/footer';
import { brandConfig } from '@/config/theme';
import { websiteUrlConfig, oldWebsiteURL } from '@/config/site';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Logo from '@/assets/icons/logoDark.png';

// Certification & partner logos for footer strip
const certificationModules = import.meta.glob(
  '@/assets/footer/certification/*.{png,jpg,jpeg,svg,gif}',
  { eager: true }
);
type ImageModule = string | { default: string };
const footerLogos = Object.values(certificationModules).map((mod) => {
  const image = mod as ImageModule;
  return typeof image === 'string' ? image : image.default;
});

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const handleFaqClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === websiteUrlConfig.Home) {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(websiteUrlConfig.Home, { replace: false });
      setTimeout(() => {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="relative z-10 bg-accent text-accent-foreground">

      {/* Main Footer */}
      <div className="henig-container py-14 md:py-18">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.1fr_1fr_1fr_1.4fr]">

          {/* Brand */}
          <div>
            <div className="mb-6">
              <Link to={websiteUrlConfig.Home} className="inline-flex items-center justify-center">
                <img
                  src={Logo}
                  alt="Henig Diamonds"
                  className="h-14 md:h-18 w-auto object-contain"
                />
              </Link>
            </div>

            <p className="text-base text-accent-foreground/70 mb-6">
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
            <h5 className="font-serif text-xl font-bold mb-4">Company</h5>
            <ul className="space-y-3">
              <li>
                <a
                  href={`${oldWebsiteURL}/about-us`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <Link
                  to={websiteUrlConfig.PrivacyPolicy}
                  className="text-base text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to={websiteUrlConfig.TermsAndConditions}
                  className="text-base text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  T&amp;Cs
                </Link>
              </li>
              <li>
                <Link
                  to={websiteUrlConfig.CancellationReturnsPolicy}
                  className="text-base text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  Cancellation &amp; Returns
                </Link>
              </li>
              <li>
                <Link
                  to={websiteUrlConfig.QualityPolicy}
                  className="text-base text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  Quality Policy
                </Link>
              </li>
              <li>
                <Link
                  to={websiteUrlConfig.CookiesPolicy}
                  className="text-base text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  Cookies Policy
                </Link>
              </li>
              <li>
                <Link
                  to={websiteUrlConfig.Blogs}
                  className="text-base text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  to={websiteUrlConfig.Careers}
                  className="text-base text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us — spans 2 columns */}
          <div>
            <h5 className="font-serif text-xl font-bold mb-4">Contact Us</h5>
            <ul className="space-y-4">

              {/* Phone */}
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-1 shrink-0" />
                <a
                  href="tel:+442074040146"
                  className="text-base text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  +44 (0)207 404 0146
                </a>
              </li>

              {/* Address */}
              <li>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Henig+Diamonds+63-66+Hatton+Garden+London+EC1N+8LE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <MapPin className="w-4 h-4 text-primary mt-1 shrink-0 group-hover:text-primary/80 transition-colors" />
                  <span className="text-base text-accent-foreground/70 group-hover:text-primary transition-colors">
                    Henig Diamonds Suite Two,<br />
                    First Floor,<br />
                    63-66 Hatton Garden,<br />
                    London EC1N 8LE
                  </span>
                </a>
              </li>

            </ul>
          </div>

          <div>
            <ul className="space-y-4">

              {/* Opening Hours */}
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary mt-1 shrink-0" />
                <div className="text-base text-accent-foreground/70 space-y-0.5">
                  <p>Monday To Thursday - 9:00am – 6:00pm</p>
                  <p>Friday - 9:00am – 3:30pm</p>
                  <p>Weekends &amp; Bank Holidays Closed</p>
                </div>
              </li>

              {/* Emails */}
              <li className="pl-7">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent-foreground/50 mb-2">General Enquiries</p>
                <div className="space-y-1.5">
                  <div>
                    <a
                      href="mailto:sales@henigdiamonds.co.uk"
                      className="text-base text-accent-foreground/70 hover:text-primary transition-colors"
                    >
                      sales@henigdiamonds.co.uk
                    </a>
                  </div>
                  <div>
                    <a
                      href="mailto:info@henigdiamonds.co.uk"
                      className="text-base text-accent-foreground/70 hover:text-primary transition-colors"
                    >
                      info@henigdiamonds.co.uk
                    </a>
                  </div>
                </div>
              </li>

              {/* Send Enquiry CTA */}
              <li className="pl-7 pt-1">
                <Button
                  size="sm"
                  className="btn-henig-outline"
                  asChild
                >
                  <a
                    href={websiteUrlConfig.Contact}
                    rel="noopener noreferrer"
                  >
                    SEND AN ENQUIRY
                  </a>
                </Button>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* Logo Strip */}
      {footerLogos.length > 0 && (
        <div className="border-t border-accent-foreground/10">
          <div className="henig-container py-6">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
              {footerLogos.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Partner logo ${idx + 1}`}
                  className="h-8 md:h-10 w-auto object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>
        </div>
      )}

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
