import { useState } from 'react';
import { ShoppingCart, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminPageHeader from '../components/AdminPageHeader';
import DataTable from '@/components/shared/common/DataTable';
import type { ColumnDef } from '@/components/shared/common/DataTable';
import { ordersApi } from '@/api/orders';

interface DraftOrder {
  salesorder_id: string;
  salesorder_number: string;
  customer_name: string;
  customer_email?: string;
  line_items: any[];
  sub_total: number;
  total: number;
  last_modified_time?: string;
  created_time?: string;
}

const COLUMNS: ColumnDef<DraftOrder>[] = [
  {
    key: 'customer_name',
    label: 'Customer',
    width: '200px',
    render: (_, o) => (
      <div>
        <p className="text-sm font-medium">{o.customer_name}</p>
        {o.customer_email && (
          <p className="text-xs text-muted-foreground">{o.customer_email}</p>
        )}
        <Badge variant="secondary" className="text-[10px] mt-1">Draft</Badge>
      </div>
    ),
  },
  {
    key: 'line_items',
    label: 'Items',
    render: (_, o) => (
      <span className="text-sm text-muted-foreground">
        {(o.line_items ?? []).map((i: any) => i.name).join(', ') || '—'}
      </span>
    ),
  },
  {
    key: 'sub_total',
    label: 'Subtotal',
    width: '110px',
    sortable: true,
    render: (val) => (
      <span className="text-sm">£{((val as number) ?? 0).toLocaleString()}</span>
    ),
  },
  {
    key: 'total',
    label: 'Total',
    width: '110px',
    sortable: true,
    render: (val) => (
      <span className="text-sm font-medium">£{((val as number) ?? 0).toLocaleString()}</span>
    ),
  },
  {
    key: 'last_modified_time',
    label: 'Last Update',
    width: '130px',
    sortable: true,
    render: (val) => (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3 w-3 shrink-0" />
        {val ? new Date(val as string).toLocaleDateString('en-GB') : '—'}
      </span>
    ),
  },
];

const CartMonitor = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <AdminPageHeader
        title="Active Carts"
        description="Live draft orders (carts) awaiting checkout"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        }
      />

      <DataTable<DraftOrder>
        queryKey={['admin', 'carts']}
        fetchFn={() => ordersApi.list({ status: 'draft', per_page: 200 } as any)}
        dataKey="salesorders"
        columns={COLUMNS}
        clientSidePagination
        clientSideSearchFn={(o, q) =>
          (o.customer_name ?? '').toLowerCase().includes(q) ||
          (o.customer_email ?? '').toLowerCase().includes(q) ||
          (o.salesorder_number ?? '').toLowerCase().includes(q)
        }
        searchable
        searchPlaceholder="Search by customer…"
        refreshKey={refreshKey}
        emptyIcon={<ShoppingCart className="h-10 w-10 opacity-25" />}
        emptyMessage="No active carts."
      />
    </div>
  );
};

export default CartMonitor;
