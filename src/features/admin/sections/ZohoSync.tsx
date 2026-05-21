import { useState, useEffect, useRef } from 'react';
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

  // Tracks when a background full-sync was triggered so we can poll for completion
  const [fullSyncStartedAt, setFullSyncStartedAt] = useState<Date | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Poll every 3 s while a full sync is running. Stop once a new batch log appears.
  useEffect(() => {
    if (!fullSyncStartedAt) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }

    const startMs = fullSyncStartedAt.getTime();
    const modules = statusData?.modules ?? [];

    pollRef.current = setInterval(async () => {
      try {
        const result = await adminApi.getZohoLogs({}).then(r => r.data);
        const newLogs = (result.logs as ZohoSyncLog[]).filter(
          l => new Date(l.createdAt).getTime() >= startMs
        );
        // Wait until we have a batch log for every module (or 120 s timeout)
        const modulesLogged = new Set(newLogs.map(l => l.module));
        const allDone = modules.length > 0 && modules.every(m => modulesLogged.has(m));
        const timedOut = Date.now() - startMs > 120_000;

        if (allDone || timedOut) {
          setFullSyncStartedAt(null);
          queryClient.invalidateQueries({ queryKey: ['admin', 'zoho', 'logs'] });
          toast({
            title: allDone ? 'Full sync completed' : 'Sync timed out',
            description: allDone
              ? 'All modules have been synced.'
              : 'Sync may still be running — check logs.',
          });
        }
      } catch {
        // non-critical polling error — keep trying
      }
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fullSyncStartedAt, statusData?.modules, queryClient, toast]);

  const isFullSyncRunning = fullSyncStartedAt !== null;

  const syncAllMutation = useMutation({
    mutationFn: () => adminApi.zohoSyncAll().then(r => r.data),
    onSuccess: () => {
      setFullSyncStartedAt(new Date());
      toast({ title: 'Full sync started', description: 'Syncing all modules in background…' });
    },
    onError: () => toast({ title: 'Sync failed', variant: 'destructive' }),
  });

  const syncModuleMutation = useMutation({
    mutationFn: (module: string) => adminApi.zohoSyncModule(module).then(r => r.data),
    onSuccess: (data, module) => {
      toast({
        title: `${module} synced`,
        description: `${data.synced ?? 0} synced, ${data.errors ?? 0} errors.`,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'zoho', 'logs'] });
    },
    onError: (err: unknown, module) => {
      const msg = (err as { response?: { data?: { error?: string } }; message?: string })
        ?.response?.data?.error ?? (err as { message?: string })?.message ?? 'Unknown error';
      toast({ title: `Failed to sync ${module}`, description: msg, variant: 'destructive' });
    },
  });

  const anySyncRunning = isFullSyncRunning || syncModuleMutation.isPending;

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
          disabled={anySyncRunning || !statusData?.configured}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFullSyncRunning ? 'animate-spin' : ''}`} />
          {isFullSyncRunning ? 'Syncing…' : 'Full Sync'}
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
            {modules.map(mod => {
              const isThisModuleSyncing =
                syncModuleMutation.isPending && syncModuleMutation.variables === mod;
              return (
                <Button
                  key={mod}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 capitalize min-w-[110px]"
                  disabled={anySyncRunning}
                  onClick={() => syncModuleMutation.mutate(mod)}
                >
                  <RefreshCw className={`h-3 w-3 ${isThisModuleSyncing ? 'animate-spin' : ''}`} />
                  {isThisModuleSyncing ? `Syncing…` : `Sync ${mod}`}
                </Button>
              );
            })}
          </div>
        )}

        {/* Ongoing sync banner */}
        {anySyncRunning && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
            {isFullSyncRunning
              ? 'Full sync in progress — please wait until it completes.'
              : `Syncing ${syncModuleMutation.variables} — please wait…`}
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
            {Array.from({ length: 5 }).map((_, i) => (
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
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 px-4 py-2.5 border-b border-border bg-muted/50 text-xs font-medium tracking-wider uppercase text-muted-foreground">
              <span>Status</span>
              <span>Module</span>
              <span className="hidden sm:block">Records</span>
              <span className="hidden lg:block">Time</span>
            </div>

            {logs.map(log => (
              <div
                key={log._id}
                className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-start px-4 py-3 border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <div className="pt-0.5">
                  <StatusIcon status={log.status} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium capitalize">
                    {log.module}
                    <span className="ml-2 text-xs font-normal text-muted-foreground normal-case">
                      {log.direction === 'zoho_to_mongo' ? 'Zoho → DB' : 'DB → Zoho'}
                    </span>
                  </p>
                  {log.error && (
                    <p className="text-xs text-destructive mt-0.5 truncate">{log.error}</p>
                  )}
                </div>

                <span className="hidden sm:block text-xs text-muted-foreground whitespace-nowrap pt-0.5">
                  {log.meta
                    ? `${log.meta.synced} synced${log.meta.errors > 0 ? `, ${log.meta.errors} errors` : ''} / ${log.meta.total} total`
                    : <span className="capitalize">{log.action}</span>
                  }
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
