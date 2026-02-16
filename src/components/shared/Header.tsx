import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingBag, Menu, X, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationLinks } from '@/config/landing/theme';
import Logo from '@/assets/icons/logoLight.png';

interface HeaderProps {
  onRegisterClick: () => void;
}

const Header = ({ onRegisterClick }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleEnter = (label: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveMegaMenu(label);
  };

  const handleLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 120);
  };

  const activeLink = navigationLinks.find(
    (link) => link.label === activeMegaMenu
  );

  return (
    <header className="relative sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">

      {/* ================= HEADER BAR ================= */}
      <div className="henig-container">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div className="flex-1 md:flex-none text-center">
            <Link to="/" className="inline-flex items-center justify-center">
              <img
                src={Logo}
                alt="Henig Diamonds"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <ul className="flex items-center gap-8">
              {navigationLinks.map((link) => {
                const hasMegaMenu = 'megaMenu' in link && link.megaMenu;

                return (
                  <li
                    key={link.label}
                    onMouseEnter={() => hasMegaMenu && handleEnter(link.label)}
                    onMouseLeave={handleLeave}
                  >
                    {hasMegaMenu ? (
                      <button
                        type="button"
                        className={`flex items-center gap-1 text-md font-normal transition-colors ${isActive(link.href)
                            ? 'text-primary'
                            : 'text-foreground hover:text-primary'
                          }`}
                      >
                        {link.label}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        className={`text-md font-normal transition-colors ${isActive(link.href)
                            ? 'text-primary'
                            : 'text-foreground hover:text-primary'
                          }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 md:w-1/4 justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-2 text-sm"
              onClick={onRegisterClick}
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </Button>

            <button className="p-2" onClick={onRegisterClick}>
              <Heart className="w-5 h-5" />
            </button>

            <button className="p-2 relative" onClick={onRegisterClick}>
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= FULL WIDTH MEGA MENU ================= */}
      <AnimatePresence>
        {activeLink && 'categories' in activeLink && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full w-screen bg-background border-t border-border shadow-xl z-[999]"
            onMouseEnter={() => {
              if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
            }}
            onMouseLeave={handleLeave}
          >
            <div className="henig-container py-10">
              <div className="grid grid-cols-4 gap-10">
                {activeLink.categories.map((category) => (
                  <div key={category.title}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                      {category.title}
                    </h3>

                    <ul className="space-y-3">
                      {category.links.map((subLink) => (
                        <li key={subLink.label}>
                          {'image' in subLink && subLink.image ? (
                            <a
                              href={subLink.href}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                            >
                              <img
                                src={subLink.image}
                                alt={subLink.label}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <span className="text-sm hover:text-primary transition-colors">
                                {subLink.label}
                              </span>
                            </a>
                          ) : (
                            <a
                              href={subLink.href}
                              className="block py-1.5 text-sm text-muted hover:text-primary transition-colors"
                            >
                              {subLink.label}
                            </a>
                          )}
                        </li>
                      ))}

                      {category.showAll && (
                        <li className="pt-2">
                          <a
                            href={category.showAll.href}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            {category.showAll.label} →
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ================= MOBILE NAV ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border max-h-[80vh] overflow-y-auto"
          >
            <ul className="py-4 px-4 space-y-2">
              {navigationLinks.map((link) => {
                const hasMegaMenu = 'megaMenu' in link && link.megaMenu;
                const isOpen = openMobileMenu === link.label;

                return (
                  <li key={link.label} className="border-b border-border/50 last:border-0">
                    {hasMegaMenu ? (
                      <>
                        <button
                          onClick={() =>
                            setOpenMobileMenu(isOpen ? null : link.label)
                          }
                          className="w-full flex justify-between py-3"
                        >
                          {link.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''
                              }`}
                          />
                        </button>

                        {isOpen &&
                          'categories' in link &&
                          link.categories.map((category) => (
                            <div key={category.title} className="pl-4 pb-4">
                              <ul className="space-y-1">
                                {category.links.map((subLink) => (
                                  <li key={subLink.label}>
                                    <a
                                      href={subLink.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="block py-1.5 text-sm"
                                    >
                                      {subLink.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                      </>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
