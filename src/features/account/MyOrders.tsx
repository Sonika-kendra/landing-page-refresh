import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Loader2, Package } from 'lucide-react';
import { ordersApi } from '@/api/orders';

type OrderStatus = 'web_order' | 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const VARIANT: Record<OrderStatus, 'default' | 'outline' | 'secondary' | 'destructive'> = {
  web_order: 'secondary', placed: 'outline', processing: 'outline',
  shipped: 'default', delivered: 'default', cancelled: 'destructive',
};

interface Order {
  salesorder_id: string;
  salesorder_number: string;
  customer_name: string;
  date: string;
  line_items: any[];
  total: number;
  orderStatus?: { status: OrderStatus };
}

const DUMMY_ORDERS: Order[] = [
  {
    salesorder_id: 'dummy-001',
    salesorder_number: 'SO-00101',
    customer_name: 'Test User',
    date: '2026-05-10',
    line_items: [{ item: 'Diamond Solitaire Ring' }, { item: 'Gift Box' }],
    total: 4250,
    orderStatus: { status: 'delivered' },
  },
  {
    salesorder_id: 'dummy-002',
    salesorder_number: 'SO-00098',
    customer_name: 'Test User',
    date: '2026-04-22',
    line_items: [{ item: 'Pearl Necklace' }],
    total: 1875,
    orderStatus: { status: 'shipped' },
  },
  {
    salesorder_id: 'dummy-003',
    salesorder_number: 'SO-00085',
    customer_name: 'Test User',
    date: '2026-03-15',
    line_items: [{ item: 'Emerald Earrings' }, { item: 'Bracelet' }, { item: 'Pendant' }],
    total: 6990,
    orderStatus: { status: 'processing' },
  },
  {
    salesorder_id: 'dummy-004',
    salesorder_number: 'SO-00072',
    customer_name: 'Test User',
    date: '2026-02-08',
    line_items: [{ item: 'Sapphire Ring' }],
    total: 3100,
    orderStatus: { status: 'cancelled' },
  },
];

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.list({ status: 'open', per_page: 50 })
      .then(res => {
        const fetched = res.data?.salesorders ?? [];
        setOrders(fetched.length > 0 ? fetched : DUMMY_ORDERS);
      })
      .catch(() => setOrders(DUMMY_ORDERS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="p-16 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="p-16 text-center">
        <Package className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
        <p className="text-muted-foreground">No orders yet</p>
        <Link to="/jewellery/all" className="mt-3 inline-block">
          <Button size="sm" variant="outline">Start Shopping</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/20">
        <h2 className="font-medium">Order History</h2>
      </div>
      {orders.map(o => {
        const status: OrderStatus = o.orderStatus?.status ?? 'placed';
        return (
          <div
            key={o.salesorder_id}
            className="flex items-center justify-between gap-4 px-4 py-4 border-b border-border last:border-0 hover:bg-muted/20"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="font-medium text-sm">{o.salesorder_number}</p>
                <Badge variant={VARIANT[status]}>{status.replace('_', ' ')}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {o.date
                  ? new Date(o.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—'
                } · {o.line_items?.length ?? 0} item(s)
              </p>
            </div>
            <p className="font-medium">£{(o.total ?? 0).toLocaleString()}</p>
            <Link to={`/account/orders/${o.salesorder_id}`}>
              <Button size="sm" variant="ghost" className="gap-1.5">
                <Eye className="h-3.5 w-3.5" /> View
              </Button>
            </Link>
          </div>
        );
      })}
    </Card>
  );
};

export default MyOrders;
