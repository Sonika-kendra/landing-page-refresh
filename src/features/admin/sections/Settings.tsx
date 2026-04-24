import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { adminApi, SiteConfig } from '@/api/admin';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const Settings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editConfig, setEditConfig] = useState<SiteConfig | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['admin', 'configs'],
    queryFn: () => adminApi.getConfigs().then(r => r.data),
  });

  const openEdit = (config: SiteConfig) => {
    setEditConfig(config);
    setJsonText(JSON.stringify(config.fields, null, 2));
    setJsonError('');
  };

  const handleJsonChange = (value: string) => {
    setJsonText(value);
    try {
      JSON.parse(value);
      setJsonError('');
    } catch {
      setJsonError('Invalid JSON — fix before saving.');
    }
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const fields = JSON.parse(jsonText);
      return adminApi.updateConfig(editConfig!._id, { fields });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'configs'] });
      setEditConfig(null);
      toast({ title: 'Config saved' });
    },
    onError: () =>
      toast({ title: 'Error', description: 'Failed to save config.', variant: 'destructive' }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light tracking-widest uppercase">Site Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {configs.length} configuration{configs.length !== 1 ? 's' : ''} loaded.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : configs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Settings2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No configurations found.</p>
        </div>
      ) : (
        <div className="bg-background rounded-sm border border-border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 border-b border-border bg-muted/50">
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Type</span>
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground hidden sm:block">Updated</span>
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Edit</span>
          </div>

          {configs.map(config => (
            <div
              key={config._id}
              className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate font-mono">{config.type}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {Object.keys(config.fields).length} field{Object.keys(config.fields).length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(config.updatedAt)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEdit(config)}
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editConfig} onOpenChange={open => !open && setEditConfig(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-light tracking-widest uppercase">
              {editConfig?.type}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Label className="text-xs tracking-wider uppercase text-muted-foreground">
              Fields (JSON)
            </Label>
            <Textarea
              value={jsonText}
              onChange={e => handleJsonChange(e.target.value)}
              rows={18}
              className="font-mono text-xs"
              spellCheck={false}
            />
            {jsonError && (
              <p className="text-xs text-destructive">{jsonError}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditConfig(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!!jsonError || saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving…' : 'Save Config'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
