import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Package, Check, X, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
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
import AdminPageHeader from '../components/AdminPageHeader';
import DataTable from '@/components/shared/common/DataTable';
import type { ColumnDef } from '@/components/shared/common/DataTable';
import ReasonSelect, { resolveReason } from '@/components/shared/common/ReasonSelect';
import { ordersApi } from '@/api/orders';

// One workflow, client -> admin -> client:
//   draft (shopping, not yet an order) -> web_order (placed, awaiting admin review)
//     -> [Approve] placed -> processing -> shipped -> delivered
//     -> [Reject/Cancel] cancelled  (allowed from web_order up to shipped)
type OrderStatus = 'web_order' | 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_VARIANT: Record<
  OrderStatus,
  'default' | 'outline' | 'secondary' | 'destructive'
> = {
  web_order:  'secondary',
  placed:     'outline',
  processing: 'outline',
  shipped:    'default',
  delivered:  'default',
  cancelled:  'destructive',
};

const REJECT_REASONS = [
  'Price exceeds approval threshold',
  'Custom or bespoke item needs consultation',
  'Item unavailable / out of stock',
  'Suspected fraudulent order',
  'Customer verification required',
];

interface OrderLineItem {
  line_item_id: string;
  name: string;
  quantity: number;
  rate: number;
  sku?: string;
  metal?: string;
  size?: string;
  carat?: string;
}

interface Order {
  salesorder_id: string;
  salesorder_number: string;
  customer_name: string;
  customer_email?: string;
  date: string;
  line_items: OrderLineItem[];
  sub_total?: number;
  total: number;
  last_modified_time?: string;
  status?: string;
  orderStatus?: { status: OrderStatus; cancelReason?: string };
}

const BASE_COLUMNS: ColumnDef<Order>[] = [
  {
    key: 'salesorder_number',
    label: 'Reference',
    width: '140px',
    sortable: true,
    render: (val) => <span className="text-sm font-medium">{val as string}</span>,
  },
  {
    key: 'customer_name',
    label: 'Customer',
    sortable: true,
    render: (_, order) => (
      <div>
        <p className="text-sm">{order.customer_name}</p>
        {order.customer_email && (
          <p className="text-xs text-muted-foreground">{order.customer_email}</p>
        )}
      </div>
    ),
  },
  {
    key: 'orderStatus',
    label: 'Status',
    width: '140px',
    render: (_, order) => {
      if (!order.orderStatus) {
        return <Badge variant="outline">Draft Cart</Badge>;
      }
      const status = order.orderStatus.status;
      return (
        <Badge variant={STATUS_VARIANT[status]}>
          {status.replace('_', ' ')}
        </Badge>
      );
    },
  },
];

