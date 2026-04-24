import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, UserCheck, UserX, Activity, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { adminApi, AdminUser } from '@/api/admin';

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
  loading?: boolean;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <p className="text-2xl font-light">{value.toLocaleString()}</p>
      )}
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

const UserRow = ({ user }: { user: AdminUser }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
        {user.firstName[0]}{user.lastName?.[0] ?? ''}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
        <p className="text-xs text-muted-foreground truncate">{user.companyName} · {user.email}</p>
      </div>
    </div>
    <Badge variant="outline" className="text-xs shrink-0 ml-3">Pending</Badge>
  </div>
);

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats().then(r => r.data),
  });

  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ['admin', 'pending-users'],
    queryFn: () => adminApi.getPendingUsers().then(r => r.data),
  });

  const recentPending = pendingData?.users?.slice(0, 5) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light tracking-widest uppercase">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your trade platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          loading={statsLoading}
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals ?? 0}
          icon={Clock}
          description="Awaiting review"
          loading={statsLoading}
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers ?? 0}
          icon={Activity}
          description="Approved accounts"
          loading={statsLoading}
        />
        <StatCard
          title="Rejected"
          value={stats?.rejectedUsers ?? 0}
          icon={UserX}
          loading={statsLoading}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">Recent Pending Approvals</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/approvals" className="flex items-center gap-1 text-sm">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {pendingLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentPending.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserCheck className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No pending approvals</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentPending.map(user => (
                <UserRow key={user._id} user={user} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
