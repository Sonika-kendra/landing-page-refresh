import { useState, useEffect } from 'react';
import { ShoppingCart, Clock, Loader2, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminPageHeader from '../components/AdminPageHeader';
import { ordersApi } from '@/api/orders';

interface DraftOrder {
  salesorder_id: string;
  salesorder_number: string;
  customer_name: string;
  customer_email?: string;
  line_items: any[];
  sub_total: number;
  total: number;
  last_modified_time?: string;
  created_time?: string;
}

const CartMonitor = () => {
  const [carts, setCarts] = useState<DraftOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    ordersApi.list({ status: 'draft', per_page: 100 })
      .then(res => setCarts(res.data?.salesorders ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <AdminPageHeader
        title="Active Carts"
        description="Live draft orders (carts) awaiting checkout"
        actions={
          <Button size="sm" variant="outline" onClick={load} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border">
          <div className="col-span-3">Customer</div>
          <div className="col-span-4">Items</div>
          <div className="col-span-2">Subtotal</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-1">Last Update</div>
        </div>

        {loading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {carts.map(o => (
              <div key={o.salesorder_id} className="grid grid-cols-12 gap-4 px-4 py-3 items-start border-b border-border hover:bg-muted/20">
                <div className="col-span-3">
                  <p className="text-sm font-medium">{o.customer_name}</p>
                  {o.customer_email && <p className="text-xs text-muted-foreground">{o.customer_email}</p>}
                  <Badge variant="secondary" className="text-[10px] mt-1">Draft</Badge>
                </div>
                <div className="col-span-4 text-sm text-muted-foreground">
                  {(o.line_items ?? []).map((i: any) => i.name).join(', ') || '—'}
                </div>
                <div className="col-span-2 text-sm">£{(o.sub_total ?? 0).toLocaleString()}</div>
                <div className="col-span-2 text-sm font-medium">£{(o.total ?? 0).toLocaleString()}</div>
                <div className="col-span-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {o.last_modified_time
                    ? new Date(o.last_modified_time).toLocaleDateString('en-GB')
                    : '—'}
                </div>
              </div>
            ))}
            {carts.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-40" /> No active carts
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default CartMonitor;
