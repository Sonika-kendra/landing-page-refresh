import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { mockOrders, OrderStatus } from '@/data/commerce/orders';

const VARIANT: Record<OrderStatus, 'default' | 'outline' | 'secondary' | 'destructive'> = {
  web_order: 'secondary', placed: 'outline', processing: 'outline',
  shipped: 'default', delivered: 'default', cancelled: 'destructive',
};

const MyOrders = () => (
  <Card className="overflow-hidden">
    <div className="px-4 py-3 border-b border-border bg-muted/20">
      <h2 className="font-medium">Order History</h2>
    </div>
    {mockOrders.filter(o => o.status !== 'web_order').map(o => (
      <div key={o.id} className="flex items-center justify-between gap-4 px-4 py-4 border-b border-border last:border-0 hover:bg-muted/20">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <p className="font-medium text-sm">{o.reference}</p>
            <Badge variant={VARIANT[o.status]}>{o.status.replace('_', ' ')}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {o.items.length} item(s)
          </p>
        </div>
        <p className="font-medium">£{o.total.toLocaleString()}</p>
        <Link to={`/account/orders/${o.id}`}>
          <Button size="sm" variant="ghost" className="gap-1.5"><Eye className="h-3.5 w-3.5" /> View</Button>
        </Link>
      </div>
    ))}
  </Card>
);

export default MyOrders;
