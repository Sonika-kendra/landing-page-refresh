import { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, User, LogOut, Heart, ShoppingBag,
  LayoutDashboard, Users, UserCog, UserCheck, FileEdit, FileText,
  ShoppingCart, RefreshCw, Settings, ArrowRight, Mail, History,
  Package, MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationLinks } from '@/config/theme';
import { websiteUrlConfig } from '@/config/site';
import { productsApi } from '@/api/products';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useFavourites } from '@/context/FavouritesContext';
import { Button } from '@/components/ui/button';
import Logo from '@/assets/icons/logoLight.png';

const adminNavLinks = [
  { label: 'Dashboard',        href: '/admin',            icon: LayoutDashboard },
  { label: 'Draft Users',      href: '/admin/draft',      icon: FileEdit },
  { label: 'Pending Approvals', href: '/admin/approvals', icon: UserCheck },
  { label: 'All Users',        href: '/admin/users',      icon: Users },
  { label: 'Orders',           href: '/admin/orders',     icon: ShoppingCart },
  { label: 'Blog Posts',       href: '/admin/posts',      icon: FileText },
  { label: 'Zoho Sync',        href: '/admin/zoho',       icon: RefreshCw },
  { label: 'Email Template',   href: '/admin/email',      icon: Mail },
  { label: 'Email Logs',       href: '/admin/email-logs', icon: History },
  { label: 'Internal Users',   href: '/admin/internal-users', icon: UserCog },
  { label: 'Settings',         href: '/admin/settings',   icon: Settings },
] as const;


type MobileNavItem = {
  id: string;
  label: string;
  href?: string;
  items?: MobileNavItem[];
};

type NestedSourceItem = {
  label?: string;
  href?: string;
  subMenu?: NestedSourceItem[];
  submenu?: NestedSourceItem[];
  children?: NestedSourceItem[];
  [key: string]: unknown;
};

const getNestedItems = (
  sourceItem: NestedSourceItem,
  parentId: string
): MobileNavItem[] => {
  const nested =
    sourceItem.subMenu ?? sourceItem.submenu ?? sourceItem.children ?? [];

  if (!Array.isArray(nested)) {
    return [];
  }

  return nested
    .map((item, index: number) => {
      const safeLabel = item.label || `item-${index + 1}`;
      const itemId = `${parentId}/${safeLabel}`;
      const children = getNestedItems(item, itemId);

      return {
        id: itemId,
        label: safeLabel,
        href: item.href,
        items: children.length ? children : undefined,
      };
    })
    .filter((item) => item.label);
};

const mobileNavItems: MobileNavItem[] = navigationLinks.map((link) => {
  const linkId = `root/${link.label}`;

  if ('megaMenu' in link && link.megaMenu && 'categories' in link) {
    const categoryItems: MobileNavItem[] = link.categories.map((category) => {
      const categoryId = `${linkId}/${category.title}`;
      const childItems: MobileNavItem[] = category.links.map((subLink) => {
        const subLinkId = `${categoryId}/${subLink.label}`;
        const nestedChildren = getNestedItems(
          subLink as NestedSourceItem,
          subLinkId
        );

        return {
          id: subLinkId,
          label: subLink.label,
          href: subLink.href,
          items: nestedChildren.length ? nestedChildren : undefined,
        };
      });

      const extraItems: MobileNavItem[] = ('extraLinks' in category ? category.extraLinks : [])?.map((extraLink) => ({
        id: `${categoryId}/${extraLink.label}`,
        label: extraLink.label,
        href: extraLink.href,
      })) ?? [];

      return {
        id: categoryId,
        label: category.title,
        href: category.showAll?.href,
        items: [...childItems, ...extraItems],
      };
    });

    return {
      id: linkId,
      label: link.label,
      href: link.href,
      items: categoryItems,
    };
  }

  const nestedChildren = getNestedItems(link as NestedSourceItem, linkId);

  return {
    id: linkId,
    label: link.label,
    href: link.href,
    items: nestedChildren.length ? nestedChildren : undefined,
  };
});

