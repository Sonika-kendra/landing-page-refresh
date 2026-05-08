import { useState } from 'react';
import { AlertTriangle, Package, Plus, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminPageHeader from '../components/AdminPageHeader';
import { mockStock, StockItem } from '@/data/commerce/stock';

const Stock = () => {
  const [items, setItems] = useState<StockItem[]>(mockStock);

  const adjust = (id: string, delta: number) =>
    setItems(items.map(i => i.productId === id ? { ...i, available: Math.max(0, i.available + delta) } : i));

  const lowStock = items.filter(i => i.available <= i.threshold).length;

  return (
    <div>
      <AdminPageHeader
        title="Stock Management"
        description="Monitor inventory and adjust availability"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total SKUs</p>
          <p className="text-2xl font-light mt-1">{items.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">In Stock</p>
          <p className="text-2xl font-light mt-1">{items.reduce((s, i) => s + i.available, 0)}</p>
        </Card>
        <Card className="p-4 border-destructive/30">
          <p className="text-xs text-destructive uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" /> Low Stock Alert
          </p>
          <p className="text-2xl font-light mt-1 text-destructive">{lowStock}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border">
          <div className="col-span-4">Product</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Available</div>
          <div className="col-span-1">Reserved</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Adjust</div>
        </div>
        {items.map(item => {
          const low = item.available <= item.threshold;
          return (
            <div key={item.productId} className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-border hover:bg-muted/20">
              <div className="col-span-4">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.sku}</p>
              </div>
              <div className="col-span-2 text-sm text-muted-foreground">{item.category}</div>
              <div className={`col-span-2 text-sm font-medium ${low ? 'text-destructive' : ''}`}>{item.available}</div>
              <div className="col-span-1 text-sm text-muted-foreground">{item.reserved}</div>
              <div className="col-span-1">
                {item.available === 0
                  ? <Badge variant="destructive">Out</Badge>
                  : low ? <Badge variant="outline" className="border-destructive/40 text-destructive">Low</Badge>
                  : <Badge variant="default">OK</Badge>}
              </div>
              <div className="col-span-2 flex justify-end items-center gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => adjust(item.productId, -1)}>
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="text-sm w-8 text-center">{item.available}</span>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => adjust(item.productId, 1)}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default Stock;
