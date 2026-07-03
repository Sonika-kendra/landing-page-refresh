import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, Package, ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminPageHeader from '../components/AdminPageHeader';
import DataTable from '@/components/shared/common/DataTable';
import type { ColumnDef } from '@/components/shared/common/DataTable';
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
}

const isDiamond = (p: Product) =>
  p.category_name?.toLowerCase().includes('diamond') ?? false;

const Products = () => {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<string | null>(null);

  const toggleBestseller = async (item: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await productsApi.updateTags(item.item_id, { isBestseller: !item.isBestseller });
      setRefreshKey((k) => k + 1);
    } catch {
      toast({ title: 'Failed to update tag', variant: 'destructive' });
    }
  };

  const handleUploadImage = (item: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    uploadTargetRef.current = item.item_id;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = uploadTargetRef.current;
    e.target.value = '';
    if (!file || !id) return;
    setUploadingId(id);
    try {
      await productsApi.uploadImage(id, file);
      toast({ title: 'Image uploaded to WorkDrive', description: 'Product image updated.' });
      setRefreshKey((k) => k + 1);
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploadingId(null);
      uploadTargetRef.current = null;
    }
  };

  const searchFn = useCallback(
    (p: Product, q: string) => {
      const matchText =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku ?? '').toLowerCase().includes(q) ||
        (p.category_name ?? '').toLowerCase().includes(q);

      const matchType =
        typeFilter === 'all' ||
        (typeFilter === 'Diamond' ? isDiamond(p) : !isDiamond(p));

      return matchText && matchType;
    },
    [typeFilter],
  );

  const columns: ColumnDef<Product>[] = [
    {
      key: 'name',
      label: 'Product',
      sortable: true,
      render: (_, p) => (
        <div>
          <p className="text-sm font-medium">{p.name}</p>
          <p className="text-xs text-muted-foreground">{p.sku}</p>
        </div>
      ),
    },
    {
      key: 'category_name',
      label: 'Category',
      width: '160px',
      render: (val) => <Badge variant="outline">{(val as string) ?? '—'}</Badge>,
    },
    {
      key: 'stock_on_hand',
      label: 'Stock',
      width: '80px',
      align: 'center',
      sortable: true,
      render: (val) => (
        <span
          className={`text-sm ${((val as number) ?? 0) < 2 ? 'text-destructive' : 'text-foreground'}`}
        >
          {(val as number) ?? 0}
        </span>
      ),
    },
    {
      key: 'rate',
      label: 'Price',
      width: '120px',
      sortable: true,
      render: (val) => (
        <span className="text-sm font-medium">
          £{((val as number) ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'isBestseller',
      label: 'Tags',
      width: '140px',
      align: 'right',
      render: (_, p) => (
        <div className="flex items-center justify-end gap-1.5">
          {p.isNewArrival && <Badge className="text-[10px] px-1.5">New</Badge>}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            title="Upload custom image to WorkDrive"
            onClick={(e) => handleUploadImage(p, e)}
            disabled={uploadingId === p.item_id}
          >
            {uploadingId === p.item_id
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <ImagePlus className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            }
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            title={p.isBestseller ? 'Remove bestseller' : 'Mark bestseller'}
            onClick={(e) => toggleBestseller(p, e)}
          >
            <Star
              className={`h-3.5 w-3.5 ${
                p.isBestseller ? 'fill-primary text-primary' : 'text-muted-foreground'
              }`}
            />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <AdminPageHeader
        title="Products"
        description="Manage your diamond and jewellery catalogue"
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/admin/zoho')}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Sync from Zoho
          </Button>
        }
      />

      <DataTable<Product>
        queryKey={['admin', 'products']}
        fetchFn={() => productsApi.list({ per_page: 200 })}
        dataKey="items"
        columns={columns}
        clientSidePagination
        clientSideSearchFn={searchFn}
        searchable
        searchPlaceholder="Search by name or SKU…"
        refreshKey={refreshKey}
        emptyIcon={<Package className="h-10 w-10 opacity-25" />}
        emptyMessage="No products found."
        onRowClick={(p) => navigate(`/admin/products/${p.item_id}`)}
        toolbar={
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-44 text-sm rounded-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Diamond">Diamonds</SelectItem>
              <SelectItem value="Jewellery">Jewellery</SelectItem>
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
};

export default Products;
