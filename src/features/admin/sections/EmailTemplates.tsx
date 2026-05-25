import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Mail, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AdminPageHeader from '../components/AdminPageHeader';
import { adminApi, SiteConfig } from '@/api/admin';
import { toast } from 'sonner';

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const AdminEmailTemplates = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['admin', 'email-templates'],
    queryFn: () => adminApi.getAllEmailTemplates().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: () => adminApi.createEmailTemplate(),
    onSuccess: (res) => navigate(`/admin/email/${res.data._id}`),
    onError: () => toast.error('Failed to create template'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'email-templates'] });
      toast.success('Template deleted');
    },
    onError: () => toast.error('Failed to delete template'),
    onSettled: () => setDeletingId(null),
  });

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteMutation.mutate(id);
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Template ID copied');
  };

  return (
    <div>
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
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
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
        <div className="border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Template ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Updated</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(templates as SiteConfig[]).map((t) => {
                const fields = t.fields as Record<string, unknown>;
                const tName    = (fields?.name    as string) || 'Untitled';
                const tSubject = (fields?.subject as string) || '—';
                return (
                  <tr key={t._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-foreground">{tName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <code className="font-mono text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                          {t._id}
                        </code>
                        <button
                          onClick={() => copyId(t._id)}
                          title="Copy template ID"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{tSubject}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{fmt(t.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/email/${t._id}`)}
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === t._id}
                          onClick={() => handleDelete(t._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEmailTemplates;
