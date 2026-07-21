import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, User, Package, ShoppingBag, CheckCircle2, Clock, Truck, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import LoadingSpinner from '@/components/shared/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AdminPageHeader from '../components/AdminPageHeader';
import ReasonSelect, { resolveReason } from '@/components/shared/common/ReasonSelect';
import { ordersApi } from '@/api/orders';
import { toast } from '@/hooks/use-toast';
import defaultProductImage from '@/assets/product-placeholder.svg';

// One workflow, client -> admin -> client:
//   draft (shopping, not yet an order) -> web_order (placed, awaiting admin review)
//     -> [Approve] placed -> processing -> shipped -> delivered
//     -> [Reject/Cancel] cancelled  (allowed from web_order up to shipped)
type OrderStatus = 'web_order' | 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const ORDER_STEPS: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'web_order',  label: 'Web Order',  icon: <ShoppingBag className="h-4 w-4" /> },
  { key: 'placed',     label: 'Placed',     icon: <CheckCircle2 className="h-4 w-4" /> },
  { key: 'processing', label: 'Processing', icon: <Clock className="h-4 w-4" /> },
  { key: 'shipped',    label: 'Shipped',    icon: <Truck className="h-4 w-4" /> },
  { key: 'delivered',  label: 'Delivered',  icon: <Package className="h-4 w-4" /> },
];
const ORDER_STATUS_FLOW: OrderStatus[] = ORDER_STEPS.map((s) => s.key);

const CANCEL_REASONS = [
  'Customer requested cancellation',
  'Payment failed or declined',
  'Item out of stock',
  'Suspected fraudulent order',
  'Duplicate order',
  'Price exceeds approval threshold',
  'Custom or bespoke item needs consultation',
  'Customer verification required',
];

