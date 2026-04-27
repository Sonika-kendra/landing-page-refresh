import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, XCircle, Clock, MinusCircle, ShieldOff, FileEdit, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { adminApi, AdminUserDetail, UserStatusLogEntry } from '@/api/admin';

type StatusKey = 'draft' | 'pending' | 'approved' | 'inactive' | 'blocked' | 'rejected';

const STATUS_CONFIG: Record<StatusKey, {
  label: string;
  variant: 'default' | 'outline' | 'destructive' | 'secondary';
  icon: React.ElementType;
}> = {
  draft:    { label: 'Draft',    variant: 'secondary',    icon: FileEdit },
  pending:  { label: 'Pending',  variant: 'outline',      icon: Clock },
  approved: { label: 'Active',   variant: 'default',      icon: CheckCircle },
  inactive: { label: 'Inactive', variant: 'secondary',    icon: MinusCircle },
  blocked:  { label: 'Blocked',  variant: 'destructive',  icon: ShieldOff },
  rejected: { label: 'Rejected', variant: 'destructive',  icon: XCircle },
};

const ROLES = ['user', 'admin', 'sales', 'api', 'client', 'internalUser'] as const;

const ALL_SCOPES = [
  'products:read', 'products:create', 'products:update', 'products:delete',
  'orders:read',   'orders:create',   'orders:update',   'orders:delete',
  'users:read',    'users:create',    'users:manage',
  'reports:read',  'settings:read',   'settings:update', 'roles:assign',
  'profile:read',  'profile:update',
];

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

