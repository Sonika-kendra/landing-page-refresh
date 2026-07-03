import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Mail, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import AdminPageHeader from '../components/AdminPageHeader';
import { adminApi, EmailTemplateDoc } from '@/api/admin';
import { toast } from 'sonner';

const fmt = (iso: string | undefined | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const AdminEmailTemplates = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<EmailTemplateDoc | null>(null);

  const { data: templates = [], isLoading } = useQuery<EmailTemplateDoc[]>({
    queryKey: ['admin', 'email-templates'],
    queryFn: () => adminApi.getAllEmailTemplates().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: () => adminApi.createEmailTemplate(),
    onSuccess: (res) => navigate(`/admin/email/${res.data._id}`, { state: { fresh: true } }),
    onError: () => toast.error('Failed to create template'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteEmailTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'email-templates'] });
      toast.success('Template deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error('Failed to delete template'),
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Email Templates"
        description="Manage drag-and-drop email templates. Use the Template ID when calling POST /api/email-template/:id."
        actions={
          <Button size="sm" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Template
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-[4/3] w-full" />)}
        </div>
      ) : templates.length === 0 ? (
        <div className="border border-dashed border-border rounded-sm p-16 text-center">
          <Mail className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No email templates yet.</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-4"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create first template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {templates.map((t) => {
            const tName = t.name || 'Untitled';
            return (
              <div
                key={t._id}
                className="group relative aspect-[4/3] overflow-hidden bg-white border border-border cursor-pointer"
                onClick={() => navigate(`/admin/email/${t._id}`)}
              >
                {/* Email preview */}
                {t.html ? (
                  <div className="absolute inset-0 overflow-hidden bg-white">
                    <iframe
                      srcDoc={t.html}
                      className="pointer-events-none border-none"
                      style={{ width: '600px', height: '600px', transform: 'scale(0.45)', transformOrigin: 'top left' }}
                      sandbox="allow-same-origin"
                      title={tName}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                    <Mail className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Name + date + three-dot menu */}
                <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-white text-[13px] font-medium leading-snug line-clamp-2">{tName}</p>
                    <p className="text-white/60 text-[11px] mt-0.5">{fmt(t.updatedAt)}</p>
                  </div>
                  <div className="shrink-0" onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="top" align="end" className="w-32">
                        <DropdownMenuItem onClick={() => navigate(`/admin/email/${t._id}`)}>
                          <Pencil className="w-3.5 h-3.5 mr-2" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(t)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.name || 'Untitled'}" will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminEmailTemplates;
