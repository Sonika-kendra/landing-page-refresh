import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Package, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminPageHeader from '../components/AdminPageHeader';
import { ordersApi } from '@/api/orders';

type OrderStatus = 'web_order' | 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_VARIANT: Record<OrderStatus, 'default' | 'outline' | 'secondary' | 'destructive'> = {
  web_order: 'secondary', placed: 'outline', processing: 'outline',
  shipped: 'default', delivered: 'default', cancelled: 'destructive',
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

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');

  useEffect(() => {
    const params: Record<string, any> = { per_page: 100 };
    if (status !== 'all') params.status = status;
    ordersApi.list(params)
      .then(res => setOrders(res.data?.salesorders ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  const filtered = orders.filter(o => {
    if (!search) return true;
    return (
      o.salesorder_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div>
      <AdminPageHeader title="Orders" description="View and manage customer orders" />

      <Card className="p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ref or customer…" className="pl-9" />
        </div>
        <Select value={status} onValueChange={v => { setStatus(v); setLoading(true); }}>
          <SelectTrigger className="w-full sm:w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft (Carts)</SelectItem>
            <SelectItem value="open">Open (Web Orders)</SelectItem>
            <SelectItem value="invoiced">Invoiced</SelectItem>
            <SelectItem value="void">Voided</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border">
          <div className="col-span-2">Reference</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Items</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {loading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {filtered.map(o => {
              const extStatus: OrderStatus = o.orderStatus?.status ?? 'placed';
              return (
                <div key={o.salesorder_id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-border hover:bg-muted/20">
                  <div className="col-span-2 text-sm font-medium">{o.salesorder_number}</div>
                  <div className="col-span-3">
                    <p className="text-sm">{o.customer_name}</p>
                    {o.customer_email && <p className="text-xs text-muted-foreground">{o.customer_email}</p>}
                  </div>
                  <div className="col-span-2">
                    <Badge variant={STATUS_VARIANT[extStatus]}>{extStatus.replace('_', ' ')}</Badge>
                  </div>
                  <div className="col-span-1 text-sm">{o.line_items?.length ?? 0}</div>
                  <div className="col-span-2 text-sm font-medium">£{(o.total ?? 0).toLocaleString()}</div>
                  <div className="col-span-1 text-xs text-muted-foreground">
                    {o.date ? new Date(o.date).toLocaleDateString('en-GB') : '—'}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/orders/${o.salesorder_id}`)} className="gap-1.5">
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-40" /> No orders found
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Orders;