const Field = ({
  label, name, value, onChange, type = 'text',
}: {
  label: string; name: string; value: string;
  onChange: (name: string, value: string) => void; type?: string;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={name} className="text-xs tracking-wider uppercase text-muted-foreground">
      {label}
    </Label>
    <Input id={name} type={type} value={value} onChange={e => onChange(name, e.target.value)} />
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

  const { data: logData } = useQuery({
    queryKey: ['admin', 'user', id, 'status-log'],
    queryFn: () => adminApi.getStatusLog(id!).then(r => r.data),
    enabled: !!id,
  });

  const [form, setForm] = useState<Partial<AdminUserDetail>>({});
  const [dirty, setDirty] = useState(false);
  const [scopesDirty, setScopesDirty] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  // Reason dialog state
  const [reasonDialog, setReasonDialog] = useState<{
    action: 'reject' | 'block' | 'deactivate' | null;
    reason: string;
  }>({ action: null, reason: '' });

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
      setSelectedScopes(user.scopes ?? []);
      setDirty(false);
      setScopesDirty(false);
    }
  }, [user]);

  const handleField = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setDirty(true);
  };

  const toggleScope = (scope: string) => {
    setSelectedScopes(prev =>
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
    setScopesDirty(true);
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

  const roleMutation = useMutation({
    mutationFn: (role: string) => adminApi.assignRole(id!, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({ title: 'Updated', description: 'Role changed.' });
    },
    onError: () => toast({ title: 'Error', description: 'Role update failed.', variant: 'destructive' }),
  });

  const scopesMutation = useMutation({
    mutationFn: () => adminApi.assignScopes(id!, selectedScopes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] });
      setScopesDirty(false);
      toast({ title: 'Saved', description: 'Scopes updated.' });
    },
    onError: () => toast({ title: 'Error', description: 'Scopes update failed.', variant: 'destructive' }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ action, reason }: {
      action: 'approve' | 'reject' | 'block' | 'unblock' | 'activate' | 'deactivate';
      reason?: string;
    }) => {
      switch (action) {
        case 'approve':    return adminApi.approveUser(id!);
        case 'reject':     return adminApi.rejectUser(id!, reason);
        case 'block':      return adminApi.blockUser(id!, reason);
        case 'unblock':    return adminApi.unblockUser(id!);
        case 'activate':   return adminApi.activateUser(id!);
        case 'deactivate': return adminApi.deactivateUser(id!, reason);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id, 'status-log'] });
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      toast({ title: 'Updated', description: 'Account status changed.' });
    },
    onError: () => toast({ title: 'Error', description: 'Status update failed.', variant: 'destructive' }),
  });

  const handleStatusAction = (
    action: 'approve' | 'reject' | 'block' | 'unblock' | 'activate' | 'deactivate'
  ) => {
    if (action === 'reject' || action === 'block' || action === 'deactivate') {
      setReasonDialog({ action, reason: '' });
    } else {
      statusMutation.mutate({ action });
    }
  };

  const confirmReasonAction = () => {
    if (!reasonDialog.action) return;
    statusMutation.mutate({ action: reasonDialog.action, reason: reasonDialog.reason || undefined });
    setReasonDialog({ action: null, reason: '' });
  };

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
  const logs: UserStatusLogEntry[] = logData?.logs ?? [];

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
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-sm p-6 space-y-5">
            <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Profile
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title"         name="title"           value={form.title ?? ''}           onChange={handleField} />
              <div />
              <Field label="First Name"    name="firstName"       value={form.firstName ?? ''}       onChange={handleField} />
              <Field label="Last Name"     name="lastName"        value={form.lastName ?? ''}        onChange={handleField} />
              <Field label="Company"       name="companyName"     value={form.companyName ?? ''}     onChange={handleField} />
              <Field label="Website"       name="companyWebsite"  value={form.companyWebsite ?? ''}  onChange={handleField} />
              <Field label="Phone"         name="phone"           value={form.phone ?? ''}           onChange={handleField} />
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

          {/* Scopes */}
          <div className="bg-card border border-border rounded-sm p-6 space-y-4">
            <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Permission Scopes
            </h2>
            <div className="flex flex-wrap gap-2">
              {ALL_SCOPES.map(scope => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => toggleScope(scope)}
                  className={`px-2.5 py-1 rounded-sm text-xs border transition-colors ${
                    selectedScopes.includes(scope)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-foreground/30'
                  }`}
                >
                  {scope}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scopesMutation.mutate()}
                disabled={!scopesDirty || scopesMutation.isPending}
              >
                {scopesMutation.isPending ? 'Saving…' : 'Save Scopes'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Role & Access */}
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

            {/* Status lifecycle actions */}
            <div className="border-t border-border pt-3 space-y-2">
              <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">Account Status</p>

              {user.status !== 'approved' && user.status !== 'blocked' && (
                <Button variant="default" size="sm" className="w-full"
                  onClick={() => handleStatusAction('approve')}
                  disabled={statusMutation.isPending}>
                  Approve / Activate
                </Button>
              )}
              {user.status === 'approved' && (
                <Button variant="outline" size="sm" className="w-full"
                  onClick={() => handleStatusAction('deactivate')}
                  disabled={statusMutation.isPending}>
                  Deactivate
                </Button>
              )}
              {user.status !== 'blocked' ? (
                <Button variant="destructive" size="sm" className="w-full"
                  onClick={() => handleStatusAction('block')}
                  disabled={statusMutation.isPending}>
                  Block
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="w-full"
                  onClick={() => handleStatusAction('unblock')}
                  disabled={statusMutation.isPending}>
                  Unblock
                </Button>
              )}
              {user.status !== 'rejected' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleStatusAction('reject')}
                  disabled={statusMutation.isPending}>
                  Reject
                </Button>
              )}
            </div>
          </div>

          {/* Account Info */}
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

      {/* Status Audit Trail */}
      {logs.length > 0 && (
        <div className="bg-card border border-border rounded-sm p-6 space-y-4">
          <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-2">
            <History className="h-4 w-4" />
            Status Audit Trail
          </h2>
          <div className="space-y-0 divide-y divide-border">
            {logs.map(log => (
              <div key={log._id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium capitalize">{log.action.replace('-', ' ')}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {log.fromStatus && (
                      <>
                        <span className="capitalize">{log.fromStatus}</span>
                        <span>→</span>
                      </>
                    )}
                    <span className="capitalize font-medium text-foreground">{log.toStatus}</span>
                  </div>
                  {log.reason && (
                    <p className="text-xs text-muted-foreground italic">"{log.reason}"</p>
                  )}
                  {log.changedBy && (
                    <p className="text-xs text-muted-foreground">
                      by {log.changedBy.firstName} {log.changedBy.lastName ?? ''} ({log.changedBy.email})
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                  {formatDate(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reason dialog (reject / block / deactivate) */}
      <AlertDialog
        open={!!reasonDialog.action}
        onOpenChange={open => { if (!open) setReasonDialog({ action: null, reason: '' }); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="capitalize">
              {reasonDialog.action} Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              {reasonDialog.action === 'block'
                ? 'Block this user from accessing the platform. You can optionally provide a reason.'
                : reasonDialog.action === 'deactivate'
                ? 'Deactivate this account. You can optionally provide a reason.'
                : 'Reject this account application. The user will be notified.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Reason (optional)"
            value={reasonDialog.reason}
            onChange={e => setReasonDialog(prev => ({ ...prev, reason: e.target.value }))}
            className="min-h-[80px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmReasonAction}
              disabled={statusMutation.isPending}
            >
              {statusMutation.isPending ? 'Updating…' : `Confirm ${reasonDialog.action}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserDetail;
