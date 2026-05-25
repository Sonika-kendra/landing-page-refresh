import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  RefreshCw, CheckCircle, XCircle, AlertCircle, Activity, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/components/shared/common/DataTable';
import type { ColumnDef } from '@/components/shared/common/DataTable';
import { adminApi, ZohoSyncLog } from '@/api/admin';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const DIRECTIONS = [
  { value: 'all', label: 'All directions' },
  { value: 'zoho_to_mongo', label: 'Zoho → DB' },
  { value: 'mongo_to_zoho', label: 'DB → Zoho' },
];

const STATUSES = [
  { value: 'all', label: 'All statuses' },
  { value: 'success', label: 'Success' },
  { value: 'error', label: 'Error' },
];

const LOG_COLUMNS: ColumnDef<ZohoSyncLog>[] = [
  {
    key: 'status',
    label: 'Status',
    width: '60px',
    align: 'center',
    render: (val) =>
      val === 'success'
        ? <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
        : <XCircle className="h-4 w-4 text-destructive mx-auto" />,
  },
  {
    key: 'module',
    label: 'Module',
    sortable: true,
    render: (_, log) => (
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
    ),
  },
  {
    key: 'meta',
    label: 'Records',
    width: '220px',
    render: (_, log) => (
      <span className="text-xs text-muted-foreground">
        {log.meta
          ? `${log.meta.synced} synced${log.meta.errors > 0 ? `, ${log.meta.errors} errors` : ''} / ${log.meta.total} total`
          : <span className="capitalize">{log.action}</span>
        }
      </span>
    ),
  },
  {
    key: 'createdAt',
    label: 'Time',
    width: '180px',
    sortable: true,
    render: (val) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {formatDate(val as string)}
      </span>
    ),
  },
];

const ZohoSync = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [moduleFilter, setModuleFilter]       = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [statusFilter, setStatusFilter]       = useState('all');

  const [fullSyncStartedAt, setFullSyncStartedAt] = useState<Date | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['admin', 'zoho', 'status'],
    queryFn: () => adminApi.getZohoStatus().then(r => r.data),
  });

  const { data: scheduleData, isLoading: scheduleLoading } = useQuery({
    queryKey: ['admin', 'zoho', 'schedule'],
    queryFn: () => adminApi.getZohoSchedule().then(r => r.data),
    staleTime: 60_000,
  });

  const isFullSyncRunning = fullSyncStartedAt !== null;

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
          l => new Date(l.createdAt).getTime() >= startMs,
        );
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

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fullSyncStartedAt, statusData?.modules, queryClient, toast]);

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
      const msg =
        (err as { response?: { data?: { error?: string } }; message?: string })
          ?.response?.data?.error ??
        (err as { message?: string })?.message ??
        'Unknown error';
      toast({ title: `Failed to sync ${module}`, description: msg, variant: 'destructive' });
    },
  });

  const anySyncRunning = isFullSyncRunning || syncModuleMutation.isPending;
  const modules = statusData?.modules ?? [];

  // Log filter key — forces DataTable remount (page reset) when filters change
  const logsFilterKey = `${moduleFilter}-${directionFilter}-${statusFilter}`;

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
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

      {/* ── Integration Status ── */}
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
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                statusData?.configured ? 'text-green-700' : 'text-destructive'
              }`}
            >
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
                  {isThisModuleSyncing ? 'Syncing…' : `Sync ${mod}`}
                </Button>
              );
            })}
          </div>
        )}

        {anySyncRunning && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
            {isFullSyncRunning
              ? 'Full sync in progress — please wait until it completes.'
              : `Syncing ${syncModuleMutation.variables} — please wait…`}
          </div>
        )}
      </div>

      {/* ── Auto-Sync Schedule ── */}
      <div className="bg-card border border-border rounded-sm p-5 space-y-4">
        <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Auto-Sync Schedule
        </h2>

        {scheduleLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
          </div>
        ) : scheduleData ? (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Daily Sync</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {scheduleData.dailySync.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Next run</p>
              <p className="text-sm font-medium tabular-nums">
                {formatDate(scheduleData.dailySync.nextRun)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Schedule unavailable.</p>
        )}
      </div>

      {/* ── Sync Logs ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Sync Logs
          </h2>

          {/* Log filters */}
          <div className="flex gap-2 flex-wrap">
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="h-7 w-36 text-xs rounded-sm">
                <SelectValue placeholder="All modules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All modules</SelectItem>
                {modules.map(m => (
                  <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={directionFilter} onValueChange={setDirectionFilter}>
              <SelectTrigger className="h-7 w-36 text-xs rounded-sm">
                <SelectValue placeholder="All directions" />
              </SelectTrigger>
              <SelectContent>
                {DIRECTIONS.map(d => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-7 w-32 text-xs rounded-sm">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable<ZohoSyncLog>
          key={logsFilterKey}
          queryKey={['admin', 'zoho', 'logs']}
          fetchFn={() =>
            adminApi.getZohoLogs({
              ...(moduleFilter !== 'all' && { module: moduleFilter }),
              ...(directionFilter !== 'all' && { direction: directionFilter }),
              ...(statusFilter !== 'all' && { status: statusFilter }),
            })
          }
          dataKey="logs"
          columns={LOG_COLUMNS}
          clientSidePagination
          defaultPageSize={10}
          emptyIcon={<Activity className="h-10 w-10 opacity-25" />}
          emptyMessage="No sync logs found."
          compact
        />
      </div>
    </div>
  );
};

export default ZohoSync;
