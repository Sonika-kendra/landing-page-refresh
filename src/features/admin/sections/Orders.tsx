import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import AdminPageHeader from '../components/AdminPageHeader';
import { mockOrders, OrderStatus } from '@/data/commerce/orders';

const STATUS_VARIANT: Record<OrderStatus, 'default' | 'outline' | 'secondary' | 'destructive'> = {
  web_order: 'secondary', placed: 'outline', processing: 'outline',
  shipped: 'default', delivered: 'default', cancelled: 'destructive',
};

const Orders = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');

  const filtered = mockOrders.filter(o => {
    const m = !search || o.reference.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase());
    const s = status === 'all' || o.status === status;
    return m && s;
  });

  return (
    <div>
      <AdminPageHeader title="Orders" description="View and manage customer orders" />

      <Card className="p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ref or customer..." className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="web_order">Web Order</SelectItem>
            <SelectItem value="placed">Placed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
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
        {filtered.map(o => (
          <div key={o.id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-border hover:bg-muted/20">
            <div className="col-span-2 text-sm font-medium">{o.reference}</div>
            <div className="col-span-3">
              <p className="text-sm">{o.customerName}</p>
              <p className="text-xs text-muted-foreground">{o.customerEmail}</p>
            </div>
            <div className="col-span-2"><Badge variant={STATUS_VARIANT[o.status]}>{o.status.replace('_', ' ')}</Badge></div>
            <div className="col-span-1 text-sm">{o.items.length}</div>
            <div className="col-span-2 text-sm font-medium">£{o.total.toLocaleString()}</div>
            <div className="col-span-1 text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString('en-GB')}</div>
            <div className="col-span-1 flex justify-end">
              <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/orders/${o.id}`)} className="gap-1.5">
                <Eye className="h-3.5 w-3.5" /> View
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-40" /> No orders found
          </div>
        )}
      </Card>
    </div>
  );
};

export default Orders;
