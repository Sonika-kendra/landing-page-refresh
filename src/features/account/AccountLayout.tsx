import { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Package, MapPin, User } from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';

const NAV = [
  { to: '/account/orders',    label: 'My Orders',    icon: Package },
  { to: '/account/addresses', label: 'Address Book', icon: MapPin },
  { to: '/account/profile',   label: 'Profile',      icon: User },
];

const AccountLayout = ({ children }: { children?: ReactNode }) => (
  <PageLayout>
    <div className="henig-container py-12">
      <h1 className="font-serif text-4xl text-foreground mb-8">My Account</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </aside>
        <div>{children ?? <Outlet />}</div>
      </div>
    </div>
  </PageLayout>
);

export default AccountLayout;
