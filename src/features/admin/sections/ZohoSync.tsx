import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { adminApi, ZohoSyncLog } from '@/api/admin';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const DIRECTIONS = [
  { value: '', label: 'All directions' },
  { value: 'zoho_to_mongo', label: 'Zoho → DB' },
  { value: 'mongo_to_zoho', label: 'DB → Zoho' },
];

const STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'success', label: 'Success' },
  { value: 'error', label: 'Error' },
];

const StatusIcon = ({ status }: { status: ZohoSyncLog['status'] }) =>
  status === 'success'
    ? <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
    : <XCircle className="h-4 w-4 text-destructive shrink-0" />;

const ZohoSync = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [moduleFilter, setModuleFilter]       = useState('');
  const [directionFilter, setDirectionFilter] = useState('');
  const [statusFilter, setStatusFilter]       = useState('');

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['admin', 'zoho', 'status'],
    queryFn: () => adminApi.getZohoStatus().then(r => r.data),
  });

  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['admin', 'zoho', 'logs', moduleFilter, directionFilter, statusFilter],
    queryFn: () =>
      adminApi.getZohoLogs({
        ...(moduleFilter && { module: moduleFilter }),
        ...(directionFilter && { direction: directionFilter }),
        ...(statusFilter && { status: statusFilter }),
      }).then(r => r.data),
  });

  const syncAllMutation = useMutation({
    mutationFn: () => adminApi.zohoSyncAll().then(r => r.data),
    onSuccess: () => {
      toast({ title: 'Full sync started', description: 'Running in background — logs will update shortly.' });
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['admin', 'zoho', 'logs'] }), 3000);
    },
    onError: () => toast({ title: 'Sync failed', variant: 'destructive' }),
  });

  const syncModuleMutation = useMutation({
    mutationFn: (module: string) => adminApi.zohoSyncModule(module).then(r => r.data),
    onSuccess: (data, module) => {
      toast({
        title: `${module} synced`,
        description: `${data.synced ?? 0} records synced, ${data.errors ?? 0} errors.`,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'zoho', 'logs'] });
    },
    onError: (_err, module) =>
      toast({ title: `Failed to sync ${module}`, variant: 'destructive' }),
  });

  const modules = statusData?.modules ?? [];
  const logs    = logsData?.logs ?? [];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-light tracking-widest uppercase">Zoho Sync</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage Zoho Inventory integration and sync logs.
          </p>
        </div>
        <Button
          onClick={() => syncAllMutation.mutate()}
          disabled={syncAllMutation.isPending || !statusData?.configured}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${syncAllMutation.isPending ? 'animate-spin' : ''}`} />
          {syncAllMutation.isPending ? 'Starting…' : 'Full Sync'}
        </Button>
      </div>

      {/* Status card */}
      <div className="bg-card border border-border rounded-sm p-5 space-y-4">
        <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Integration Status
        </h2>

        {statusLoading ? (
          <div className="flex gap-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-40" />
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusData?.configured ? 'text-green-700' : 'text-destructive'}`}>
              {statusData?.configured
                ? <CheckCircle className="h-4 w-4" />
                : <AlertCircle className="h-4 w-4" />}
              {statusData?.configured ? 'Connected' : 'Not configured'}
            </span>
            {statusData?.configured && (
              <span className="text-xs text-muted-foreground">
                Modules: {modules.join(', ')}
              </span>
            )}
          </div>
        )}

        {/* Per-module sync buttons */}
        {statusData?.configured && modules.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {modules.map(mod => (
              <Button
                key={mod}
                variant="outline"
                size="sm"
                className="gap-1.5 capitalize"
                disabled={syncModuleMutation.isPending}
                onClick={() => syncModuleMutation.mutate(mod)}
              >
                <RefreshCw className="h-3 w-3" />
                Sync {mod}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Logs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Sync Logs
          </h2>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={moduleFilter}
              onChange={e => setModuleFilter(e.target.value)}
              className="text-xs border border-border rounded-sm px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All modules</option>
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={directionFilter}
              onChange={e => setDirectionFilter(e.target.value)}
              className="text-xs border border-border rounded-sm px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {DIRECTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-border rounded-sm px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {logsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Activity className="h-10 w-10 mx-auto mb-3 opacity-25" />
            <p className="text-sm">No sync logs found.</p>
          </div>
        ) : (
          <div className="bg-background rounded-sm border border-border overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 px-4 py-2.5 border-b border-border bg-muted/50 text-xs font-medium tracking-wider uppercase text-muted-foreground">
              <span>Status</span>
              <span>Module / ID</span>
              <span className="hidden sm:block">Direction</span>
              <span className="hidden md:block">Action</span>
              <span className="hidden lg:block">Time</span>
            </div>

            {logs.map(log => (
              <div
                key={log._id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 items-start px-4 py-3 border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <div className="pt-0.5">
                  <StatusIcon status={log.status} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium capitalize">{log.module}</p>
                  {log.zohoId && (
                    <p className="text-xs text-muted-foreground font-mono truncate">{log.zohoId}</p>
                  )}
                  {log.error && (
                    <p className="text-xs text-destructive mt-0.5 truncate">{log.error}</p>
                  )}
                </div>

                <span className="hidden sm:block text-xs text-muted-foreground whitespace-nowrap pt-0.5">
                  {log.direction === 'zoho_to_mongo' ? 'Zoho → DB' : 'DB → Zoho'}
                </span>

                <span className="hidden md:block text-xs text-muted-foreground capitalize pt-0.5">
                  {log.action}
                </span>

                <span className="hidden lg:block text-xs text-muted-foreground whitespace-nowrap pt-0.5">
                  {formatDate(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ZohoSync;