const TAIL_COLUMNS: ColumnDef<Order>[] = [
  {
    key: 'line_items',
    label: 'Items',
    width: '70px',
    align: 'center',
    render: (_, order) => (
      <span className="text-sm">{order.line_items?.length ?? 0}</span>
    ),
  },
  {
    key: 'total',
    label: 'Total',
    width: '120px',
    sortable: true,
    render: (val) => (
      <span className="text-sm font-medium">
        £{((val as number) ?? 0).toLocaleString()}
      </span>
    ),
  },
  {
    key: 'date',
    label: 'Date',
    width: '110px',
    sortable: true,
    render: (val) => (
      <span className="text-xs text-muted-foreground">
        {val ? new Date(val as string).toLocaleDateString('en-GB') : '—'}
      </span>
    ),
  },
];

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Orders' },
  { value: 'draft', label: 'Draft (Carts)' },
  { value: 'checked_out', label: 'Checked Out' },
  { value: 'void', label: 'Voided' },
];

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? 'all');

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [rejectTarget, setRejectTarget] = useState<Order | null>(null);
  const [rejectPreset, setRejectPreset] = useState('');
  const [rejectOther, setRejectOther] = useState('');

  const hasActiveFilters = !!nameFilter || !!emailFilter || !!dateFrom || !!dateTo;

  const clearFilters = () => {
    setNameFilter('');
    setEmailFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const filterFn = useMemo(() => {
    return (o: Order) => {
      // Default view is real orders only — an in-progress cart isn't an order yet.
      // Explicitly picking "Draft (Carts)" above still shows them.
      if (statusFilter === 'all' && !o.orderStatus) return false;
      if (nameFilter && !(o.customer_name ?? '').toLowerCase().includes(nameFilter.toLowerCase())) return false;
      if (emailFilter && !(o.customer_email ?? '').toLowerCase().includes(emailFilter.toLowerCase())) return false;

      if (dateFrom || dateTo) {
        const updated = o.last_modified_time ? new Date(o.last_modified_time) : null;
        if (!updated) return false;
        if (dateFrom && updated < new Date(dateFrom)) return false;
        if (dateTo && updated > new Date(`${dateTo}T23:59:59.999`)) return false;
      }

      return true;
    };
  }, [statusFilter, nameFilter, emailFilter, dateFrom, dateTo]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });

  const approveMutation = useMutation({
    mutationFn: (id: string) => ordersApi.confirm(id),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Order Approved' });
    },
    onError: () =>
      toast({ title: 'Error', description: 'Failed to approve order.', variant: 'destructive' }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      ordersApi.cancel(id, reason),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Order Rejected' });
      setRejectTarget(null);
      setRejectPreset('');
      setRejectOther('');
    },
    onError: () =>
      toast({ title: 'Error', description: 'Failed to reject order.', variant: 'destructive' }),
  });

  const columns = useMemo(() => {
    const actionColumn: ColumnDef<Order> = {
      key: 'action',
      label: 'Action',
      width: '130px',
      render: (_, order) => {
        if (order.orderStatus?.status !== 'web_order') {
          return <span className="text-sm text-muted-foreground">—</span>;
        }
        return (
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              title="Approve"
              onClick={() => approveMutation.mutate(order.salesorder_id)}
              disabled={approveMutation.isPending}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-7 w-7"
              title="Reject"
              onClick={() => setRejectTarget(order)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    };

    return [...BASE_COLUMNS, actionColumn, ...TAIL_COLUMNS];
  }, [approveMutation]);

  return (
    <div>
      <AdminPageHeader title="Orders" description="View and manage customer orders" />

      <DataTable<Order>
        key={statusFilter}
        queryKey={['admin', 'orders']}
        fetchFn={(params) =>
          ordersApi.list({
            per_page: 200,
            source: 'web',
            status: statusFilter !== 'all' ? statusFilter : undefined,
          } as any)
        }
        dataKey="salesorders"
        columns={columns}
        clientSidePagination
        clientSideFilterFn={filterFn}
        clientSideSearchFn={(o, q) =>
          (o.salesorder_number ?? '').toLowerCase().includes(q) ||
          (o.customer_name ?? '').toLowerCase().includes(q) ||
          (o.customer_email ?? '').toLowerCase().includes(q)
        }
        searchable
        searchPlaceholder="Search by ref or customer…"
        emptyIcon={<Package className="h-10 w-10 opacity-25" />}
        emptyMessage="No orders found."
        onRowClick={(order) => navigate(`/admin/orders/${order.salesorder_id}`)}
        renderExpandedRow={(order) => {
          const items = order.line_items ?? [];
          return (
            <div className="space-y-3">
              {order.orderStatus?.status === 'cancelled' && order.orderStatus.cancelReason && (
                <p className="text-xs text-destructive">Cancellation reason: {order.orderStatus.cancelReason}</p>
              )}
              <div className="rounded-md border border-border divide-y divide-border bg-background">
                {items.length ? items.map((item) => (
                  <div key={item.line_item_id} className="flex items-center gap-4 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {[item.sku, item.metal, item.size, item.carat].filter(Boolean).join(' · ') || '—'}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">Qty {item.quantity}</span>
                    <span className="text-sm font-medium whitespace-nowrap w-20 text-right">
                      £{(item.rate * item.quantity).toLocaleString()}
                    </span>
                  </div>
                )) : (
                  <p className="px-4 py-3 text-sm text-muted-foreground">No items in this order.</p>
                )}
              </div>
            </div>
          );
        }}
        rowActions={[
          {
            label: 'View',
            icon: <Eye className="h-3.5 w-3.5" />,
            onClick: (order) => navigate(`/admin/orders/${order.salesorder_id}`),
          },
        ]}
        toolbar={
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-52 text-sm rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                  <Filter className="h-3.5 w-3.5" />
                  Filters{hasActiveFilters ? ` (${[nameFilter, emailFilter, dateFrom, dateTo].filter(Boolean).length})` : ''}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-sm overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter orders</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Last updated</p>
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="h-9 text-sm"
                        aria-label="Updated from"
                      />
                      <span className="text-xs text-muted-foreground">–</span>
                      <Input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="h-9 text-sm"
                        aria-label="Updated to"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Customer</p>
                    <Input
                      placeholder="Filter by name…"
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                      className="h-9 text-sm"
                    />
                    <Input
                      placeholder="Filter by email…"
                      value={emailFilter}
                      onChange={(e) => setEmailFilter(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                <SheetFooter className="mt-6">
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  )}
                  <SheetClose asChild>
                    <Button size="sm">Done</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        }
      />

      <AlertDialog
        open={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open) { setRejectTarget(null); setRejectPreset(''); setRejectOther(''); }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Order</AlertDialogTitle>
            <AlertDialogDescription>
              Reject the order from <strong>{rejectTarget?.customer_name}</strong>? This cancels
              it — you can optionally include a reason.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ReasonSelect
            reasons={REJECT_REASONS}
            preset={rejectPreset}
            onPresetChange={setRejectPreset}
            otherText={rejectOther}
            onOtherTextChange={setRejectOther}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                rejectTarget &&
                rejectMutation.mutate({
                  id: rejectTarget.salesorder_id,
                  reason: resolveReason(rejectPreset, rejectOther),
                })
              }
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? 'Rejecting…' : 'Reject Order'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Orders;