const Header = () => {
  const { isAuthenticated, user, openModal, logout } = useAuth();
  const { itemCount: cartCount } = useCart();
  const { count: favCount } = useFavourites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [openMobileMenus, setOpenMobileMenus] = useState<
    Record<string, boolean>
  >({});
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [adminPanelExpanded, setAdminPanelExpanded] = useState(false);
  const adminHoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const [jewellerySubcats, setJewellerySubcats] = useState<Record<string, string[]>>({});

  useEffect(() => {
    productsApi.getSubcategories({ category: 'Jewellery' })
      .then((res) => { if (res.data?.subcategories) setJewellerySubcats(res.data.subcategories); })
      .catch(() => { /* fall back to static nav */ });
  }, []);

  const handleAdminEnter = () => {
    if (adminHoverTimeout.current) clearTimeout(adminHoverTimeout.current);
    setAdminDropdownOpen(true);
  };

  const handleAdminLeave = () => {
    adminHoverTimeout.current = setTimeout(() => setAdminDropdownOpen(false), 120);
  };

  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenMobileMenus({});
    setActiveMegaMenu(null);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === websiteUrlConfig.Home) return location.pathname === websiteUrlConfig.Home;
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

  const megaMenuCategories = useMemo(() => {
    if (!activeLink || !('categories' in activeLink)) return [];
    if (activeLink.label !== 'Jewellery' || !Object.keys(jewellerySubcats).length) {
      return activeLink.categories;
    }
    const byCategory = {
      ...activeLink.categories[0],
      links: activeLink.categories[0].links.map((link) => ({
        ...link,
        href: `/jewellery/all?cf_sub_category=${encodeURIComponent(link.label)}`,
      })),
    };
    const dynamicCols = Object.entries(jewellerySubcats).map(([subcat, types]) => ({
      title: subcat,
      links: types.map((type) => ({
        label: type,
        href: `/jewellery/all?cf_sub_category=${encodeURIComponent(subcat)}&cf_sub_category_type=${encodeURIComponent(type)}`,
      })),
    }));
    return [byCategory, ...dynamicCols];
  }, [activeLink, jewellerySubcats]);

  const toggleMobileSubmenu = (menuId: string) => {
    setOpenMobileMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMobileMenus({});
  };

  const renderMobileMenuItems = (
    items: MobileNavItem[],
    level = 0
  ): JSX.Element => {
    return (
      <ul className={level === 0 ? 'py-4 px-4 space-y-2' : 'space-y-1'}>
        {items.map((item) => {
          const hasChildren = Boolean(item.items?.length);
          const isOpen = Boolean(openMobileMenus[item.id]);
          const itemPadding = level === 0 ? 'py-3' : 'py-2';
          const itemFont = level === 0 ? 'text-sm font-semibold' : 'text-sm font-medium';
          const itemIndent = level > 0 ? 'pl-4' : '';

          return (
            <li
              key={item.id}
              className={
                level === 0 ? 'border-b border-border/50 last:border-0' : ''
              }
            >
              {hasChildren ? (
                <>
                  <div className={`flex items-center justify-between gap-2 ${itemPadding} ${itemIndent}`}>
                    {item.href ? (
                      <Link
                        to={item.href}
                        onClick={closeMobileMenu}
                        className={`min-w-0 flex-1 ${itemFont}`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className={`min-w-0 flex-1 ${itemFont}`}>
                        {item.label}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleMobileSubmenu(item.id)}
                      className="shrink-0 p-1"
                      aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label}`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && item.items && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`overflow-hidden ${level === 0 ? 'pb-3' : 'pb-2'}`}
                      >
                        {renderMobileMenuItems(item.items, level + 1)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : item.href ? (
                <Link
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={`block ${itemPadding} ${itemFont} ${itemIndent}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={`block ${itemPadding} ${itemFont} ${itemIndent}`}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <header className="relative sticky top-0 z-[1100] bg-background/95 backdrop-blur-sm border-b-4 border-accent">
      {/* HEADER BAR */}
      <div className="henig-container">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden p-2 relative z-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <div className="flex-1 text-center md:flex-none md:text-left">
            <Link to={websiteUrlConfig.Home} className="inline-flex items-center justify-center">
              <img
                src={Logo}
                alt="Henig Diamonds"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-end">
            <ul className="flex items-center gap-8">
              {navigationLinks.map((link) => {
                const hasMegaMenu = 'megaMenu' in link && link.megaMenu;
                const isMenuOpen = activeMegaMenu === link.label;
                const isLinkActive = isActive(link.href);

                return (
                  <li
                    key={link.label}
                    onMouseEnter={() => hasMegaMenu && handleEnter(link.label)}
                    onMouseLeave={handleLeave}
                  >
                    {hasMegaMenu ? (
                      <div className="flex items-center gap-1">
                        {/* Label (Navigates) */}
                        <Link
                          to={link.href}
                          className={`text-md font-semibold transition-colors ${
                            isLinkActive
                              ? 'text-primary'
                              : 'text-foreground hover:text-primary'
                          }`}
                        >
                          {link.label}
                        </Link>

                        {/* Arrow Toggle */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMegaMenu(
                              isMenuOpen ? null : link.label
                            );
                          }}
                          className={`transition-colors ${
                            isMenuOpen || isLinkActive
                              ? 'text-primary'
                              : 'text-foreground hover:text-primary'
                          }`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isMenuOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    ) : (
                      <Link
                        to={link.href}
                        className={`text-md font-semibold transition-colors ${
                          isLinkActive
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

          {/* Auth Actions */}
          <div className="flex items-center gap-3 md:gap-4 ml-4 md:ml-6 relative z-10">
            {/* Favourites */}
            <Link
              to="/wishlist"
              onClick={(e) => { if (!isAuthenticated) { e.preventDefault(); openModal('login', '/wishlist'); } }}
              aria-label={`Wishlist${favCount > 0 ? ` (${favCount})` : ''}`}
              className="relative p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Heart className="w-5 h-5" />
              {favCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                  {favCount > 9 ? '9+' : favCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              onClick={(e) => { if (!isAuthenticated) { e.preventDefault(); openModal('login', '/cart'); } }}
              aria-label={`Cart (${cartCount} items)`}
              className="relative p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            </Link>

            {/* Sign In / User */}
            {isAuthenticated && user ? (
              <>
                {/* Avatar with admin dropdown */}
                <div
                  className="relative hidden md:block"
                  onMouseEnter={handleAdminEnter}
                  onMouseLeave={handleAdminLeave}
                >
                  <button
                    type="button"
                    onClick={() => setAdminDropdownOpen((v) => !v)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold hover:opacity-85 transition-opacity"
                  >
                    {user.firstName?.[0]?.toUpperCase() ?? user.full_name?.[0]?.toUpperCase() ?? 'U'}
                  </button>

                  <AnimatePresence>
                    {adminDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-lg shadow-xl z-[1200] py-1 max-h-[80vh] overflow-y-auto"
                      >
                        {/* ── Greeting — always shown ── */}
                        <div className="px-4 py-2.5 border-b border-border">
                          <p className="text-sm font-semibold text-foreground truncate">
                            Hi, {user.full_name
                              ? user.full_name
                              : user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.firstName ?? 'there'}
                          </p>
                        </div>

                        {/* ── Account links ── */}
                        <ul className="py-1">
                          {/* Profile — always shown */}
                          <li>
                            <Link
                              to="/account/profile"
                              className="group flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors"
                            >
                              <User className="w-3.5 h-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                              <span className="flex-1">Profile</span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary" />
                            </Link>
                          </li>

                          {/* My Orders — always shown */}
                          <li className="border-t border-border">
                            <Link
                              to="/account/orders"
                              className="group flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors"
                            >
                              <Package className="w-3.5 h-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                              <span className="flex-1">My Orders</span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary" />
                            </Link>
                          </li>

                          {/* Address Book — non-admin only */}
                          {user.role !== 'admin' && user.profile?.name !== 'Administrator' && (
                            <li className="border-t border-border">
                              <Link
                                to="/account/addresses"
                                className="group flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors"
                              >
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="flex-1">Address Book</span>
                                <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary" />
                              </Link>
                            </li>
                          )}
                        </ul>

                        {/* ── Admin Panel — admin only ── */}
                        {(user.role === 'admin' || user.role === 'Administrator' || user.profile?.name === 'Administrator') && (
                          <div className="border-t border-border pb-1">
                            <button
                              type="button"
                              onClick={() => setAdminPanelExpanded((v) => !v)}
                              className="flex w-full items-center justify-between px-4 py-2"
                            >
                              <span className="text-sm font-semibold text-foreground">Admin Panel</span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                                  adminPanelExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            <AnimatePresence initial={false}>
                              {adminPanelExpanded && (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden py-1"
                                >
                                  {adminNavLinks.map(({ label, href, icon: Icon }) => (
                                    <li key={href}>
                                      <Link
                                        to={href}
                                        className="group flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors"
                                      >
                                        <Icon className="w-3.5 h-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="flex-1">{label}</span>
                                        <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary" />
                                      </Link>
                                    </li>
                                  ))}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                        {/* ── Sign out — always shown ── */}
                        <div className="border-t border-border">
                          <button
                            type="button"
                            onClick={logout}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground hover:text-primary hover:bg-secondary transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile: just logout */}
                <button
                  type="button"
                  onClick={logout}
                  aria-label="Sign out"
                  className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-2 text-sm font-semibold"
                  onClick={() => openModal('login')}
                >
                  <User className="w-4 h-4" />
                </Button>
                <button
                  type="button"
                  className="md:hidden p-2"
                  onClick={() => openModal('login')}
                  aria-label="Sign in or register"
                >
                  <User className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MEGA MENU */}
      <AnimatePresence>
        {activeLink && 'categories' in activeLink && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block absolute left-0 top-full w-screen bg-background border-t border-border shadow-xl z-[999]"
            onMouseEnter={() => {
              if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
            }}
            onMouseLeave={handleLeave}
          >
            <div className="henig-container py-10">
              <div
                className="grid gap-10"
                style={{ gridTemplateColumns: `repeat(${megaMenuCategories.length}, minmax(0, 1fr))` }}
              >
                {megaMenuCategories.map((category) => (
                  <div key={category.title}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                      {category.title}
                    </h3>

                    <ul className="space-y-3">
                      {category.links.map((subLink) => (
                        <li key={subLink.label}>
                          {'image' in subLink && subLink.image ? (
                            <Link
                              to={subLink.href}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                            >
                              <img
                                src={subLink.image}
                                alt={subLink.label}
                                loading="lazy"
                                decoding="async"
                                className="w-12 h-12 object-cover rounded"
                              />
                              <span className="text-sm font-medium hover:text-primary transition-colors">
                                {subLink.label}
                              </span>
                            </Link>
                          ) : (
                            <Link
                              to={subLink.href}
                              className="block py-1.5 text-sm text-muted-foreground font-medium hover:text-primary transition-colors"
                            >
                              {subLink.label}
                            </Link>
                          )}
                        </li>
                      ))}

                      {category.showAll && (
                        <li className="pt-2">
                          <Link
                            to={category.showAll.href}
                            className="text-sm font-semibold text-primary hover:underline"
                          >
                            {category.showAll.label} →
                          </Link>
                        </li>
                      )}

                      {'extraLinks' in category && category.extraLinks?.map((extraLink) => (
                        <li key={extraLink.label} className="pt-2">
                          <Link
                            to={extraLink.href}
                            className="text-sm font-semibold text-primary hover:underline"
                          >
                            {extraLink.label} →
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE NAV */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute left-0 top-full w-full z-[1100] md:hidden bg-background border-t border-border shadow-xl max-h-[80vh] overflow-y-auto"
          >
            {renderMobileMenuItems(mobileNavItems)}

            {/* Admin Panel Accordion */}
            {isAuthenticated && (user?.role === 'admin' || user?.role === 'Administrator') && (
              <div className="border-t border-border px-4">
                <button
                  type="button"
                  onClick={() => toggleMobileSubmenu('__admin-panel__')}
                  className="flex items-center justify-between w-full py-3 text-sm font-semibold text-foreground"
                >
                  <span>Admin Panel</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMobileMenus['__admin-panel__'] ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openMobileMenus['__admin-panel__'] && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pb-3 space-y-1"
                    >
                      {adminNavLinks.map(({ label, href, icon: Icon }) => (
                        <li key={href}>
                          <Link
                            to={href}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-2.5 py-2 pl-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            {label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Sign Out */}
            {isAuthenticated && user && (
              <div className="border-t border-border px-4 py-3">
                <button
                  type="button"
                  onClick={() => { logout(); closeMobileMenu(); }}
                  className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
