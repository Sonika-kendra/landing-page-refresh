import { useState, useMemo, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';
import PageLayout from '@/components/shared/PageLayout';
import RegistrationModal from '@/components/shared/RegistrationModal';
import AdvancedFilterSort from '@/components/shared/AdvancedFilterSort';
import type { FilterConfig, FilterValues } from '@/components/shared/AdvancedFilterSort';
import ShopProductCard from '@/components/feature/shop/ShopProductCard';
import YouMayAlsoLike from '@/components/feature/shop/YouMayAlsoLike';
import ShopFeaturesBar from '@/components/feature/shop/ShopFeaturesBar';
import {
  shopProducts,
  categories,
  subCategories,
  metals,
  shapes,
  stockTypes,
  youMayAlsoLike,
} from '@/config/shop/products';

const ITEMS_PER_PAGE = 16;

const toOptions = (arr: string[]) => arr.map((v) => ({ label: v, value: v }));

const shopFilters: FilterConfig[] = [
  { key: 'search', label: 'Search', type: 'search', placeholder: 'Search products...' },
  { key: 'category', label: 'Category', type: 'select', options: toOptions(categories) },
  { key: 'subCategory', label: 'Sub Category', type: 'select', options: toOptions(subCategories) },
  { key: 'metal', label: 'Metal', type: 'select', options: toOptions(metals) },
  { key: 'shape', label: 'Shape', type: 'multi-select', options: toOptions(shapes) },
  { key: 'stockType', label: 'Stock Type', type: 'toggle-group', options: toOptions(stockTypes) },
  { key: 'price', label: 'Price Range', type: 'range', min: 0, max: 5000, step: 50, prefix: '£' },
];

const shopSort = {
  options: [
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Newest First', value: 'newest' },
    { label: 'Name: A–Z', value: 'name-asc' },
  ],
  defaultValue: 'price-asc',
};

const defaultValues: FilterValues = {
  search: '',
  category: '',
  subCategory: '',
  metal: '',
  shape: [],
  stockType: '',
  price: [0, 5000],
};

const Shop = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>(defaultValues);
  const [sortBy, setSortBy] = useState('price-asc');
  const [page, setPage] = useState(1);

  const handleFilterChange = useCallback((key: string, value: string | string[] | [number, number]) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setFilterValues(defaultValues);
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    let result = [...shopProducts];
    const { search, category, subCategory, metal, shape, stockType, price } = filterValues;

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (category) result = result.filter((p) => p.category === category);
    if (subCategory) result = result.filter((p) => p.subCategory === subCategory);
    if (metal) result = result.filter((p) => p.metal === metal);
    if (Array.isArray(shape) && shape.length > 0) result = result.filter((p) => (shape as string[]).includes(p.shape));
    if (stockType) result = result.filter((p) => p.stockType === stockType);
    if (Array.isArray(price) && typeof price[0] === 'number') {
      const [lo, hi] = price as [number, number];
      result = result.filter((p) => p.price >= lo && p.price <= hi);
    }

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [filterValues, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <PageLayout onRegisterClick={() => setIsRegisterModalOpen(true)}>
      <AdvancedFilterSort
        filters={shopFilters}
        sort={shopSort}
        values={filterValues}
        sortValue={sortBy}
        onFilterChange={handleFilterChange}
        onSortChange={setSortBy}
        onReset={handleReset}
        totalResults={filtered.length}
      />

      <section className="section-ivory py-8 md:py-12">
        <div className="henig-container">
          {paged.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg text-foreground/60">No products match your filters.</p>
              <button onClick={handleReset} className="mt-3 text-sm text-primary underline hover:text-primary/80">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {paged.map((product) => (
                <ShopProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2 py-1 text-sm text-foreground/50 hover:text-foreground disabled:opacity-30"
              >
                ‹
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-accent text-accent-foreground'
                        : 'text-foreground/60 hover:bg-border/40'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="text-foreground/40">…</span>}
              {totalPages > 5 && (
                <button
                  onClick={() => setPage(totalPages)}
                  className={`h-8 w-8 rounded-full text-sm font-medium ${
                    page === totalPages ? 'bg-accent text-accent-foreground' : 'text-foreground/60'
                  }`}
                >
                  {totalPages}
                </button>
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2 py-1 text-sm text-foreground/50 hover:text-foreground disabled:opacity-30"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </section>

      <YouMayAlsoLike items={youMayAlsoLike} />
      <ShopFeaturesBar />

      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full bg-accent text-accent-foreground shadow-lg flex items-center justify-center hover:bg-accent/90 transition-colors"
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      <RegistrationModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </PageLayout>
  );
};

export default Shop;
