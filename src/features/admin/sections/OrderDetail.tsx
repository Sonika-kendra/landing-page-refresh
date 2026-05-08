import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, User, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import AdminPageHeader from '../components/AdminPageHeader';
import { mockOrders, OrderStatus, ORDER_STATUS_FLOW } from '@/data/commerce/orders';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = mockOrders.find(o => o.id === id);
  const [status, setStatus] = useState<OrderStatus>(order?.status ?? 'placed');

  if (!order) return <p className="text-sm text-muted-foreground">Order not found</p>;

  const stepIdx = ORDER_STATUS_FLOW.indexOf(status);

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-3 gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <AdminPageHeader
        title={`Order ${order.reference}`}
        description={`Placed on ${new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
        actions={
          <Select value={status} onValueChange={(v: OrderStatus) => setStatus(v)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="web_order">Web Order</SelectItem>
              <SelectItem value="placed">Placed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Status timeline */}
      <Card className="p-6 mb-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Order Status</p>
        <div className="flex items-center gap-2">
          {ORDER_STATUS_FLOW.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`flex-1 h-1.5 rounded-full ${i <= stepIdx ? 'bg-primary' : 'bg-muted'}`} />
              <span className={`text-xs whitespace-nowrap capitalize ${i <= stepIdx ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {s.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium">
            <Package className="h-4 w-4" /> Items
          </div>
          {order.items.map(item => (
            <div key={item.productId} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">SKU: {item.sku} · Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">£{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>£{order.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Tax (20%)</span><span>£{order.tax.toLocaleString()}</span></div>
            <div className="flex justify-between font-medium text-base pt-1.5 border-t border-border"><span>Total</span><span>£{order.total.toLocaleString()}</span></div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium"><User className="h-4 w-4" /> Customer</div>
            <p className="text-sm">{order.customerName}</p>
            <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium"><MapPin className="h-4 w-4" /> Shipping</div>
            <p className="text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {order.shippingAddress.line1}<br />
              {order.shippingAddress.city}, {order.shippingAddress.postcode}<br />
              {order.shippingAddress.country}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
