import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, User, Package, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminPageHeader from '../components/AdminPageHeader';
import { ordersApi } from '@/api/orders';
import { toast } from '@/hooks/use-toast';

type OrderStatus = 'web_order' | 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const ORDER_STATUS_FLOW: OrderStatus[] = ['web_order', 'placed', 'processing', 'shipped', 'delivered'];

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  web_order: 'placed',
  placed: 'processing',
  processing: 'shipped',
  shipped: 'delivered',
  delivered: null,
  cancelled: null,
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [updating, setUpdating] = useState(false);

  const load = () => {
    if (!id) return;
    ordersApi.getOne(id)
      .then(res => {
        setData(res.data);
        if (res.data?.orderStatus?.trackingNumber) setTrackingNumber(res.data.orderStatus.trackingNumber);
        if (res.data?.orderStatus?.carrier) setCarrier(res.data.orderStatus.carrier);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const advanceStatus = async () => {
    if (!id || !data?.orderStatus) return;
    const currentStatus: OrderStatus = data.orderStatus.status;
    const nextStatus = NEXT_STATUS[currentStatus];
    if (!nextStatus) return;

    setUpdating(true);
    try {
      if (currentStatus === 'web_order') {
        await ordersApi.confirm(id);
      } else {
        await ordersApi.updateStatus(id, nextStatus, {
          trackingNumber: nextStatus === 'shipped' ? trackingNumber : undefined,
          carrier: nextStatus === 'shipped' ? carrier : undefined,
        });
      }
      toast({ title: `Order moved to "${nextStatus.replace('_', ' ')}"` });
      load();
    } catch (err: any) {
      toast({ title: err?.response?.data?.error ?? 'Failed to update status', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const cancelOrder = async () => {
    if (!id) return;
    setUpdating(true);
    try {
      await ordersApi.cancel(id);
      toast({ title: 'Order cancelled' });
      load();
    } catch (err: any) {
      toast({ title: err?.response?.data?.error ?? 'Failed to cancel', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.salesorder) return <p className="text-sm text-muted-foreground">Order not found</p>;

  const order = data.salesorder;
  const extStatus: OrderStatus = data.orderStatus?.status ?? 'placed';
  const stepIdx = ORDER_STATUS_FLOW.indexOf(extStatus);
  const nextStatus = NEXT_STATUS[extStatus];
  const address = order.shipping_address;

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-3 gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <AdminPageHeader
        title={`Order ${order.salesorder_number}`}
        description={`Placed on ${order.date ? new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}`}
        actions={
          <div className="flex items-center gap-2">
            {nextStatus && (
              <Button size="sm" onClick={advanceStatus} disabled={updating} className="gap-2">
                {updating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Advance to "{nextStatus.replace('_', ' ')}"
              </Button>
            )}
            {extStatus !== 'cancelled' && extStatus !== 'delivered' && (
              <Button size="sm" variant="destructive" onClick={cancelOrder} disabled={updating}>Cancel Order</Button>
            )}
          </div>
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
        {extStatus === 'placed' && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Tracking Number</Label>
              <Input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Enter before shipping" className="h-8 mt-1" />
            </div>
            <div>
              <Label className="text-xs">Carrier</Label>
              <Input value={carrier} onChange={e => setCarrier(e.target.value)} placeholder="DHL, FedEx…" className="h-8 mt-1" />
            </div>
          </div>
        )}
        {data.orderStatus?.trackingNumber && extStatus === 'shipped' && (
          <p className="mt-3 text-sm text-muted-foreground">
            Tracking: <span className="text-foreground font-medium">{data.orderStatus.trackingNumber}</span>
            {data.orderStatus.carrier && ` via ${data.orderStatus.carrier}`}
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium">
            <Package className="h-4 w-4" /> Items
          </div>
          {(order.line_items ?? []).map((item: any) => (
            <div key={item.line_item_id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">£{(item.rate * item.quantity).toLocaleString()}</p>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>£{(order.sub_total ?? 0).toLocaleString()}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>£{(order.tax_total ?? 0).toLocaleString()}</span></div>
            <div className="flex justify-between font-medium text-base pt-1.5 border-t border-border"><span>Total</span><span>£{(order.total ?? 0).toLocaleString()}</span></div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium"><User className="h-4 w-4" /> Customer</div>
            <p className="text-sm">{order.customer_name}</p>
            {order.customer_email && <p className="text-xs text-muted-foreground">{order.customer_email}</p>}
          </Card>
          {address && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium"><MapPin className="h-4 w-4" /> Shipping</div>
              <p className="text-sm">{address.attention}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {address.address}<br />
                {address.city}, {address.zip}<br />
                {address.country}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
