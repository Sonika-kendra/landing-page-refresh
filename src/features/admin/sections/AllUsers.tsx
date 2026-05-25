import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DataTable from '@/components/shared/common/DataTable';
import type { ColumnDef } from '@/components/shared/common/DataTable';
import { adminApi, AdminUser } from '@/api/admin';

type StatusKey = 'draft' | 'pending' | 'approved' | 'inactive' | 'blocked' | 'rejected';

const STATUS_CONFIG: Record<
  StatusKey,
  { label: string; variant: 'default' | 'outline' | 'destructive' | 'secondary' }
> = {
  draft:    { label: 'Draft',     variant: 'secondary' },
  pending:  { label: 'Pending',   variant: 'outline' },
  approved: { label: 'Active',    variant: 'default' },
  inactive: { label: 'Inactive',  variant: 'secondary' },
  blocked:  { label: 'Blocked',   variant: 'destructive' },
  rejected: { label: 'Rejected',  variant: 'destructive' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

const COLUMNS: ColumnDef<AdminUser>[] = [
  {
    key: 'firstName',
    label: 'User',
    width: '240px',
    render: (_, user) => (
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
          {user.firstName[0]}{user.lastName?.[0] ?? ''}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'companyName',
    label: 'Company',
    render: (val) => <span className="text-sm">{(val as string) ?? '—'}</span>,
  },
  {
    key: 'createdAt',
    label: 'Registered',
    width: '140px',
    render: (val) => (
      <span className="text-xs text-muted-foreground">
        {val ? formatDate(val as string) : '—'}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    width: '110px',
    render: (val) => {
      const cfg =
        STATUS_CONFIG[val as StatusKey] ?? { label: String(val), variant: 'outline' as const };
      return <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>;
    },
  },
];

const AllUsers = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [total, setTotal] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light tracking-widest uppercase">All Users</h1>
        {total > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {total.toLocaleString()} registered account{total !== 1 ? 's' : ''}.
          </p>
        )}
      </div>

      <DataTable<AdminUser>
        key={statusFilter}
        queryKey={['admin', 'users']}
        fetchFn={(params) =>
          adminApi.getUsers({
            page: params.page,
            limit: params.pageSize,
            search: params.search,
            status: statusFilter !== 'all' ? statusFilter : undefined,
          })
        }
        dataKey="users"
        totalKey="total"
        columns={COLUMNS}
        searchable
        searchPlaceholder="Search by name, email or company…"
        defaultPageSize={10}
        emptyIcon={<Users className="h-10 w-10 opacity-25" />}
        emptyMessage="No users found."
        onRowClick={(user) => navigate(`/admin/users/${user._id}`)}
        onDataLoaded={(_, t) => setTotal(t)}
        toolbar={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-44 text-sm rounded-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
};

export default AllUsers;
