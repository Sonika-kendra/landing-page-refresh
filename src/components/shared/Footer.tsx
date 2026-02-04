import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Instagram, Linkedin, Youtube, Whatsapp } from '@/assets/footer';
import { brandConfig } from '@/config/landing/theme';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent text-accent-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-accent-foreground/10">
        <div className="henig-container py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-serif text-2xl mb-4">Newsletter Signup</h3>
            <p className="text-accent-foreground/70 mb-6 text-sm">
              Subscribe to receive updates on new collections, exclusive offers, and more.
            </p>
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-accent-foreground/5 border border-accent-foreground/20 rounded-sm text-sm placeholder:text-accent-foreground/40 focus:outline-none focus:border-primary"
              />
              <Button className="btn-henig-gold">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="henig-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <span className="text-primary text-lg">✦</span>
              <h4 className="font-serif text-xl tracking-[0.2em] mt-2">HENIG</h4>
              <span className="text-[10px] tracking-[0.3em] text-accent-foreground/60 uppercase">
                Diamonds
              </span>
            </div>
            <p className="text-sm text-accent-foreground/70 mb-6">
              A heritage of trust, innovation, and excellence in diamonds since 1973.
            </p>
            <div className="flex gap-4">
              <a target="_blank" href={brandConfig.social.twitter} className="text-accent-foreground/60 hover:text-primary transition-colors">
                <img src={Twitter} alt="Twitter" className="w-7 h-7 brightness-0 invert" />
              </a>
              <a target="_blank" href={brandConfig.social.facebook} className="text-accent-foreground/60 hover:text-primary transition-colors">
                <img src={Facebook} alt="Facebook" className="w-7 h-7 brightness-0 invert" />
              </a>
              <a target="_blank" href={brandConfig.social.instagram} className="text-accent-foreground/60 hover:text-primary transition-colors">
                <img src={Instagram} alt="Instagram" className="w-7 h-7 brightness-0 invert" />
              </a>
              <a target="_blank" href={brandConfig.social.linkedin} className="text-accent-foreground/60 hover:text-primary transition-colors">
                <img src={Linkedin} alt="Linkedin" className="w-7 h-7 brightness-0 invert" />
              </a>
              <a target="_blank" href={brandConfig.social.youtube} className="text-accent-foreground/60 hover:text-primary transition-colors">
                <img src={Youtube} alt="Youtube" className="w-7 h-7 brightness-0 invert" />
              </a>
              <a target="_blank" href={brandConfig.social.whatsApp} className="text-accent-foreground/60 hover:text-primary transition-colors">
                <img src={Whatsapp} alt="Whatsapp" className="w-7 h-7 brightness-0 invert" />
              </a>
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
                <a href="#" className="text-sm text-accent-foreground/70 hover:text-primary transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="font-serif text-lg mb-4">Customer Care</h5>
            <ul className="space-y-3">
              <li>
                <a href="#faq" className="text-sm text-accent-foreground/70 hover:text-primary transition-colors">
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
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-sm text-accent-foreground/70">+44 (0)207 404 0146</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5" />
                <a
                  href="mailto:info@henigdiamonds.co.uk"
                  className="text-sm text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  info@henigdiamonds.co.uk
                </a>
              </li>

              <li>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Henig+Diamonds+63-66+Hatton+Garden+London+EC1N+8AN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <MapPin className="w-4 h-4 text-primary mt-0.5 group-hover:text-primary/80 transition-colors" />
                  <span className="text-sm text-accent-foreground/70 group-hover:text-primary transition-colors">
                    Henig Diamonds<br />
                    Suite Two First Floor<br />
                    63-66 Hatton Garden<br />
                    London EC1N 8AN<br />
                    EC1N 8LE
                  </span>
                </a>
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
