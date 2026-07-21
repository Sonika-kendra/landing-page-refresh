import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users, UserX, Activity, Clock, FileEdit, Building2, History,
  ShoppingCart, ShoppingBag, PackageX, Newspaper, RefreshCw, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { adminApi, ActivityLogEntry } from '@/api/admin';

// One accent per section (fixed, never cycled) — cards inside a section share it;
// "flag" overrides to the destructive tint when a card's own value needs attention.
type Tint = 'primary' | 'accent' | 'muted' | 'flag';

const TINT_CLASSES: Record<Tint, string> = {
  primary: 'bg-primary/10 text-primary',
  accent:  'bg-accent/10 text-accent',
  muted:   'bg-muted text-muted-foreground',
  flag:    'bg-destructive/10 text-destructive',
};

const formatStat = (n: number) =>
  n >= 10000
    ? new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
    : n.toLocaleString();

const ACTION_LABELS: Record<string, string> = {
  approve: 'approved',
  reject: 'rejected',
  block: 'blocked',
  unblock: 'unblocked',
  activate: 'activated',
  deactivate: 'deactivated',
  'submit-draft': 'submitted',
  'role-change': 'changed role for',
  'scope-change': 'changed scopes for',
  delete: 'deleted',
};

const ACTION_VARIANT: Record<string, 'default' | 'outline' | 'destructive' | 'secondary'> = {
  approve: 'default',
  activate: 'default',
  reject: 'destructive',
  block: 'destructive',
  delete: 'destructive',
  unblock: 'secondary',
  deactivate: 'secondary',
  'submit-draft': 'outline',
  'role-change': 'outline',
  'scope-change': 'outline',
};

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  loading,
  to,
  tint = 'muted',
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
  loading?: boolean;
  to?: string;
  tint?: Tint;
}) => {
  const card = (
    <Card
      className={cn(
        'group relative h-full overflow-hidden',
        to && 'transition-colors hover:border-foreground/30 hover:bg-muted/20',
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground truncate">{title}</CardTitle>
        <span className={cn('flex h-7 w-7 items-center justify-center rounded-full shrink-0', TINT_CLASSES[tint])}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {loading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <p className="text-2xl font-medium">{formatStat(value)}</p>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1 truncate">{description}</p>}
      </CardContent>
      {to && (
        <ChevronRight className="absolute right-2.5 bottom-2.5 h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0" />
      )}
    </Card>
  );

  return to ? <Link to={to} className="block h-full">{card}</Link> : card;
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground pb-1 border-b border-border/60">
    {children}
  </h2>
);

const ActivityRow = ({ entry }: { entry: ActivityLogEntry }) => {
  const target = entry.userId
    ? [entry.userId.firstName, entry.userId.lastName].filter(Boolean).join(' ') || entry.userId.email
    : 'a user';
  const actor = entry.changedBy
    ? [entry.changedBy.firstName, entry.changedBy.lastName].filter(Boolean).join(' ') || entry.changedBy.email
    : 'Someone';
  const label = ACTION_LABELS[entry.action] ?? entry.action;

  return (
    <div className="flex items-center justify-between py-3 gap-3">
      <div className="min-w-0">
        <p className="text-sm truncate">
          <span className="font-medium">{actor}</span> {label} <span className="font-medium">{target}</span>
        </p>
        <p className="text-xs text-muted-foreground truncate">{formatWhen(entry.createdAt)}</p>
      </div>
      <Badge variant={ACTION_VARIANT[entry.action] ?? 'outline'} className="text-xs shrink-0 capitalize">
        {entry.action.replace('-', ' ')}
      </Badge>
    </div>
  );
};

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats().then(r => r.data),
  });

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['admin', 'activity'],
    queryFn: () => adminApi.getRecentActivity(10).then(r => r.data),
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['admin', 'posts'],
    queryFn: () => adminApi.getPosts().then(r => r.data),
  });

  const recentActivity = activityData?.logs ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light tracking-widest uppercase">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your trade platform.</p>
      </div>

      <div className="space-y-3">
        <SectionHeading>Users</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers ?? 0}
            icon={Users}
            loading={statsLoading}
            to="/admin/users"
            tint="primary"
          />
          <StatCard
            title="Draft Users"
            value={stats?.draftUsers ?? 0}
            icon={FileEdit}
            description="Awaiting verification"
            loading={statsLoading}
            to="/admin/draft"
            tint="primary"
          />
          <StatCard
            title="Pending Approvals"
            value={stats?.pendingApprovals ?? 0}
            icon={Clock}
            description="Awaiting review"
            loading={statsLoading}
            to="/admin/approvals"
            tint="primary"
          />
          <StatCard
            title="Active Users"
            value={stats?.activeUsers ?? 0}
            icon={Activity}
            description="Approved accounts"
            loading={statsLoading}
            to="/admin/users?status=approved"
            tint="primary"
          />
          <StatCard
            title="Rejected"
            value={stats?.rejectedUsers ?? 0}
            icon={UserX}
            loading={statsLoading}
            to="/admin/users?status=rejected"
            tint={(stats?.rejectedUsers ?? 0) > 0 ? 'flag' : 'muted'}
          />
          <StatCard
            title="Zoho Contacts"
            value={stats?.zohoContactsCount ?? 0}
            icon={Building2}
            description="Synced from Zoho"
            loading={statsLoading}
            to="/admin/users?tab=zoho"
            tint="primary"
          />
        </div>
      </div>

      <div className="space-y-3">
        <SectionHeading>Commerce</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders ?? 0}
            icon={ShoppingBag}
            loading={statsLoading}
            to="/admin/orders"
            tint="accent"
          />
          <StatCard
            title="Active Carts"
            value={stats?.activeCarts ?? 0}
            icon={ShoppingCart}
            description="In-progress checkouts"
            loading={statsLoading}
            to="/admin/orders?status=draft"
            tint="accent"
          />
          <StatCard
            title="Low Stock Items"
            value={stats?.lowStockCount ?? 0}
            icon={PackageX}
            description="5 units or fewer"
            loading={statsLoading}
            to="/admin/products"
            tint={(stats?.lowStockCount ?? 0) > 0 ? 'flag' : 'accent'}
          />
        </div>
      </div>

      <div className="space-y-3">
        <SectionHeading>Content & Sync</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <StatCard
            title="Blog Posts"
            value={posts?.length ?? 0}
            icon={Newspaper}
            loading={postsLoading}
            to="/admin/posts"
            tint="muted"
          />
          <StatCard
            title="Zoho Sync Errors"
            value={stats?.zohoSyncErrors ?? 0}
            icon={RefreshCw}
            description="Last 7 days"
            loading={statsLoading}
            to="/admin/zoho"
            tint={(stats?.zohoSyncErrors ?? 0) > 0 ? 'flag' : 'muted'}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Recent Admin Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No admin activity yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentActivity.map(entry => (
                <ActivityRow key={entry._id} entry={entry} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
