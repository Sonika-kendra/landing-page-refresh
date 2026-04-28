import { Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstagramSvg, Linkedin, Whatsapp } from '@/assets/footer';
import { brandConfig } from '@/config/theme';
import { websiteUrlConfig } from '@/config/site';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Logo from '@/assets/icons/logoDark.png';

// Certification & partner logos for footer strip
const certificationModules = import.meta.glob(
  '@/assets/landing/certification/*.{png,jpg,jpeg,svg,gif}',
  { eager: true }
);
const partnerModules = import.meta.glob(
  '@/assets/landing/partner/*.{jpg,png,webp,svg}',
  { eager: true }
);
type ImageModule = string | { default: string };
const footerLogos = [
  ...Object.values(certificationModules),
  ...Object.values(partnerModules),
].map((mod) => {
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
    <footer className="bg-accent text-accent-foreground">

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
                <Link
                  to={websiteUrlConfig.Home}
                  className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to={websiteUrlConfig.Blogs}
                  className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href={websiteUrlConfig.TermsAndConditions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a
                  href={websiteUrlConfig.PrivacyPolicy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
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
            </ul>
          </div>

          {/* Contact Us — spans 2 columns */}
          <div className="lg:col-span-2">
            <h5 className="font-serif text-lg mb-4">Contact Us</h5>
            <ul className="space-y-4">

              {/* Opening Hours */}
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="text-sm text-accent-foreground/70 space-y-0.5">
                  <p><span className="text-accent-foreground/90 font-medium">Mon – Thu:</span> 9:00am – 6:00pm</p>
                  <p><span className="text-accent-foreground/90 font-medium">Friday:</span> 9:00am – 3:30pm</p>
                  <p><span className="text-accent-foreground/90 font-medium">Weekends &amp; Bank Holidays:</span> Closed</p>
                </div>
              </li>

              {/* Phone */}
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <a
                  href="tel:+442074040146"
                  className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  +44 (0)207 404 0146
                </a>
              </li>

              {/* Emails */}
              <li className="flex items-start gap-3">
                <span className="w-4 h-4 shrink-0 mt-0.5 text-primary text-xs font-bold">@</span>
                <div className="space-y-1.5">
                  <div>
                    <p className="text-xs text-accent-foreground/60 mb-0.5">Purchase Enquiries</p>
                    <a
                      href="mailto:sales@henigdiamonds.co.uk"
                      className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                    >
                      sales@henigdiamonds.co.uk
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-accent-foreground/60 mb-0.5">General Enquiries</p>
                    <a
                      href="mailto:info@henigdiamonds.co.uk"
                      className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                    >
                      info@henigdiamonds.co.uk
                    </a>
                  </div>
                </div>
              </li>

              {/* Address */}
              <li>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Henig+Diamonds+63-66+Hatton+Garden+London+EC1N+8LE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0 group-hover:text-primary/80 transition-colors" />
                  <span className="text-sm text-accent-foreground/70 group-hover:text-primary transition-colors">
                    Henig Diamonds Suite Two,<br />
                    First Floor,<br />
                    63-66 Hatton Garden,<br />
                    London EC1N 8LE
                  </span>
                </a>
              </li>

              {/* Send Enquiry CTA */}
              <li className="pt-1">
                <a
                  href={websiteUrlConfig.Contact}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="sm"
                    className="bg-accent-foreground/10 border border-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground/20 transition-colors px-5"
                  >
                    Send an Enquiry
                  </Button>
                </a>
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
