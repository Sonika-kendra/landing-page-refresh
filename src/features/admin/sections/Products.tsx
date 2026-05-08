import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminPageHeader from '../components/AdminPageHeader';
import { productsApi } from '@/api/products';
import { toast } from '@/hooks/use-toast';

interface Product {
  item_id: string;
  sku: string;
  name: string;
  category_name?: string;
  rate: number;
  stock_on_hand?: number;
  status?: string;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  image_document_id?: string;
}

const Products = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');

  const loadProducts = (q?: string) => {
    setLoading(true);
    const params: Record<string, any> = { per_page: 50 };
    if (q) params.search = q;
    productsApi.list(params)
      .then(res => setItems(res.data?.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const handleSearch = () => loadProducts(search);

  const toggleBestseller = async (item: Product) => {
    try {
      await productsApi.updateTags(item.item_id, { isBestseller: !item.isBestseller });
      setItems(prev => prev.map(p => p.item_id === item.item_id ? { ...p, isBestseller: !p.isBestseller } : p));
    } catch {
      toast({ title: 'Failed to update tag', variant: 'destructive' });
    }
  };

  const filtered = items.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku ?? '').toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'all'
      || (type === 'Diamond' && (p.category_name?.toLowerCase().includes('diamond') ?? false))
      || (type === 'Jewellery' && !(p.category_name?.toLowerCase().includes('diamond') ?? false));
    return matchSearch && matchType;
  });

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage your diamond and jewellery catalogue"
        actions={
          <Button variant="outline" onClick={() => navigate('/admin/zoho')} className="gap-2">
            <Sparkles className="h-4 w-4" /> Sync from Zoho
          </Button>
        }
      />

      <Card className="p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search by name or SKU…"
            className="pl-9"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Diamond">Diamonds</SelectItem>
            <SelectItem value="Jewellery">Jewellery</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} variant="outline">Search</Button>
      </Card>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border">
          <div className="col-span-5">Product</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1">Stock</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2 text-right">Tags</div>
        </div>

        {loading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {filtered.map(p => (
              <div key={p.item_id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-border hover:bg-muted/20">
                <div className="col-span-5 flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sku}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <Badge variant="outline">{p.category_name ?? '—'}</Badge>
                </div>
                <div className={`col-span-1 text-sm ${(p.stock_on_hand ?? 0) < 2 ? 'text-destructive' : 'text-foreground'}`}>
                  {p.stock_on_hand ?? 0}
                </div>
                <div className="col-span-2 text-sm font-medium">£{(p.rate ?? 0).toLocaleString()}</div>
                <div className="col-span-2 flex justify-end items-center gap-1">
                  {p.isNewArrival && <Badge className="text-[10px] px-1.5">New</Badge>}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    title={p.isBestseller ? 'Remove bestseller' : 'Mark bestseller'}
                    onClick={() => toggleBestseller(p)}
                  >
                    <Star className={`h-3.5 w-3.5 ${p.isBestseller ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">No products found</div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Products;
