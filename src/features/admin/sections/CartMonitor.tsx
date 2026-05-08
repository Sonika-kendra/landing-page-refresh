import { ShoppingCart, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminPageHeader from '../components/AdminPageHeader';
import { mockOrders } from '@/data/commerce/orders';

const CartMonitor = () => {
  const webOrders = mockOrders.filter(o => o.status === 'web_order');

  return (
    <div>
      <AdminPageHeader
        title="Active Carts"
        description="Live carts marked as web_order awaiting checkout"
      />

      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border">
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Items</div>
          <div className="col-span-2">Subtotal</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-2">Last Update</div>
        </div>
        {webOrders.map(o => (
          <div key={o.id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-border hover:bg-muted/20">
            <div className="col-span-3">
              <p className="text-sm font-medium">{o.customerName}</p>
              <p className="text-xs text-muted-foreground">{o.customerEmail}</p>
            </div>
            <div className="col-span-3 text-sm">{o.items.map(i => i.name).join(', ')}</div>
            <div className="col-span-2 text-sm">£{o.subtotal.toLocaleString()}</div>
            <div className="col-span-2 text-sm font-medium">£{o.total.toLocaleString()}</div>
            <div className="col-span-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(o.createdAt).toLocaleDateString('en-GB')}
            </div>
          </div>
        ))}
        {webOrders.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-40" /> No active carts
          </div>
        )}
      </Card>
    </div>
  );
};

export default CartMonitor;
