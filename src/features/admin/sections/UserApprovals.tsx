import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Search, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { adminApi, AdminUser } from '@/api/admin';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const UserApprovals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [rejectTarget, setRejectTarget] = useState<AdminUser | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'pending-users'],
    queryFn: () => adminApi.getPendingUsers().then(r => r.data),
  });

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

  const filtered = (data?.users ?? []).filter(
    u =>
      search === '' ||
      `${u.firstName} ${u.lastName} ${u.email} ${u.companyName}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light tracking-widest uppercase">Pending Approvals</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {data?.users?.length ?? 0} applicant
          {(data?.users?.length ?? 0) !== 1 ? 's' : ''} awaiting review.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by name, email or company…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{search ? 'No results found.' : 'No pending approvals.'}</p>
        </div>
      ) : (
        <div className="bg-background rounded-sm border border-border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1.5fr_1fr_auto] gap-4 px-4 py-3 border-b border-border bg-muted/50">
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
              Applicant
            </span>
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground hidden md:block">
              Company
            </span>
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground hidden md:block">
              Applied
            </span>
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
              Actions
            </span>
          </div>

          {filtered.map(user => (
            <div
              key={user._id}
              className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1.5fr_1fr_auto] gap-4 items-center px-4 py-4 border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent shrink-0">
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
                {user.phone && (
                  <p className="text-xs text-muted-foreground truncate">{user.phone}</p>
                )}
              </div>

              <div className="hidden md:block">
                <p className="text-xs text-muted-foreground">
                  {user.createdAt ? formatDate(user.createdAt) : '—'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  className="h-8 px-3 gap-1.5 btn-henig-gold text-xs"
                  onClick={() => approveMutation.mutate(user._id)}
                  disabled={approveMutation.isPending}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Approve</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 gap-1.5 text-xs text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
                  onClick={() => setRejectTarget(user)}
                  disabled={rejectMutation.isPending}
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Reject</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!rejectTarget}
        onOpenChange={open => {
          if (!open) {
            setRejectTarget(null);
            setRejectReason('');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Account Application</AlertDialogTitle>
            <AlertDialogDescription>
              Reject{' '}
              <strong>
                {rejectTarget?.firstName} {rejectTarget?.lastName}
              </strong>{' '}
              from <strong>{rejectTarget?.companyName}</strong>? You can optionally include a
              reason.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Reason for rejection (optional, will be sent to the applicant)"
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
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
    </div>
  );
};

export default UserApprovals;
