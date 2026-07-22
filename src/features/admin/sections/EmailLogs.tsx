import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DataTable from '@/components/shared/common/DataTable';
import type { ColumnDef } from '@/components/shared/common/DataTable';
import { adminApi, EmailLog } from '@/api/admin';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const STATUSES = [
  { value: 'all', label: 'All statuses' },
  { value: 'success', label: 'Success' },
  { value: 'error', label: 'Error' },
  { value: 'skipped', label: 'Skipped' },
];

const STATUS_BADGE: Record<EmailLog['status'], { icon: typeof CheckCircle; className: string; label: string }> = {
  success: { icon: CheckCircle, className: 'text-green-700 bg-green-50 border-green-200', label: 'Success' },
  error:   { icon: XCircle,     className: 'text-destructive bg-red-50 border-red-200',    label: 'Error' },
  skipped: { icon: AlertTriangle, className: 'text-amber-700 bg-amber-50 border-amber-200', label: 'Skipped' },
};

const makeColumns = (onErrorClick: (msg: string) => void): ColumnDef<EmailLog>[] => [
  {
    key: 'status',
    label: 'Status',
    width: '15%',
    align: 'center',
    render: (val, log) => {
      const { icon: Icon, className, label } = STATUS_BADGE[val as EmailLog['status']];
      const clickable = log.status !== 'success' && !!log.error;
      const badge = (
        <span className={`inline-flex items-center gap-1 text-xs font-medium border rounded px-2 py-0.5 ${className} ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}>
          <Icon className="h-3 w-3" /> {label}
        </span>
      );
      return clickable ? (
        <button type="button" onClick={() => log.error && onErrorClick(log.error)}>{badge}</button>
      ) : badge;
    },
  },
  {
    key: 'templateName',
    label: 'Template',
    width: '25%',
    sortable: true,
    render: (val) => <span className="text-sm font-medium">{val as string}</span>,
  },
  {
    key: 'recipient',
    label: 'Recipient',
    width: '35%',
    render: (val) => <span className="text-sm text-muted-foreground truncate">{val as string}</span>,
  },
  {
    key: 'createdAt',
    label: 'Time',
    width: '25%',
    sortable: true,
    render: (val) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {formatDate(val as string)}
      </span>
    ),
  },
];

const EmailLogs = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [errorModal, setErrorModal] = useState<string | null>(null);

  const columns = makeColumns((msg) => setErrorModal(msg));

  return (
    <>
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light tracking-widest uppercase">Email Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Delivery status for order confirmations and other transactional emails.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Send Log
          </h2>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-7 w-36 text-xs rounded-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable<EmailLog>
          key={statusFilter}
          queryKey={['admin', 'email', 'logs']}
          fetchFn={() =>
            adminApi.getEmailLogs({
              ...(statusFilter !== 'all' && { status: statusFilter }),
            })
          }
          dataKey="logs"
          columns={columns}
          clientSidePagination
          defaultPageSize={10}
          emptyIcon={<Mail className="h-10 w-10 opacity-25" />}
          emptyMessage="No email logs found."
          compact
        />
      </div>
    </div>

    {errorModal !== null && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={() => setErrorModal(null)}
      >
        <div
          className="relative bg-background border rounded-lg shadow-xl w-full max-w-lg mx-4 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5 shrink-0" />
              <span className="font-semibold text-sm">Email Error</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorModal(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <pre className="text-xs text-muted-foreground bg-muted rounded p-3 whitespace-pre-wrap break-all max-h-72 overflow-y-auto">
            {errorModal}
          </pre>
          <div className="mt-4 flex justify-end">
            <Button size="sm" variant="outline" onClick={() => setErrorModal(null)}>
              Close
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default EmailLogs;
