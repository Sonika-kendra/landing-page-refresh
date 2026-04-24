import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminApi } from '@/api/admin';

type StatusKey = 'approved' | 'pending' | 'rejected';

const STATUS_CONFIG: Record<
  StatusKey,
  { label: string; variant: 'default' | 'outline' | 'destructive' }
> = {
  approved: { label: 'Active', variant: 'default' },
  pending: { label: 'Pending', variant: 'outline' },
  rejected: { label: 'Rejected', variant: 'destructive' },
};

const PAGE_SIZE = 20;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const AllUsers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page, search, statusFilter],
    queryFn: () =>
      adminApi
        .getUsers({
          page,
          limit: PAGE_SIZE,
          search: search || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        })
        .then(r => r.data),
    placeholderData: prev => prev,
  });

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light tracking-widest uppercase">All Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {total.toLocaleString()} registered account{total !== 1 ? 's' : ''}.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, email or company…"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No users found.</p>
        </div>
      ) : (
        <>
          <div className="bg-background rounded-sm border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 px-4 py-3 border-b border-border bg-muted/50">
              <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                User
              </span>
              <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground hidden md:block">
                Company
              </span>
              <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground hidden md:block">
                Registered
              </span>
              <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                Status
              </span>
            </div>

            {users.map(user => {
              const statusCfg =
                STATUS_CONFIG[user.status as StatusKey] ?? { label: user.status, variant: 'outline' as const };
              return (
                <div
                  key={user._id}
                  className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 items-center px-4 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/users/${user._id}`)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                      {user.firstName[0]}{user.lastName?.[0] ?? ''}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="hidden md:block min-w-0">
                    <p className="text-sm truncate">{user.companyName ?? '—'}</p>
                  </div>

                  <div className="hidden md:block">
                    <p className="text-xs text-muted-foreground">
                      {user.createdAt ? formatDate(user.createdAt) : '—'}
                    </p>
                  </div>

                  <div>
                    <Badge variant={statusCfg.variant} className="text-xs">
                      {statusCfg.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} · {total.toLocaleString()} total
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllUsers;