// Admin-selectable forward/override steps — cancellation is a dedicated side-exit
// (Approve/Reject at web_order, Cancel Order afterward), not a dropdown option.
const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'web_order', label: 'Web Order' },
  { value: 'placed', label: 'Placed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('web_order');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelPreset, setCancelPreset] = useState('');
  const [cancelOther, setCancelOther] = useState('');
  const [approving, setApproving] = useState(false);

  const load = () => {
    if (!id) return;
    ordersApi.getOne(id)
      .then(res => {
        setData(res.data);
        if (res.data?.orderStatus?.status) setSelectedStatus(res.data.orderStatus.status);
        if (res.data?.orderStatus?.trackingNumber) setTrackingNumber(res.data.orderStatus.trackingNumber);
        if (res.data?.orderStatus?.carrier) setCarrier(res.data.orderStatus.carrier);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const applyStatusChange = async () => {
    if (!id || !data?.orderStatus || selectedStatus === data.orderStatus.status) return;

    setUpdating(true);
    try {
      await ordersApi.updateStatus(id, selectedStatus, {
        trackingNumber: selectedStatus === 'shipped' ? trackingNumber : undefined,
        carrier: selectedStatus === 'shipped' ? carrier : undefined,
      });
      toast({ title: `Order status updated to "${selectedStatus.replace('_', ' ')}"` });
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
      await ordersApi.cancel(id, resolveReason(cancelPreset, cancelOther));
      toast({ title: 'Order cancelled' });
      setCancelDialogOpen(false);
      setCancelPreset('');
      setCancelOther('');
      load();
    } catch (err: any) {
      toast({ title: err?.response?.data?.error ?? 'Failed to cancel', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const approveOrder = async () => {
    if (!id) return;
    setApproving(true);
    try {
      await ordersApi.confirm(id);
      toast({ title: 'Order approved' });
      load();
    } catch (err: any) {
      toast({ title: err?.response?.data?.error ?? 'Failed to approve order', variant: 'destructive' });
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size={24} />
      </div>
    );
  }

  if (!data?.salesorder) return <p className="text-sm text-muted-foreground">Order not found</p>;

  const order = data.salesorder;
  const isZoho = data.source === 'zoho';
  const extStatus: OrderStatus = data.orderStatus?.status ?? 'placed';
  const isPendingReview = extStatus === 'web_order';
  const address = order.shipping_address;

  const isCancelled = extStatus === 'cancelled';
  // Cancelled orders aren't part of the linear flow — show progress up to whatever
  // stage they'd reached (from history) rather than blanking the whole timeline.
  const history: { status: OrderStatus }[] = data.orderStatus?.history ?? [];
  const lastRealStatus: OrderStatus = isCancelled
    ? ([...history].reverse().find((h) => h.status !== 'cancelled')?.status ?? 'web_order')
    : extStatus;
  const stepIdx = ORDER_STATUS_FLOW.indexOf(lastRealStatus);

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-3 gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <AdminPageHeader
        title={`Order ${order.salesorder_number}`}
        description={`Placed on ${order.date ? new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}`}
        actions={
          isZoho ? (
            <Badge variant="secondary">Synced from Zoho · Read-only</Badge>
          ) : !data.orderStatus ? (
            <Badge variant="outline">Draft cart — not yet placed</Badge>
          ) : (
            <div className="flex items-center gap-2">
              {isPendingReview ? (
                <>
                  <Button size="sm" variant="outline" onClick={approveOrder} disabled={approving}>
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setCancelDialogOpen(true)} disabled={approving}>
                    Reject
                  </Button>
                </>
              ) : (
                <>
                  <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as OrderStatus)}>
                    <SelectTrigger className="h-9 w-40 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={applyStatusChange}
                    disabled={updating || selectedStatus === extStatus}
                    className="gap-2"
                  >
                    {updating && <LoadingSpinner size={14} />}
                    Update Status
                  </Button>
                  {extStatus !== 'delivered' && extStatus !== 'cancelled' && (
                    <Button size="sm" variant="destructive" onClick={() => setCancelDialogOpen(true)} disabled={updating}>Cancel Order</Button>
                  )}
                </>
              )}
            </div>
          )
        }
      />

      {/* Status timeline — only meaningful once the cart has actually been checked out */}
      {data.orderStatus && (
        <Card className="p-6 mb-4 rounded-2xl bg-accent text-accent-foreground overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-wider text-white/50">Order Status</p>
            {isCancelled && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold border bg-red-100 text-red-700 border-red-200">
                Cancelled
              </span>
            )}
          </div>
          <div className="flex items-start">
            {ORDER_STEPS.map((step, i) => {
              const done   = i <= stepIdx;
              const active = i === stepIdx;
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center gap-1.5 relative">
                  {i !== 0 && (
                    <div className={`absolute top-4 right-1/2 w-full h-0.5 ${i <= stepIdx ? (isCancelled ? 'bg-red-400/60' : 'bg-white/60') : 'bg-white/15'}`} />
                  )}
                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
                    ${active ? (isCancelled ? 'bg-red-400 border-red-400 text-white shadow-lg' : 'bg-white border-white text-accent shadow-lg scale-110')
                      : done  ? (isCancelled ? 'bg-red-400/30 border-red-400/60 text-white' : 'bg-white/20 border-white/60 text-white')
                              : 'bg-transparent border-white/20 text-white/30'}`}>
                    {done ? step.icon : <Circle className="h-3 w-3" />}
                  </div>
                  <span className={`text-[10px] text-center leading-tight ${done ? 'text-white/80' : 'text-white/30'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          {isCancelled && (
            <p className="mt-3 text-xs text-white/60">
              Cancelled after reaching "{lastRealStatus.replace('_', ' ')}"
              {data.orderStatus?.cancelReason && ` — ${data.orderStatus.cancelReason}`}
            </p>
          )}
          {!isZoho && selectedStatus === 'shipped' && extStatus !== 'shipped' && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-white/70">Tracking Number</Label>
                <Input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Enter before shipping" className="h-8 mt-1" />
              </div>
              <div>
                <Label className="text-xs text-white/70">Carrier</Label>
                <Input value={carrier} onChange={e => setCarrier(e.target.value)} placeholder="DHL, FedEx…" className="h-8 mt-1" />
              </div>
            </div>
          )}
          {data.orderStatus?.trackingNumber && extStatus === 'shipped' && (
            <p className="mt-3 text-sm text-white/60">
              Tracking: <span className="text-white font-medium">{data.orderStatus.trackingNumber}</span>
              {data.orderStatus.carrier && ` via ${data.orderStatus.carrier}`}
            </p>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium">
            <Package className="h-4 w-4" /> Items
          </div>
          {(order.line_items ?? []).map((item: any) => (
            <div key={item.line_item_id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <div className="h-12 w-12 flex-shrink-0 rounded overflow-hidden bg-muted">
                <img
                  src={item.image || defaultProductImage}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultProductImage; }}
                />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">£{(item.rate * item.quantity).toLocaleString()}</p>
              </div>
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
              <div className="flex items-center gap-2 mb-3 text-sm font-medium"><MapPin className="h-4 w-4" /> Delivery Address</div>
              <p className="text-sm">{address.attention}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {address.address}<br />
                {address.city}, {address.zip}<br />
                {address.country}
              </p>
              {address.phone && <p className="text-xs text-muted-foreground mt-1">{address.phone}</p>}
            </Card>
          )}
        </div>
      </div>

      <AlertDialog
        open={cancelDialogOpen}
        onOpenChange={(open) => {
          setCancelDialogOpen(open);
          if (!open) { setCancelPreset(''); setCancelOther(''); }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isPendingReview ? 'Reject Order' : 'Cancel Order'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isPendingReview ? 'Reject' : 'Cancel'} order <strong>{order.salesorder_number}</strong>?
              This cannot be undone — you can optionally include a reason.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ReasonSelect
            reasons={CANCEL_REASONS}
            preset={cancelPreset}
            onPresetChange={setCancelPreset}
            otherText={cancelOther}
            onOtherTextChange={setCancelOther}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={cancelOrder}
              disabled={updating}
            >
              {updating ? 'Saving…' : (isPendingReview ? 'Reject Order' : 'Cancel Order')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderDetail;
