import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Package } from 'lucide-react';
import { ordersApi } from '@/api/orders';
import LoadingSpinner from '@/components/shared/common/LoadingSpinner';

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

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    ordersApi.list({ per_page: 50 })
      .then(res => {
        const fetched = (res.data?.salesorders ?? []).filter(
          (o: any) => !['draft', 'void'].includes(o.status)
        );
        setOrders(fetched);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="p-16 flex justify-center">
        <LoadingSpinner size={24} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-16 text-center">
        <Package className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
        <p className="text-muted-foreground">Unable to load orders. Please try again later.</p>
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
