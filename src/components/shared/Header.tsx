import { useState } from 'react';
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
            <Link to="/" className="inline-flex items-center justify-center">
              <img
                src={Logo}
                alt="Henig Diamonds"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center justify-center flex-1 relative">
            <ul className="flex items-center gap-8">
              {navigationLinks.map((link) => {
                const hasMegaMenu = 'megaMenu' in link && link.megaMenu;

                return (
                  <li
                    key={link.label}
                    className="relative group"
                    onMouseEnter={() => hasMegaMenu && setActiveMegaMenu(link.label)}
                    onMouseLeave={() => setActiveMegaMenu(null)}
                  >
                    {/* Desktop: Button for mega menu, Link for normal */}
                    {hasMegaMenu ? (
                      <button
                        type="button"
                        className={`flex items-center gap-1 text-md font-normal transition-colors ${location.pathname.startsWith(link.href)
                          ? 'text-primary'
                          : 'text-foreground hover:text-primary'
                          }`}
                      >
                        {link.label}
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        className={`flex items-center gap-1 text-md font-normal transition-colors ${location.pathname.startsWith(link.href)
                          ? 'text-primary'
                          : 'text-foreground hover:text-primary'
                          }`}
                      >
                        {link.label}
                      </Link>
                    )}

                    {/* Mega Menu */}
                    {hasMegaMenu && 'categories' in link && (
                      <AnimatePresence>
                        {activeMegaMenu === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="fixed left-0 right-0 top-full mt-0 bg-background border-t border-border shadow-xl z-50"
                          >
                            <div className="henig-container py-8">
                              <div className="grid grid-cols-4 gap-8">
                                {link.categories.map((category) => (
                                  <div key={category.title}>
                                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                                      {category.title}
                                    </h3>
                                    <ul className="space-y-2">
                                      {category.links.map((subLink) => (
                                        <li key={subLink.label}>
                                          {'image' in subLink && subLink.image ? (
                                            <a
                                              href={subLink.href}
                                              className="group/item flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                                            >
                                              <img
                                                src={subLink.image}
                                                alt={subLink.label}
                                                className="w-12 h-12 object-cover rounded"
                                              />
                                              <span className="text-sm text-foreground group-hover/item:text-primary transition-colors">
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
              onClick={onRegisterClick} // triggers modal
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </Button>

            <button
              className="p-2 hover:text-primary transition-colors"
              onClick={onRegisterClick} // triggers modal
            >
              <Heart className="w-5 h-5" />
            </button>

            <button
              className="p-2 hover:text-primary transition-colors relative"
              onClick={onRegisterClick} // triggers modal
            >
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
            className="md:hidden bg-background border-t border-border max-h-[80vh] overflow-y-auto"
          >
            <ul className="py-4 px-4 space-y-2">
              {navigationLinks.map((link) => {
                const hasMegaMenu = 'megaMenu' in link && link.megaMenu;
                const [openSubMenu, setOpenSubMenu] = useState(false);

                return (
                  <li key={link.label} className="border-b border-border/50 last:border-0">
                    {hasMegaMenu ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setOpenSubMenu((prev) => !prev)}
                          className={`w-full flex items-center justify-between py-3 text-base font-normal transition-colors ${openSubMenu ? 'text-primary' : 'text-foreground hover:text-primary'
                            }`}
                        >
                          <span>{link.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${openSubMenu ? 'rotate-180' : ''}`}
                          />
                        </button>

                        {openSubMenu && 'categories' in link && (
                          <div className="pl-4 pb-4 space-y-4">
                            {link.categories.map((category) => (
                              <div key={category.title}>
                                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                  {category.title}
                                </h4>
                                <ul className="space-y-1">
                                  {category.links.map((subLink) => (
                                    <li key={subLink.label}>
                                      <a
                                        href={subLink.href}
                                        className="block py-1.5 text-sm text-foreground hover:text-primary"
                                        onClick={() => setMobileMenuOpen(false)}
                                      >
                                        {subLink.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={link.href}
                        className="w-full block py-3 text-base font-normal text-foreground hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}

              <li className="pt-2">
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
