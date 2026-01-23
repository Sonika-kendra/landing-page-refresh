import { useState } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onRegisterClick: () => void;
}

const Header = ({ onRegisterClick }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Diamonds', href: '#diamonds' },
    { label: 'Jewellery', href: '#jewellery' },
    { label: 'Events & Blogs', href: '#blog' },
    { label: 'Contact us', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top announcement bar */}
      <div className="bg-accent text-accent-foreground py-2 text-center">
        <p className="text-xs md:text-sm font-light tracking-wide">
          Christmas except for Castings. Order Castings by 22/12 (9:30AM). We close for Christmas Tuesday 23rd December and will return Monday 6th January 2026.
        </p>
      </div>

      {/* Main header */}
      <div className="henig-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Search - Desktop */}
          <div className="hidden md:flex items-center w-1/4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-48 pl-4 pr-10 py-2 text-sm border border-border rounded bg-transparent focus:outline-none focus:border-primary"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div className="flex-1 md:flex-none text-center">
            <a href="#" className="inline-block">
              <div className="flex flex-col items-center">
                <span className="text-primary text-lg">✦</span>
                <h1 className="font-serif text-xl md:text-2xl font-medium tracking-[0.2em] text-foreground">
                  HENIG
                </h1>
                <span className="text-[10px] tracking-[0.3em] text-muted uppercase">
                  Diamonds
                </span>
              </div>
            </a>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-normal text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4 w-auto md:w-1/4 justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-2 text-sm font-normal hover:text-primary"
              onClick={onRegisterClick}
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </Button>
            <button className="p-2 hover:text-primary transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 hover:text-primary transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <ul className="py-4 px-4 space-y-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="block py-2 text-base font-normal text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onRegisterClick();
                  }}
                >
                  Sign In / Register
                </Button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
