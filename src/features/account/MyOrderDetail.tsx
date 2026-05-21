import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ordersApi } from '@/api/orders';

type OrderStatus = 'web_order' | 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const ORDER_STATUS_FLOW: OrderStatus[] = ['web_order', 'placed', 'processing', 'shipped', 'delivered'];

const DUMMY_DATA = {
  salesorder: {
    salesorder_number: 'SO-TEST-001',
    date: '2026-05-15',
    sub_total: 4250,
    tax_total: 0,
    total: 4250,
    shipping_address: {
      attention: 'Test User',
      address: '63-66 Hatton Garden',
      city: 'London',
      zip: 'EC1N 8LE',
      country: 'United Kingdom',
    },
    line_items: [
      { line_item_id: 'li-1', name: 'Round Brilliant Diamond 1.5ct', quantity: 1, rate: 3500 },
      { line_item_id: 'li-2', name: 'Platinum Solitaire Setting', quantity: 1, rate: 750 },
    ],
  },
  orderStatus: { status: 'processing' as OrderStatus },
};

const MyOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    if (id === 'dummy-001') {
      setData(DUMMY_DATA);
      setLoading(false);
      return;
    }
    ordersApi.getOne(id)
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.salesorder) {
    return <p className="text-sm text-muted-foreground">Order not found</p>;
  }

  const order = data.salesorder;
  const extStatus: OrderStatus = data.orderStatus?.status ?? 'placed';
  const stepIdx = ORDER_STATUS_FLOW.indexOf(extStatus);
  const address = order.shipping_address;

  return (
    <div className="space-y-4">
      <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
      </Link>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-serif text-2xl">{order.salesorder_number}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Placed on {order.date ? new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
          <Badge>{extStatus.replace('_', ' ')}</Badge>
        </div>

        {/* Status timeline */}
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

        {(order.line_items ?? []).map((item: any) => (
          <div key={item.line_item_id} className="flex justify-between py-3 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">£{(item.rate * item.quantity).toLocaleString()}</p>
          </div>
        ))}

        <div className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>£{(order.sub_total ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAT</span>
            <span>£{(order.tax_total ?? 0).toLocaleString()}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>£{(order.total ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {address && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium">
            <MapPin className="h-4 w-4" /> Shipping Address
          </div>
          <p className="text-sm">{address.attention}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {address.address}<br />
            {address.city}, {address.zip}<br />
            {address.country}
          </p>
        </Card>
      )}
    </div>
  );
};

export default MyOrderDetail;
