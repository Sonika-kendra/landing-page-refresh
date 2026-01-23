import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
              <a href="#" className="text-accent-foreground/60 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-accent-foreground/60 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-accent-foreground/60 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
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
                <a href="#" className="text-sm text-accent-foreground/70 hover:text-primary transition-colors">
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
                <span className="text-sm text-accent-foreground/70">+44 20 7404 0374</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-sm text-accent-foreground/70">info@henigdiamonds.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-sm text-accent-foreground/70">
                  Premier House<br />
                  12-13 Hatton Garden<br />
                  London EC1N 8AN
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-accent-foreground/10">
        <div className="henig-container py-6">
          <p className="text-center text-xs text-accent-foreground/50">
            © {currentYear} Henig Diamonds Ltd. All rights reserved. | Registered in England and Wales
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
