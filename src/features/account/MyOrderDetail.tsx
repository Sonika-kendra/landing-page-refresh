import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Loader2, Package, CheckCircle2, Circle,
  Truck, ShoppingBag, Clock, Download, MessageCircle, Star, CalendarCheck,
  RefreshCw, Repeat2, Mail, Phone, User,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ordersApi } from '@/api/orders';

import ring1    from '@/assets/jewellery/bestseller/product1.png';
import ring2    from '@/assets/jewellery/category/ring.png';
import necklace from '@/assets/gemstone-necklace.jpg';
import earrings from '@/assets/jewellery/category/earrings.png';
import bracelet from '@/assets/tennis-bracelet.jpg';
import pendant  from '@/assets/jewellery/bestseller/product3.png';
import giftbox  from '@/assets/jewellery/bestseller/product2.png';

type OrderStatus = 'web_order' | 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const ORDER_STATUS_FLOW: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'web_order',  label: 'Order Placed', icon: <ShoppingBag className="h-4 w-4" /> },
  { key: 'placed',     label: 'Confirmed',    icon: <CheckCircle2 className="h-4 w-4" /> },
  { key: 'processing', label: 'Processing',   icon: <Clock className="h-4 w-4" /> },
  { key: 'shipped',    label: 'Shipped',      icon: <Truck className="h-4 w-4" /> },
  { key: 'delivered',  label: 'Delivered',    icon: <Package className="h-4 w-4" /> },
];

