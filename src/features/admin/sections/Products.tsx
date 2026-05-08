import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import AdminPageHeader from '../components/AdminPageHeader';
import { shopProducts } from '@/data/shop/products';

interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  type: 'Diamond' | 'Jewellery';
  price: number;
  stock: number;
  isNew?: boolean;
  isBestseller?: boolean;
  image: string;
}

const Products = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');

  const items: AdminProduct[] = useMemo(() => shopProducts.map((p, i) => ({
    id: p.id, sku: p.sku, name: p.name, category: p.category,
    type: (p.category.toLowerCase().includes('diamond') ? 'Diamond' : 'Jewellery'),
    price: p.price, stock: p.stock ?? 10,
    isNew: i < 3, isBestseller: i % 4 === 0, image: p.image,
  })), []);

  const filtered = items.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'all' || p.type === type;
    return matchSearch && matchType;
  });

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage your diamond and jewellery catalogue"
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/admin/zoho')} className="gap-2">
              <Sparkles className="h-4 w-4" /> Sync from Zoho
            </Button>
            <Button className="gap-2"><Plus className="h-4 w-4" /> New Product</Button>
          </>
        }
      />

      <Card className="p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or SKU..." className="pl-9" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Diamond">Diamonds</SelectItem>
            <SelectItem value="Jewellery">Jewellery</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border">
          <div className="col-span-5">Product</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-1">Stock</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-1">Tags</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        {filtered.map(p => (
          <div key={p.id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-border hover:bg-muted/20">
            <div className="col-span-5 flex items-center gap-3">
              <img src={p.image} alt={p.name} className="h-12 w-12 object-cover rounded" />
              <div>
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.sku}</p>
              </div>
            </div>
            <div className="col-span-2"><Badge variant="outline">{p.type}</Badge></div>
            <div className={`col-span-1 text-sm ${p.stock < 5 ? 'text-destructive' : 'text-foreground'}`}>{p.stock}</div>
            <div className="col-span-2 text-sm font-medium">£{p.price.toLocaleString()}</div>
            <div className="col-span-1 flex gap-1">
              {p.isNew && <Badge className="text-[10px] px-1.5">New</Badge>}
              {p.isBestseller && <Star className="h-3.5 w-3.5 fill-primary text-primary" />}
            </div>
            <div className="col-span-1 flex justify-end gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">No products found</div>
        )}
      </Card>
    </div>
  );
};

export default Products;
