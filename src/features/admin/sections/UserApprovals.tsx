import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import DataTable from '@/components/shared/common/DataTable';
import type { ColumnDef } from '@/components/shared/common/DataTable';
import { adminApi, AdminUser } from '@/api/admin';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

const UserApprovals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rejectTarget, setRejectTarget] = useState<AdminUser | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminApi.approveUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      toast({ title: 'User Approved', description: 'The account is now active.' });
    },
    onError: () =>
      toast({ title: 'Error', description: 'Failed to approve user.', variant: 'destructive' }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminApi.rejectUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      toast({ title: 'User Rejected', description: 'The applicant has been notified.' });
      setRejectTarget(null);
      setRejectReason('');
    },
    onError: () =>
      toast({ title: 'Error', description: 'Failed to reject user.', variant: 'destructive' }),
  });

  const columns: ColumnDef<AdminUser>[] = [
    {
      key: 'firstName',
      label: 'Applicant',
      width: '240px',
      render: (_, user) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent shrink-0">
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
      render: (_, user) => (
        <div className="min-w-0">
          <p className="text-sm truncate">{user.companyName ?? '—'}</p>
          {user.phone && (
            <p className="text-xs text-muted-foreground truncate">{user.phone}</p>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Applied',
      width: '130px',
      render: (val) => (
        <span className="text-xs text-muted-foreground">
          {val ? formatDate(val as string) : '—'}
        </span>
      ),
    },
    {
      key: '_id',
      label: 'Actions',
      width: '160px',
      align: 'right',
      render: (_, user) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            className="h-8 px-3 gap-1.5 btn-henig-gold text-xs"
            onClick={(e) => { e.stopPropagation(); approveMutation.mutate(user._id); }}
            disabled={approveMutation.isPending}
          >
            <Check className="h-3.5 w-3.5" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 gap-1.5 text-xs text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
            onClick={(e) => { e.stopPropagation(); setRejectTarget(user); }}
            disabled={rejectMutation.isPending}
          >
            <X className="h-3.5 w-3.5" />
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable<AdminUser>
        queryKey={['admin', 'pending-users']}
        fetchFn={() => adminApi.getPendingUsers()}
        dataKey="users"
        columns={columns}
        clientSidePagination
        clientSideSearchFn={(u, q) =>
          `${u.firstName} ${u.lastName} ${u.email} ${u.companyName ?? ''}`
            .toLowerCase()
            .includes(q.toLowerCase())
        }
        searchable
        searchPlaceholder="Search by name, email or company…"
        title="Pending Approvals"
        emptyIcon={<UserCheck className="h-10 w-10 opacity-25" />}
        emptyMessage="No pending approvals."
      />

      <AlertDialog
        open={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open) { setRejectTarget(null); setRejectReason(''); }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Account Application</AlertDialogTitle>
            <AlertDialogDescription>
              Reject{' '}
              <strong>{rejectTarget?.firstName} {rejectTarget?.lastName}</strong>
              {rejectTarget?.companyName
                ? <> from <strong>{rejectTarget.companyName}</strong></>
                : ''}?{' '}
              You can optionally include a reason.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Reason for rejection (optional, will be sent to the applicant)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[80px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                rejectTarget &&
                rejectMutation.mutate({
                  id: rejectTarget._id,
                  reason: rejectReason || undefined,
                })
              }
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? 'Rejecting…' : 'Reject Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserApprovals;