const STATUS_BADGE: Record<OrderStatus, { label: string; className: string }> = {
  web_order:  { label: 'Order Placed', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  placed:     { label: 'Confirmed',    className: 'bg-violet-100 text-violet-700 border-violet-200' },
  processing: { label: 'Processing',   className: 'bg-amber-100 text-amber-700 border-amber-200' },
  shipped:    { label: 'Shipped',      className: 'bg-sky-100 text-sky-700 border-sky-200' },
  delivered:  { label: 'Delivered',    className: 'bg-green-100 text-green-700 border-green-200' },
  cancelled:  { label: 'Cancelled',    className: 'bg-red-100 text-red-700 border-red-200' },
};

const ITEM_IMAGES: Record<string, string> = {
  'Diamond Solitaire Ring': ring1,
  'Gift Box':               giftbox,
  'Pearl Necklace':         necklace,
  'Emerald Earrings':       earrings,
  'Bracelet':               bracelet,
  'Pendant':                pendant,
  'Sapphire Ring':          ring2,
};

const DUMMY_ORDER_DETAIL: Record<string, any> = {
  'dummy-001': {
    salesorder: {
      salesorder_number: 'SO-00101',
      date: '2026-05-10',
      delivered_date: '2026-05-15',
      sub_total: 3900, tax_total: 350, total: 4250,
      line_items: [
        { line_item_id: '1a', name: 'Diamond Solitaire Ring', quantity: 1, rate: 3900 },
        { line_item_id: '1b', name: 'Gift Box',               quantity: 1, rate: 350 },
      ],
      shipping_address: { attention: 'Test User', address: '63-66 Hatton Garden', city: 'London', zip: 'EC1N 8LE', country: 'United Kingdom', phone: '+44 7700 900123', email: 'testuser@example.com' },
    },
    orderStatus: { status: 'delivered' },
  },
  'dummy-002': {
    salesorder: {
      salesorder_number: 'SO-00098',
      date: '2026-04-22',
      delivered_date: null,
      expected_date: '2026-04-27',
      sub_total: 1625, tax_total: 250, total: 1875,
      line_items: [
        { line_item_id: '2a', name: 'Pearl Necklace', quantity: 1, rate: 1875 },
      ],
      shipping_address: { attention: 'Test User', address: '10 Downing Street', city: 'London', zip: 'SW1A 2AA', country: 'United Kingdom', phone: '+44 7700 900456', email: 'testuser@example.com' },
    },
    orderStatus: { status: 'shipped' },
  },
  'dummy-003': {
    salesorder: {
      salesorder_number: 'SO-00085',
      date: '2026-03-15',
      delivered_date: null,
      expected_date: '2026-03-25',
      sub_total: 6200, tax_total: 790, total: 6990,
      line_items: [
        { line_item_id: '3a', name: 'Emerald Earrings', quantity: 1, rate: 3500 },
        { line_item_id: '3b', name: 'Bracelet',         quantity: 1, rate: 1800 },
        { line_item_id: '3c', name: 'Pendant',          quantity: 1, rate: 900 },
      ],
      shipping_address: { attention: 'Test User', address: '221B Baker Street', city: 'London', zip: 'NW1 6XE', country: 'United Kingdom', phone: '+44 7700 900789', email: 'testuser@example.com' },
    },
    orderStatus: { status: 'processing' },
  },
  'dummy-004': {
    salesorder: {
      salesorder_number: 'SO-00072',
      date: '2026-02-08',
      delivered_date: null,
      sub_total: 2750, tax_total: 350, total: 3100,
      line_items: [
        { line_item_id: '4a', name: 'Sapphire Ring', quantity: 1, rate: 3100 },
      ],
      shipping_address: { attention: 'Test User', address: '1 Infinite Loop', city: 'London', zip: 'W1A 1AA', country: 'United Kingdom', phone: '+44 7700 900321', email: 'testuser@example.com' },
    },
    orderStatus: { status: 'cancelled' },
  },
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const REPLACE_REASONS = [
  'Item arrived damaged',
  'Wrong item received',
  'Item does not match description',
  'Manufacturing defect',
  'Other',
];

const EXCHANGE_REASONS = [
  'Wrong size / fit',
  'Prefer a different style',
  'Gifting — different preference',
  'Upgrade to another item',
  'Other',
];

type RequestType = 'replace' | 'exchange';

interface ItemRequestDialogProps {
  open: boolean;
  type: RequestType;
  itemName: string;
  onClose: () => void;
}

const ItemRequestDialog = ({ open, type, itemName, onClose }: ItemRequestDialogProps) => {
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const reasons = type === 'replace' ? REPLACE_REASONS : EXCHANGE_REASONS;
  const title   = type === 'replace' ? 'Replace Item' : 'Exchange Item';

  const handleSubmit = () => {
    if (!reason) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    setReason('');
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'replace'
              ? <RefreshCw className="h-4 w-4 text-muted-foreground" />
              : <Repeat2   className="h-4 w-4 text-muted-foreground" />
            }
            {title}
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <p className="font-medium">Request submitted!</p>
            <p className="text-sm text-muted-foreground">
              Our team will contact you within 1–2 business days regarding your {type} request for <span className="font-medium text-foreground">{itemName}</span>.
            </p>
            <Button size="sm" onClick={handleClose} className="mt-2">Done</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-2">
              <div className="rounded-xl bg-muted/30 px-4 py-3 text-sm">
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-0.5">Item</p>
                <p className="font-medium">{itemName}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Reason for {type}</p>
                <Select onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason…" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm">Cancel</Button>
              </DialogClose>
              <Button size="sm" disabled={!reason} onClick={handleSubmit}>
                Submit Request
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ── Star rating widget ── */
const StarRating = () => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-2 py-2 text-center">
        <CheckCircle2 className="h-8 w-8 text-primary" />
        <p className="text-sm font-medium">Thanks for your feedback!</p>
        <p className="text-xs text-muted-foreground">Your review helps us improve.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => setSelected(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                n <= (hovered || selected)
                  ? 'fill-primary text-primary'
                  : 'fill-none text-muted-foreground/30'
              }`}
            />
          </button>
        ))}
      </div>
      {selected > 0 && (
        <Button
          size="sm"
          className="w-fit"
          onClick={() => setSubmitted(true)}
        >
          Submit Review
        </Button>
      )}
    </div>
  );
};

/* ── Main component ── */
const MyOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<{ type: RequestType; itemName: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    if (id in DUMMY_ORDER_DETAIL) {
      setData(DUMMY_ORDER_DETAIL[id]);
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
      <div className="flex justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.salesorder) {
    return (
      <div className="flex flex-col items-center py-24 text-center gap-3">
        <Package className="h-12 w-12 text-muted-foreground/30" />
        <p className="text-muted-foreground">Order not found</p>
        <Link to="/account/orders" className="text-sm underline underline-offset-2">Back to orders</Link>
      </div>
    );
  }

  const order        = data.salesorder;
  const extStatus: OrderStatus = data.orderStatus?.status ?? 'placed';
  const stepIdx      = ORDER_STATUS_FLOW.findIndex(s => s.key === extStatus);
  const isCancelled  = extStatus === 'cancelled';
  const isDelivered  = extStatus === 'delivered';
  const address      = order.shipping_address;
  const statusBadge  = STATUS_BADGE[extStatus];

  return (
    <div className="space-y-5">

      {/* Item request dialog */}
      {dialog && (
        <ItemRequestDialog
          open
          type={dialog.type}
          itemName={dialog.itemName}
          onClose={() => setDialog(null)}
        />
      )}

      {/* Back link */}
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
      </Link>

      {/* Hero header */}
      <div className="rounded-2xl bg-accent text-accent-foreground overflow-hidden">
        <div className="px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Left: order info */}
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-white/50">Order</p>
              <h2 className="font-serif text-3xl text-white">{order.salesorder_number}</h2>
              <p className="text-sm text-white/60">
                Placed on {order.date ? fmt(order.date) : '—'}
              </p>
              {/* Delivered / Expected date */}
              {isDelivered && order.delivered_date && (
                <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-medium">
                  <CalendarCheck className="h-3.5 w-3.5" />
                  Delivered on {fmt(order.delivered_date)}
                </div>
              )}
              {!isDelivered && !isCancelled && order.expected_date && (
                <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium">
                  <CalendarCheck className="h-3.5 w-3.5" />
                  Expected by {fmt(order.expected_date)}
                </div>
              )}
            </div>

            {/* Right: badge */}
            <div className="flex flex-col items-start sm:items-end gap-3">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold border ${statusBadge.className}`}>
                {statusBadge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Status tracker */}
        {!isCancelled && (
          <div className="px-6 pb-6">
            <div className="flex items-start">
              {ORDER_STATUS_FLOW.map((step, i) => {
                const done   = i <= stepIdx;
                const active = i === stepIdx;
                return (
                  <div key={step.key} className="flex-1 flex flex-col items-center gap-1.5 relative">
                    {i !== 0 && (
                      <div className={`absolute top-4 right-1/2 w-full h-0.5 ${i <= stepIdx ? 'bg-white/60' : 'bg-white/15'}`} />
                    )}
                    <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
                      ${active ? 'bg-white border-white text-accent shadow-lg scale-110'
                        : done  ? 'bg-white/20 border-white/60 text-white'
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
          </div>
        )}
      </div>

      {/* Items + Address — 50/50 */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* Order items */}
        <div className="w-full lg:w-1/2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/20">
            <p className="text-sm font-semibold">Items in your order</p>
          </div>
          <div className="divide-y divide-border">
            {(order.line_items ?? []).map((item: any) => {
              const img = ITEM_IMAGES[item.name] ?? null;
              return (
                <div key={item.line_item_id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/10 transition-colors">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-muted/30 border border-border">
                    {img
                      ? <img src={img} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setDialog({ type: 'exchange', itemName: item.name })}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg px-2.5 py-1 transition-colors hover:bg-muted/30"
                      >
                        <Repeat2 className="h-3 w-3" /> Exchange
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold text-sm whitespace-nowrap self-start">
                    £{(item.rate * item.quantity).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-4 bg-muted/20 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>£{(order.sub_total ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>VAT</span>
              <span>£{(order.tax_total ?? 0).toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base pt-0.5">
              <span>Total</span>
              <span>£{(order.total ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        {address && (
          <div className="w-full lg:w-1/2 rounded-2xl border border-border bg-card overflow-hidden flex-shrink-0 self-stretch flex flex-col">
            <div className="px-5 py-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/40">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold">Shipping Address</p>
              </div>
            </div>

            <div className="px-5 py-4 flex-1 space-y-3 text-sm">
              {/* Name */}
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{address.attention}</p>
                  <p className="text-xs text-muted-foreground">{address.address}</p>
                  <p className="text-xs text-muted-foreground">{address.city}, {address.zip}</p>
                  <p className="text-xs text-muted-foreground">{address.country}</p>
                </div>
              </div>

              {/* Phone */}
              {address.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href={`tel:${address.phone}`} className="text-sm hover:text-foreground text-muted-foreground transition-colors">
                    {address.phone}
                  </a>
                </div>
              )}

              {/* Email */}
              {address.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href={`mailto:${address.email}`} className="text-sm hover:text-foreground text-muted-foreground transition-colors truncate">
                    {address.email}
                  </a>
                </div>
              )}
            </div>

            {/* Download Invoice */}
            <div className="px-5 py-4 border-t border-border bg-muted/10">
              <button
                onClick={() => window.print()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Invoice
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Help + Rating — 50/50 */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Need help */}
        <div className="w-full lg:w-1/2 rounded-2xl border border-border bg-card px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/40">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold">Need help with your item?</p>
          </div>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Our team is here to help with returns, exchanges, sizing, or any questions about your order.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href="mailto:sales@henigdiamonds.co.uk" className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email Support
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="tel:+442074040146" className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Call Us
              </a>
            </Button>
          </div>
        </div>

        {/* Rate experience */}
        <div className="w-full lg:w-1/2 rounded-2xl border border-border bg-card px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
              <Star className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-semibold">Rate your experience</p>
          </div>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            How was your shopping experience with us? Tap a star to leave a rating.
          </p>
          <StarRating />
        </div>
      </div>

    </div>
  );
};

export default MyOrderDetail;
