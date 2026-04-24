import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { adminApi, AdminUserDetail } from '@/api/admin';

type StatusKey = 'approved' | 'pending' | 'rejected';

const STATUS_CONFIG: Record<StatusKey, { label: string; variant: 'default' | 'outline' | 'destructive'; icon: React.ElementType }> = {
  approved: { label: 'Active',    variant: 'default',     icon: CheckCircle },
  pending:  { label: 'Pending',   variant: 'outline',     icon: Clock },
  rejected: { label: 'Rejected',  variant: 'destructive', icon: XCircle },
};

const ROLES = ['user', 'admin', 'sales', 'api'] as const;

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const Field = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={name} className="text-xs tracking-wider uppercase text-muted-foreground">
      {label}
    </Label>
    <Input
      id={name}
      type={type}
      value={value}
      onChange={e => onChange(name, e.target.value)}
    />
  </div>
);

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: () => adminApi.getUserDetail(id!).then(r => r.data),
    enabled: !!id,
  });

  const [form, setForm] = useState<Partial<AdminUserDetail>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        title: user.title ?? '',
        firstName: user.firstName,
        lastName: user.lastName ?? '',
        companyName: user.companyName ?? '',
        companyWebsite: user.companyWebsite ?? '',
        phone: user.phone ?? '',
        mobileTelephone: user.mobileTelephone ?? '',
        addressLine1: user.addressLine1 ?? '',
        addressLine2: user.addressLine2 ?? '',
        city: user.city ?? '',
        county: user.county ?? '',
        postcode: user.postcode ?? '',
        country: user.country ?? '',
      });
      setDirty(false);
    }
  }, [user]);

  const handleField = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setDirty(true);
  };

  const saveMutation = useMutation({
    mutationFn: () => adminApi.updateUserDetail(id!, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setDirty(false);
      toast({ title: 'Saved', description: 'User profile updated.' });
    },
    onError: () => toast({ title: 'Error', description: 'Failed to save changes.', variant: 'destructive' }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ action, reason }: { action: 'approve' | 'reject' | 'pending'; reason?: string }) => {
      if (action === 'approve') return adminApi.approveUser(id!);
      if (action === 'reject')  return adminApi.rejectUser(id!, reason);
      return adminApi.updateUserDetail(id!, { status: 'pending' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] });
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      toast({ title: 'Updated', description: 'Account status changed.' });
    },
    onError: () => toast({ title: 'Error', description: 'Status update failed.', variant: 'destructive' }),
  });

  const roleMutation = useMutation({
    mutationFn: (role: string) => adminApi.updateUserDetail(id!, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({ title: 'Updated', description: 'Role changed.' });
    },
    onError: () => toast({ title: 'Error', description: 'Role update failed.', variant: 'destructive' }),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-sm">User not found.</p>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => navigate('/admin/users')}>
          Back to users
        </Button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[user.status as StatusKey] ?? STATUS_CONFIG.pending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/users"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All Users
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light tracking-widest uppercase">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
        </div>
        <Badge variant={statusCfg.variant} className="text-xs shrink-0">
          {statusCfg.label}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
        {/* Profile form */}
        <div className="bg-card border border-border rounded-sm p-6 space-y-5">
          <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Profile
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title"         name="title"         value={form.title ?? ''}         onChange={handleField} />
            <div /> {/* spacer */}
            <Field label="First Name"    name="firstName"     value={form.firstName ?? ''}     onChange={handleField} />
            <Field label="Last Name"     name="lastName"      value={form.lastName ?? ''}      onChange={handleField} />
            <Field label="Company"       name="companyName"   value={form.companyName ?? ''}   onChange={handleField} />
            <Field label="Website"       name="companyWebsite" value={form.companyWebsite ?? ''} onChange={handleField} />
            <Field label="Phone"         name="phone"         value={form.phone ?? ''}         onChange={handleField} />
            <Field label="Mobile"        name="mobileTelephone" value={form.mobileTelephone ?? ''} onChange={handleField} />
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Address
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Address Line 1" name="addressLine1" value={form.addressLine1 ?? ''} onChange={handleField} />
              <Field label="Address Line 2" name="addressLine2" value={form.addressLine2 ?? ''} onChange={handleField} />
              <Field label="City"           name="city"         value={form.city ?? ''}         onChange={handleField} />
              <Field label="County"         name="county"       value={form.county ?? ''}       onChange={handleField} />
              <Field label="Postcode"       name="postcode"     value={form.postcode ?? ''}     onChange={handleField} />
              <Field label="Country"        name="country"      value={form.country ?? ''}      onChange={handleField} />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!dirty || saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Role & Access sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-sm p-5 space-y-4">
            <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Role &amp; Access
            </h2>

            <div className="space-y-1.5">
              <Label className="text-xs tracking-wider uppercase text-muted-foreground">Role</Label>
              <Select
                value={user.role}
                onValueChange={role => roleMutation.mutate(role)}
                disabled={roleMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => (
                    <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs tracking-wider uppercase text-muted-foreground">Email</p>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full shrink-0 ${user.verified ? 'bg-primary' : 'bg-destructive'}`} />
                <span className="text-sm">{user.verified ? 'Verified' : 'Unverified'}</span>
              </div>
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">Account Status</p>
              {user.status !== 'approved' && (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => statusMutation.mutate({ action: 'approve' })}
                  disabled={statusMutation.isPending}
                >
                  Approve
                </Button>
              )}
              {user.status !== 'rejected' && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => statusMutation.mutate({ action: 'reject' })}
                  disabled={statusMutation.isPending}
                >
                  Reject
                </Button>
              )}
              {user.status !== 'pending' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => statusMutation.mutate({ action: 'pending' })}
                  disabled={statusMutation.isPending}
                >
                  Reset to Pending
                </Button>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-sm p-5 space-y-3">
            <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Account Info
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-right text-xs">{formatDate(user.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span className="text-right text-xs">{formatDate(user.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID</span>
                <span className="text-right text-xs font-mono text-muted-foreground truncate max-w-[120px]">
                  {user._id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
