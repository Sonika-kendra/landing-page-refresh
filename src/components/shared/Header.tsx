import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationLinks } from '@/config/landing/theme';

interface HeaderProps {
  onRegisterClick: () => void;
}

const Header = ({ onRegisterClick }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">

      {/* Main header */}
      <div className="henig-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Search - Desktop */}
          {/* <div className="hidden md:flex items-center w-1/4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-48 pl-4 pr-10 py-2 text-sm border border-border rounded bg-transparent focus:outline-none focus:border-primary"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            </div>
          </div> */}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div className="flex-1 md:flex-none text-center">
            <Link to="/" className="inline-block">
              <div className="flex flex-col items-center">
                <span className="text-primary text-lg">✦</span>
                <h1 className="font-serif text-xl md:text-2xl font-medium tracking-[0.2em] text-foreground">
                  HENIG
                </h1>
                <span className="text-[10px] tracking-[0.3em] text-muted uppercase">
                  Diamonds
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <ul className="flex items-center gap-8">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className={`text-md font-normal transition-colors ${
                      location.pathname === link.href
                        ? 'text-primary'
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
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
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className={`block py-2 text-base font-normal transition-colors ${
                      location.pathname === link.href
                        ? 'text-primary'
                        : 'text-foreground hover:text-primary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
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
