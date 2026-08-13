import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Package, Copy, Check } from 'lucide-react';
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

interface Product {
  id: string;
  sku: string;
  name: string;
  category?: string;
  price: number;
  currency?: string;
  stock?: number;
  status?: string;
}

// Zoho cf_status values a live item can have — anything else (Sold, Returned, …) is
// dropped from the local catalogue by the sync job, so these are the only real options.
const STATUS_OPTIONS = ['Available', 'In Transit', 'Waiting QC'];

function CopySkuButton({ sku }: { sku: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sku);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy SKU"
      className="ml-1 text-muted-foreground/50 transition-colors hover:text-foreground"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

const Products = () => {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: subcategories } = useQuery({
    queryKey: ['admin', 'products', 'subcategories'],
    queryFn: () => productsApi.getSubcategories().then((r) => r.data.subcategories),
    staleTime: 60 * 60 * 1000,
  });
  const categoryOptions = useMemo(
    () => Object.keys(subcategories ?? {}).sort(),
    [subcategories],
  );

  const searchFn = useCallback(
    (p: Product, q: string) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.sku ?? '').toLowerCase().includes(q) ||
      (p.category ?? '').toLowerCase().includes(q),
    [],
  );

  const columns: ColumnDef<Product>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, p) => <p className="text-sm font-medium">{p.name}</p>,
    },
    {
      key: 'sku',
      label: 'SKU',
      width: '140px',
      render: (_, p) => (
        <p className="flex items-center text-sm text-muted-foreground">
          {p.sku}
          {p.sku && <CopySkuButton sku={p.sku} />}
        </p>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      width: '160px',
      render: (val) => <Badge variant="outline">{(val as string) || '—'}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '130px',
      render: (val) => <Badge variant="secondary">{(val as string) || '—'}</Badge>,
    },
    {
      key: 'stock',
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
      key: 'price',
      label: 'Price',
      width: '120px',
      sortable: true,
      render: (val, p) => (
        <span className="text-sm font-medium">
          {p.currency ?? '£'}{((val as number) ?? 0).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div>
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
        fetchFn={() =>
          productsApi.list({
            per_page: 200,
            category: typeFilter !== 'all' ? typeFilter : undefined,
            cf_sub_category: categoryFilter !== 'all' ? categoryFilter : undefined,
            cf_status: statusFilter !== 'all' ? statusFilter : undefined,
          })
        }
        dataKey="items"
        columns={columns}
        clientSidePagination
        clientSideSearchFn={searchFn}
        searchable
        searchPlaceholder="Search by name or SKU…"
        extraParams={{ typeFilter, categoryFilter, statusFilter }}
        emptyIcon={<Package className="h-10 w-10 opacity-25" />}
        emptyMessage="No products found."
        onRowClick={(p) => navigate(`/admin/products/${p.id}`)}
        toolbar={
          <>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 w-40 text-sm rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Diamonds">Diamonds</SelectItem>
                <SelectItem value="Jewellery">Jewellery</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-8 w-44 text-sm rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-40 text-sm rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />
    </div>
  );
};

export default Products;
