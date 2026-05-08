import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin, CreditCard, Plus, Loader2 } from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { addressesApi, AddressPayload } from '@/api/addresses';
import { cartApi } from '@/api/cart';

interface Address {
  _id: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode?: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

const blank: AddressPayload = {
  label: 'Home', fullName: '', line1: '', city: '', country: 'United Kingdom',
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartId, clearCart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [newAddr, setNewAddr] = useState<AddressPayload>(blank);
  const [placing, setPlacing] = useState(false);
  const [addrLoading, setAddrLoading] = useState(true);

  useEffect(() => {
    addressesApi.list().then(res => {
      const list: Address[] = res.data?.addresses ?? [];
      setAddresses(list);
      const def = list.find(a => a.isDefault);
      if (def) setAddressId(def._id);
      else if (list[0]) setAddressId(list[0]._id);
    }).catch(() => {}).finally(() => setAddrLoading(false));
  }, []);

  const saveAddress = async () => {
    try {
      const res = await addressesApi.create({ ...newAddr, isDefault: addresses.length === 0 });
      const created: Address = res.data.address;
      setAddresses(prev => [...prev, created]);
      setAddressId(created._id);
      setAddOpen(false);
      setNewAddr(blank);
    } catch {
      toast({ title: 'Failed to save address', variant: 'destructive' });
    }
  };

  const placeOrder = async () => {
    if (!cartId) {
      toast({ title: 'Your cart is empty', variant: 'destructive' });
      return;
    }
    setPlacing(true);
    try {
      await cartApi.checkout(cartId);
      await clearCart();
      toast({ title: 'Order placed!', description: 'Confirmation email sent.' });
      navigate('/account/orders');
    } catch (err: any) {
      toast({
        title: 'Could not place order',
        description: err?.response?.data?.error ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPlacing(false);
    }
  };

  const items = cart?.line_items ?? [];
  const subtotal = cart?.sub_total ?? 0;
  const tax = cart?.tax_total ?? 0;
  const total = cart?.total ?? 0;

  return (
    <PageLayout>
      <div className="henig-container py-12">
        <h1 className="font-serif text-4xl text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {/* Shipping Address */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h2 className="font-medium">Shipping Address</h2>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setAddOpen(true)}>
                  <Plus className="h-3.5 w-3.5" /> Add New
                </Button>
              </div>

              {addrLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : addresses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved addresses. Add one to continue.</p>
              ) : (
                <RadioGroup value={addressId} onValueChange={setAddressId} className="space-y-2">
                  {addresses.map(a => (
                    <Label
                      key={a._id}
                      className="flex items-start gap-3 p-4 border border-border rounded cursor-pointer hover:bg-muted/30"
                    >
                      <RadioGroupItem value={a._id} className="mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{a.label} — {a.fullName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {a.line1}, {a.city}, {a.postalCode}, {a.country}
                        </p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            </Card>

            {/* Payment */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-4 w-4 text-primary" />
                <h2 className="font-medium">Payment Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label>Card Number</Label>
                  <Input placeholder="1234 5678 9012 3456" />
                </div>
                <div>
                  <Label>Expiry</Label>
                  <Input placeholder="MM/YY" />
                </div>
                <div>
                  <Label>CVC</Label>
                  <Input placeholder="123" />
                </div>
              </div>
            </Card>
          </div>

          {/* Summary */}
          <Card className="p-6 h-fit sticky top-24">
            <h2 className="font-serif text-xl mb-4">Order Summary</h2>
            {items.map(i => (
              <div key={i.line_item_id} className="flex justify-between text-sm py-1.5">
                <span className="text-muted-foreground">{i.name} × {i.quantity}</span>
                <span>£{(i.rate * i.quantity).toLocaleString()}</span>
              </div>
            ))}
            <Separator className="my-3" />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>£{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT</span>
                <span>£{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-medium pt-1.5 border-t border-border">
                <span>Total</span>
                <span>£{total.toLocaleString()}</span>
              </div>
            </div>
            <Button
              className="w-full mt-6 gap-2"
              onClick={placeOrder}
              disabled={placing || !cartId || addresses.length === 0}
            >
              {placing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Place Order
            </Button>
          </Card>
        </div>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Address</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Label</Label>
              <Input value={newAddr.label ?? ''} onChange={e => setNewAddr({ ...newAddr, label: e.target.value })} placeholder="Home, Office…" />
            </div>
            <div className="col-span-2">
              <Label>Full Name</Label>
              <Input value={newAddr.fullName} onChange={e => setNewAddr({ ...newAddr, fullName: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Address Line</Label>
              <Input value={newAddr.line1} onChange={e => setNewAddr({ ...newAddr, line1: e.target.value })} />
            </div>
            <div>
              <Label>City</Label>
              <Input value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })} />
            </div>
            <div>
              <Label>Postcode</Label>
              <Input value={newAddr.postalCode ?? ''} onChange={e => setNewAddr({ ...newAddr, postalCode: e.target.value })} />
            </div>
            <div>
              <Label>Country</Label>
              <Input value={newAddr.country} onChange={e => setNewAddr({ ...newAddr, country: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={newAddr.phone ?? ''} onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={saveAddress}>Save Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Checkout;
