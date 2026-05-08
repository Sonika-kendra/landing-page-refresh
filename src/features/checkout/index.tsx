import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin, CreditCard } from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { mockCart, calcCart } from '@/data/commerce/cart';
import { mockAddresses } from '@/data/commerce/orders';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const totals = calcCart(mockCart);
  const [addressId, setAddressId] = useState(mockAddresses[0].id);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  const placeOrder = () => {
    toast({ title: 'Order placed!', description: 'Reference HD-1007 — confirmation email sent.' });
    setTimeout(() => navigate('/account/orders'), 800);
  };

  return (
    <PageLayout>
      <div className="henig-container py-12">
        <h1 className="font-serif text-4xl text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-primary" />
                <h2 className="font-medium">Shipping Address</h2>
              </div>
              <RadioGroup value={addressId} onValueChange={setAddressId} className="space-y-2">
                {mockAddresses.map(a => (
                  <Label key={a.id} className="flex items-start gap-3 p-4 border border-border rounded cursor-pointer hover:bg-muted/30">
                    <RadioGroupItem value={a.id} className="mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.label} — {a.fullName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {a.line1}, {a.city}, {a.postcode}, {a.country}
                      </p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </Card>

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

          <Card className="p-6 h-fit sticky top-24">
            <h2 className="font-serif text-xl mb-4">Order Summary</h2>
            {mockCart.items.map(i => (
              <div key={i.productId} className="flex justify-between text-sm py-1.5">
                <span className="text-muted-foreground">{i.name} × {i.quantity}</span>
                <span>£{(i.price * i.quantity).toLocaleString()}</span>
              </div>
            ))}
            <Separator className="my-3" />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>£{totals.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">VAT</span><span>£{totals.tax.toLocaleString()}</span></div>
              <div className="flex justify-between text-base font-medium pt-1.5 border-t border-border"><span>Total</span><span>£{totals.total.toLocaleString()}</span></div>
            </div>
            <Button className="w-full mt-6 gap-2" onClick={placeOrder}>
              <CheckCircle2 className="h-4 w-4" /> Place Order
            </Button>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Checkout;
