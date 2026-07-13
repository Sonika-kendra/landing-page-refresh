import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DataTable from '@/components/shared/common/DataTable';
import type { ColumnDef } from '@/components/shared/common/DataTable';
import { adminApi, AdminUser, ZohoContactRow } from '@/api/admin';

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

// Organisation-type contacts often have no top-level email — fall back to the
// primary (or first) contact person's email/name.
const primaryContactPerson = (contact: ZohoContactRow) =>
  contact.contactPersons?.find((p) => p.isPrimaryContact) ?? contact.contactPersons?.[0];

const CONTACT_COLUMNS: ColumnDef<ZohoContactRow>[] = [
  {
    key: 'name',
    label: 'Contact',
    width: '220px',
    render: (_, contact) => (
      <p className="text-sm font-medium truncate">{contact.name || '—'}</p>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    width: '260px',
    render: (_, contact) => {
      const person = primaryContactPerson(contact);
      const email = contact.email || person?.email;
      const personName = [person?.firstName, person?.lastName].filter(Boolean).join(' ');
      return (
        <div className="min-w-0">
          <p className="text-sm truncate">{email || '—'}</p>
          {!contact.email && personName && (
            <p className="text-xs text-muted-foreground truncate">{personName}</p>
          )}
        </div>
      );
    },
  },
  {
    key: 'companyName',
    label: 'Company',
    render: (val) => <span className="text-sm">{(val as string) ?? '—'}</span>,
  },
  {
    key: 'phone',
    label: 'Phone',
    width: '140px',
    render: (val) => <span className="text-sm">{(val as string) ?? '—'}</span>,
  },
  {
    key: 'status',
    label: 'Status',
    width: '110px',
    render: (val) => (
      <Badge variant="outline" className="text-xs capitalize">{(val as string) || 'unknown'}</Badge>
    ),
  },
];

const AllUsers = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Dashboard stat cards deep-link here via ?status= and ?tab= — read once as the initial value.
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? 'all');
  const [total, setTotal] = useState(0);
  const [contactTotal, setContactTotal] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light tracking-widest uppercase">All Users</h1>
      </div>

      <Tabs defaultValue={searchParams.get('tab') === 'zoho' ? 'zoho' : 'clients'}>
        <TabsList>
          <TabsTrigger value="clients">Client Users{total > 0 ? ` (${total})` : ''}</TabsTrigger>
          <TabsTrigger value="zoho">Zoho Contacts{contactTotal > 0 ? ` (${contactTotal})` : ''}</TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
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
        </TabsContent>

        <TabsContent value="zoho">
          <DataTable<ZohoContactRow>
            queryKey={['admin', 'zoho-contacts']}
            fetchFn={(params) =>
              adminApi.getZohoContacts({
                page: params.page,
                limit: params.pageSize,
                search: params.search,
              })
            }
            dataKey="contacts"
            totalKey="total"
            columns={CONTACT_COLUMNS}
            searchable
            searchPlaceholder="Search by name, email or company…"
            defaultPageSize={10}
            emptyIcon={<Users className="h-10 w-10 opacity-25" />}
            emptyMessage="No Zoho contacts found."
            onDataLoaded={(_, t) => setContactTotal(t)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllUsers;
