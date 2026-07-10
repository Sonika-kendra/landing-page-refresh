import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { adminApi, StaffUser } from '@/api/admin';

const statusDot = (status: StaffUser['status']) =>
  status === 'active'
    ? 'bg-green-500'
    : 'bg-muted-foreground/40';

const InternalUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'staff'],
    queryFn: () => adminApi.getStaff({ limit: 100 }).then(r => r.data),
  });

  const staff = data?.staff ?? [];

  const displayName = (u: StaffUser) =>
    u.full_name || [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light tracking-widest uppercase">Internal Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {data?.total ?? staff.length} zoho_directory account{(data?.total ?? staff.length) !== 1 ? 's' : ''}
        </p>
      </div>

      {isLoading ? (
        <div className="bg-background rounded-sm border border-border p-5 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : staff.length === 0 ? (
        <p className="text-xs text-muted-foreground py-3 text-center border border-dashed border-border rounded-sm">
          No internal users found.
        </p>
      ) : (
        <div className="divide-y divide-border rounded-sm border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-3 py-2 bg-muted/50">
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Name / Email</span>
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Profile</span>
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Status</span>
          </div>
          {staff.map(u => (
            <div
              key={u._id}
              className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-3 py-2.5 bg-background hover:bg-muted/20 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm truncate">{displayName(u)}</p>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {u.profile?.name ?? u.role ?? '—'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(u.status)}`} />
                <span className="text-xs text-muted-foreground capitalize">{u.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternalUsers;
