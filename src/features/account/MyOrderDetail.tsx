import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { mockOrders, ORDER_STATUS_FLOW } from '@/data/commerce/orders';

const MyOrderDetail = () => {
  const { id } = useParams();
  const order = mockOrders.find(o => o.id === id);
  if (!order) return <p className="text-sm text-muted-foreground">Order not found</p>;
  const stepIdx = ORDER_STATUS_FLOW.indexOf(order.status);

  return (
    <div className="space-y-4">
      <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
      </Link>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-serif text-2xl">{order.reference}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Badge>{order.status.replace('_', ' ')}</Badge>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {ORDER_STATUS_FLOW.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`flex-1 h-1 rounded-full ${i <= stepIdx ? 'bg-primary' : 'bg-muted'}`} />
              <span className={`text-[10px] capitalize whitespace-nowrap ${i <= stepIdx ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>

        {order.items.map(item => (
          <div key={item.productId} className="flex justify-between py-3 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">SKU: {item.sku} · Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">£{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}

        <div className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>£{order.subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">VAT</span><span>£{order.tax.toLocaleString()}</span></div>
          <Separator />
          <div className="flex justify-between font-medium"><span>Total</span><span>£{order.total.toLocaleString()}</span></div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium"><MapPin className="h-4 w-4" /> Shipping Address</div>
        <p className="text-sm">{order.shippingAddress.fullName}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {order.shippingAddress.line1}<br />
          {order.shippingAddress.city}, {order.shippingAddress.postcode}<br />
          {order.shippingAddress.country}
        </p>
      </Card>
    </div>
  );
};

export default MyOrderDetail;
