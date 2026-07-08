import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import LoadingSpinner from '@/components/shared/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { getMetalType } from '@/data/shop/metalTypes';
import { toast } from '@/hooks/use-toast';

const fmt = (n: number) => n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, removeItem, updateQuantity } = useCart();

  const handleRemove = async (lineItemId: string) => {
    try { await removeItem(lineItemId); }
    catch { toast({ title: 'Could not remove item', variant: 'destructive' }); }
  };

  const handleUpdateQty = async (lineItemId: string, qty: number) => {
    try { await updateQuantity(lineItemId, qty); }
    catch { toast({ title: 'Could not update quantity', variant: 'destructive' }); }
  };

  const items = cart?.line_items ?? [];
  const subtotal = cart?.sub_total ?? 0;
  const tax = cart?.tax_total ?? 0;
  const total = cart?.total ?? 0;

  return (
    <PageLayout>
      <div className="henig-container py-12">
        <h1 className="font-serif text-4xl text-foreground mb-2">Shopping Bag</h1>
        <p className="text-sm text-muted-foreground mb-8">
          {items.length} {items.length === 1 ? 'item' : 'items'} in your bag
        </p>

        {loading && items.length === 0 ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size={32} />
          </div>
        ) : items.length === 0 ? (
          <Card className="p-16 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground mb-4">Your bag is empty</p>
            <Link to="/jewellery/all"><Button>Continue Shopping</Button></Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {items.map(item => (
                <Card key={item.line_item_id} className="p-4 flex gap-4">
                  <Link to={`/jewellery/all/${item.item_id}`} className="h-24 w-24 flex-shrink-0 rounded overflow-hidden bg-muted">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      : <div className="h-full w-full" />}
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link to={`/jewellery/all/${item.item_id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {item.metal && (() => {
                            const metal = getMetalType(item.metal);
                            return (
                              <span
                                className="inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide ring-2 ring-foreground/70 ring-offset-1"
                                style={{
                                  backgroundImage: metal.image ? `url(${metal.image})` : undefined,
                                  backgroundColor: metal.image ? undefined : metal.bg,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  color: '#000',
                                }}
                                title={metal.name}
                              >
                                {metal.label}
                              </span>
                            );
                          })()}
                          {item.size && (
                            <span className="text-xs text-muted-foreground">Size: {item.size}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemove(item.line_item_id)}
                        disabled={loading}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-border rounded">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          disabled={loading}
                          onClick={() => handleUpdateQty(item.line_item_id, item.quantity - 1)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          disabled={loading}
                          onClick={() => handleUpdateQty(item.line_item_id, item.quantity + 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="font-medium">£{fmt(item.rate * item.quantity)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 h-fit sticky top-24">
              <h2 className="font-serif text-xl mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>£{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT</span>
                  <span>£{fmt(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-primary">Free</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-base font-medium">
                  <span>Total</span>
                  <span>£{fmt(total)}</span>
                </div>
              </div>
              <Button className="w-full mt-6 gap-2" onClick={() => navigate('/checkout')} disabled={loading}>
                Checkout <ArrowRight className="h-4 w-4" />
              </Button>
              <Link to="/jewellery/all" className="block text-center text-xs text-muted-foreground mt-3 hover:text-foreground">
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
