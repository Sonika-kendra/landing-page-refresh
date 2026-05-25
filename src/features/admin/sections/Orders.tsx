import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminPageHeader from '../components/AdminPageHeader';
import DataTable from '@/components/shared/common/DataTable';
import type { ColumnDef } from '@/components/shared/common/DataTable';
import { ordersApi } from '@/api/orders';

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

interface Order {
  salesorder_id: string;
  salesorder_number: string;
  customer_name: string;
  customer_email?: string;
  date: string;
  line_items: any[];
  total: number;
  orderStatus?: { status: OrderStatus };
}

const COLUMNS: ColumnDef<Order>[] = [
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
      const status: OrderStatus = order.orderStatus?.status ?? 'placed';
      return (
        <Badge variant={STATUS_VARIANT[status]}>
          {status.replace('_', ' ')}
        </Badge>
      );
    },
  },
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

const Orders = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div>
      <AdminPageHeader title="Orders" description="View and manage customer orders" />

      <DataTable<Order>
        key={statusFilter}
        queryKey={['admin', 'orders']}
        fetchFn={(params) =>
          ordersApi.list({
            per_page: 200,
            status: statusFilter !== 'all' ? statusFilter : undefined,
          } as any)
        }
        dataKey="salesorders"
        columns={COLUMNS}
        clientSidePagination
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
        rowActions={[
          {
            label: 'View',
            icon: <Eye className="h-3.5 w-3.5" />,
            onClick: (order) => navigate(`/admin/orders/${order.salesorder_id}`),
          },
        ]}
        toolbar={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-52 text-sm rounded-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft (Carts)</SelectItem>
              <SelectItem value="open">Open (Web Orders)</SelectItem>
              <SelectItem value="invoiced">Invoiced</SelectItem>
              <SelectItem value="void">Voided</SelectItem>
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
};

export default Orders;
