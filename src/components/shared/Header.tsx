import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
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
      <div className="henig-container">
        <div className="flex items-center justify-between h-16 md:h-20">
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
                <span className="text-primary text-lg">✦✦</span>
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
<nav className="hidden md:flex items-center justify-center flex-1 relative">
  <ul className="flex items-center gap-8">
    {navigationLinks.map((link) => {
      const hasSubMenu = !!link.subLinks;

      return (
        <li key={link.label} className="relative group">
          <button
            type="button"
            className={`flex items-center gap-1 text-md font-normal transition-colors ${
              location.pathname.startsWith(link.href)
                ? 'text-primary'
                : 'text-foreground hover:text-primary'
            }`}
          >
            {link.label}

            {hasSubMenu && (
              <span className="inline-block w-3 h-3 border-b-2 border-r-2 border-foreground transform rotate-45 transition-transform duration-200 group-hover:rotate-225 group-hover:border-primary" />
            )}
          </button>

          {hasSubMenu && (
            <ul className="absolute top-full left-0 mt-3 w-48 bg-background border border-border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {link.subLinks.map((subLink) => (
                <li key={subLink.label}>
                  <Link
                    to={subLink.href}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-background"
                  >
                    {subLink.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    })}
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
{navigationLinks.map((link) => {
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const hasSubMenu = !!link.subLinks;

  return (
    <li key={link.label}>
      <button
        type="button"
        onClick={() => hasSubMenu && setOpenSubMenu((prev) => !prev)}
        className={`w-full flex items-center justify-between py-2 text-base font-normal transition-colors ${
          openSubMenu ? 'text-primary' : 'text-foreground hover:text-primary'
        }`}
      >
        <span>{link.label}</span>

        {hasSubMenu && (
          <span
            className={`inline-block w-3 h-3 border-b-2 border-r-2 border-foreground transform transition-transform duration-200 ${
              openSubMenu ? 'rotate-225 border-primary' : 'rotate-45'
            }`}
          />
        )}
      </button>

      {hasSubMenu && openSubMenu && (
        <ul className="pl-4 mt-2 space-y-2">
          {link.subLinks.map((subLink) => (
            <li key={subLink.label}>
              <Link
                to={subLink.href}
                className="block py-2 text-sm text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {subLink.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
})}


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
