import { useState } from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, LogOut, Menu, FileText, Settings as SettingsIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/api/admin';
import { Button } from '@/components/ui/button';
import Logo from '@/assets/icons/logoDark.png';

const NAV_ITEMS = [
  { to: '/admin',           label: 'Dashboard',        icon: LayoutDashboard, exact: true },
  { to: '/admin/approvals', label: 'Pending Approvals', icon: UserCheck },
  { to: '/admin/users',     label: 'All Users',         icon: Users },
  { to: '/admin/posts',     label: 'Blog Posts',        icon: FileText },
  { to: '/admin/settings',  label: 'Settings',          icon: SettingsIcon },
];

interface SidebarNavProps {
  pendingCount: number;
  userName: string;
  userEmail: string;
  userInitials: string;
  onNavClick: () => void;
  onLogout: () => void;
}

// Sidebar is rendered on dark forest-green (bg-accent = #173731)
// so all text / icons use accent-foreground (cream #f5f5ea) palette
const SidebarNav = ({
  pendingCount,
  userName,
  userEmail,
  userInitials,
  onNavClick,
  onLogout,
}: SidebarNavProps) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="px-6 py-5 border-b border-accent-foreground/10">
      <img src={Logo} alt="Henig Admin" className="h-8 w-auto object-contain" />
      <p className="text-[10px] text-accent-foreground/50 mt-1.5 tracking-widest uppercase">
        Admin Panel
      </p>
    </div>

    {/* Nav links */}
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
        <NavLink
          key={to}
          to={to}
          end={exact}
          onClick={onNavClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
              isActive
                ? 'bg-accent-foreground/15 text-accent-foreground font-medium'
                : 'text-accent-foreground/60 hover:bg-accent-foreground/10 hover:text-accent-foreground'
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1">{label}</span>
          {label === 'Pending Approvals' && pendingCount > 0 && (
            <span className="min-w-[1.25rem] h-5 px-1.5 text-[11px] bg-primary text-primary-foreground rounded-sm flex items-center justify-center font-medium">
              {pendingCount}
            </span>
          )}
        </NavLink>
      ))}
    </nav>

    {/* User + logout */}
    <div className="px-4 py-4 border-t border-accent-foreground/10">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-8 w-8 rounded-full bg-accent-foreground/20 flex items-center justify-center text-xs font-medium text-accent-foreground shrink-0">
          {userInitials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-accent-foreground truncate">{userName}</p>
          <p className="text-xs text-accent-foreground/50 truncate">{userEmail}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 px-2 text-accent-foreground/60 hover:text-accent-foreground hover:bg-accent-foreground/10"
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  </div>
);

const AdminLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats().then(r => r.data),
    refetchInterval: 30_000,
    enabled: isAuthenticated && user?.role === 'admin',
  });

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const pendingCount   = stats?.pendingApprovals ?? 0;
  const userName       = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
  const userInitials   = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || user.email[0].toUpperCase();

  const sidebarProps: SidebarNavProps = {
    pendingCount,
    userName,
    userEmail:    user.email,
    userInitials,
    onNavClick:   () => setSidebarOpen(false),
    onLogout:     logout,
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar — dark forest green */}
      <aside className="hidden lg:flex flex-col w-64 bg-accent fixed inset-y-0 left-0 z-50">
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
            <SidebarNav {...sidebarProps} />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar — card (ivory) so it stands out from the beige body */}
        <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-3 sticky top-0 z-30">
          <button
            className="lg:hidden p-1.5 rounded-sm text-foreground/50 hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <span className="text-xs text-foreground/40 tracking-widest uppercase">
            Henig Diamonds · Admin
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
