import { useState } from 'react';
import { Outlet, Navigate, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, UserCheck, LogOut, Menu, FileText, Settings as SettingsIcon, RefreshCw, FileEdit, Boxes, ShoppingCart, Mail, History, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/api/admin';
import { Button } from '@/components/ui/button';
import Logo from '@/assets/icons/logoDark.png';

const NAV_ITEMS = [
  { to: '/admin',           label: 'Dashboard',        icon: LayoutDashboard, exact: true, countKey: undefined },
  { to: '/admin/draft',     label: 'Draft Users',      icon: FileEdit,        countKey: 'draftUsers' as const },
  { to: '/admin/approvals', label: 'Pending Approvals', icon: UserCheck,      countKey: 'pendingApprovals' as const },
  { to: '/admin/users',     label: 'All Users',        icon: Users,           countKey: undefined },
  { to: '/admin/orders',    label: 'Orders',           icon: ShoppingCart,    countKey: undefined },
  { to: '/admin/posts',     label: 'Blog Posts',       icon: FileText,        countKey: undefined },
  { to: '/admin/zoho',      label: 'Zoho Sync',        icon: RefreshCw,       countKey: 'zohoOrderFormErrors' as const },
  { to: '/admin/email',     label: 'Email Template',   icon: Mail,            countKey: undefined },
  { to: '/admin/email-logs', label: 'Email Logs',      icon: History,         countKey: undefined },
  { to: '/admin/internal-users', label: 'Internal Users', icon: UserCog,      countKey: undefined },
  { to: '/admin/settings',  label: 'Settings',         icon: SettingsIcon,    countKey: undefined },
];

interface SidebarNavProps {
  counts: Record<string, number>;
  userName: string;
  userEmail: string;
  userInitials: string;
  collapsed: boolean;
  onNavClick: () => void;
  onLogout: () => void;
  onToggleCollapse?: () => void;
}

// Sidebar is rendered on dark forest-green (bg-accent = #173731)
// so all text / icons use accent-foreground (cream #f5f5ea) palette
const SidebarNav = ({
  counts,
  userName,
  userEmail,
  userInitials,
  collapsed,
  onNavClick,
  onLogout,
  onToggleCollapse,
}: SidebarNavProps) => (
  <div className="flex flex-col h-full overflow-hidden">
    {/* Logo */}
    <div className={`py-5 border-b border-accent-foreground/10 ${collapsed ? 'px-3' : 'px-6'}`}>
      {collapsed ? (
        <div className="flex flex-col items-center gap-3">
          <Link to="/"><img src={Logo} alt="Henig Admin" className="h-6 w-6 object-contain" /></Link>
          {onToggleCollapse && (
            <button
              className="p-1.5 rounded-sm text-accent-foreground/50 hover:text-accent-foreground hover:bg-accent-foreground/10 transition-colors"
              onClick={onToggleCollapse}
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div>
            <Link to="/"><img src={Logo} alt="Henig Admin" className="h-8 w-auto object-contain" /></Link>
            <p className="text-[10px] text-accent-foreground/50 mt-1.5 tracking-widest uppercase">
              Admin Panel
            </p>
          </div>
          {onToggleCollapse && (
            <button
              className="p-1.5 rounded-sm text-accent-foreground/50 hover:text-accent-foreground hover:bg-accent-foreground/10 transition-colors"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>

    {/* Nav links */}
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {NAV_ITEMS.map(({ to, label, icon: Icon, exact, countKey }) => {
        const count = countKey ? (counts[countKey] ?? 0) : 0;
        return (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={onNavClick}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-sm text-sm transition-colors ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'} ${
                isActive
                  ? 'bg-accent-foreground/15 text-accent-foreground font-medium'
                  : 'text-accent-foreground/60 hover:bg-accent-foreground/10 hover:text-accent-foreground'
              }`
            }
          >
            <div className="relative shrink-0">
              <Icon className="h-4 w-4" />
              {collapsed && count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[1rem] h-4 px-1 text-[9px] bg-primary text-primary-foreground rounded-sm flex items-center justify-center font-medium">
                  {count}
                </span>
              )}
            </div>
            {!collapsed && <span className="flex-1">{label}</span>}
            {!collapsed && count > 0 && (
              <span className="min-w-[1.25rem] h-5 px-1.5 text-[11px] bg-primary text-primary-foreground rounded-sm flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>

    {/* User + logout */}
    <div className={`py-4 border-t border-accent-foreground/10 ${collapsed ? 'px-2' : 'px-4'}`}>
      {!collapsed && (
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-accent-foreground/20 flex items-center justify-center text-xs font-medium text-accent-foreground shrink-0">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-accent-foreground truncate">{userName}</p>
            <p className="text-xs text-accent-foreground/50 truncate">{userEmail}</p>
          </div>
        </div>
      )}
      <Button
        variant="ghost"
        size="sm"
        title={collapsed ? 'Sign Out' : undefined}
        className={`w-full gap-2 px-2 text-accent-foreground/60 hover:text-accent-foreground hover:bg-accent-foreground/10 ${collapsed ? 'justify-center' : 'justify-start'}`}
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        {!collapsed && 'Sign Out'}
      </Button>
    </div>
  </div>
);

const AdminLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats().then(r => r.data),
    refetchInterval: 30_000,
    enabled: isAuthenticated && (user?.role === 'admin' || user?.profile?.name === 'Administrator'),
  });

  const isAdmin = user?.role === 'admin' || user?.profile?.name === 'Administrator';
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const userName     = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
  const userInitials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || user.email[0].toUpperCase();

  const sidebarProps: SidebarNavProps = {
    counts: {
      draftUsers:          stats?.draftUsers          ?? 0,
      pendingApprovals:    stats?.pendingApprovals     ?? 0,
      zohoOrderFormErrors: stats?.zohoOrderFormErrors  ?? 0,
    },
    userName,
    userEmail:        user.email,
    userInitials,
    collapsed:        sidebarCollapsed,
    onNavClick:       () => setSidebarOpen(false),
    onLogout:         logout,
    onToggleCollapse: () => setSidebarCollapsed(v => !v),
  };

  const desktopSidebarWidth = sidebarCollapsed ? 'w-16' : 'w-64';
  const mainPaddingLeft     = sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar — dark forest green */}
      <aside className={`hidden lg:flex flex-col ${desktopSidebarWidth} bg-accent fixed inset-y-0 left-0 z-50 transition-[width] duration-200`}>
        <SidebarNav {...sidebarProps} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-accent lg:hidden">
            <SidebarNav {...{ ...sidebarProps, collapsed: false, onToggleCollapse: undefined }} />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className={`flex-1 ${mainPaddingLeft} flex flex-col min-h-screen transition-[padding] duration-200`}>
        {/* Top bar — card (ivory) so it stands out from the beige body */}
        <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-3 sticky top-0 z-30">
          {/* Mobile open */}
          <button
            className="lg:hidden p-1.5 rounded-sm text-foreground/50 hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
<div className="flex-1" />
          <span className="text-xs text-foreground/40 tracking-widest uppercase">
            <Link to="/" className="hover:text-foreground/70 transition-colors">Henig Diamonds</Link>
            {' · Admin'}
          </span>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
