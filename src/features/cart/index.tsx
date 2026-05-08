import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockCart, calcCart } from '@/data/commerce/cart';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(mockCart);
  const totals = calcCart(cart);

  const setQty = (productId: string, delta: number) =>
    setCart({
      ...cart,
      items: cart.items.map(i => i.productId === productId
        ? { ...i, quantity: Math.max(1, i.quantity + delta) }
        : i),
    });

  const remove = (productId: string) =>
    setCart({ ...cart, items: cart.items.filter(i => i.productId !== productId) });

  return (
    <PageLayout>
      <div className="henig-container py-12">
        <h1 className="font-serif text-4xl text-foreground mb-2">Shopping Bag</h1>
        <p className="text-sm text-muted-foreground mb-8">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your bag</p>

        {cart.items.length === 0 ? (
          <Card className="p-16 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground mb-4">Your bag is empty</p>
            <Link to="/shop"><Button>Continue Shopping</Button></Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {cart.items.map(item => (
                <Card key={item.productId} className="p-4 flex gap-4">
                  {item.image && <img src={item.image} alt={item.name} className="h-24 w-24 object-cover rounded" />}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-foreground">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => remove(item.productId)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-border rounded">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setQty(item.productId, -1)}>
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setQty(item.productId, 1)}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="font-medium">£{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 h-fit sticky top-24">
              <h2 className="font-serif text-xl mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>£{totals.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">VAT (20%)</span><span>£{totals.tax.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-primary">Free</span></div>
                <Separator className="my-3" />
                <div className="flex justify-between text-base font-medium"><span>Total</span><span>£{totals.total.toLocaleString()}</span></div>
              </div>
              <Button className="w-full mt-6 gap-2" onClick={() => navigate('/checkout')}>
                Checkout <ArrowRight className="h-4 w-4" />
              </Button>
              <Link to="/shop" className="block text-center text-xs text-muted-foreground mt-3 hover:text-foreground">
                Continue shopping
              </Link>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Cart;
