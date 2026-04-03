import { useState, useMemo } from 'react';
import { ChevronUp } from 'lucide-react';
import PageLayout from '@/components/shared/PageLayout';
import RegistrationModal from '@/components/shared/RegistrationModal';
import ShopFilterBar from '@/components/feature/shop/ShopFilterBar';
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

const Shop = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    metal: '',
    shape: '',
    stockType: '',
    sortBy: 'price-asc',
  });
  const [page, setPage] = useState(1);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...shopProducts];
    if (filters.category) result = result.filter((p) => p.category === filters.category);
    if (filters.subCategory) result = result.filter((p) => p.subCategory === filters.subCategory);
    if (filters.shape) result = result.filter((p) => p.shape === filters.shape);
    if (filters.stockType) result = result.filter((p) => p.stockType === filters.stockType);
    if (filters.sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (filters.sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    return result;
  }, [filters]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <PageLayout onRegisterClick={() => setIsRegisterModalOpen(true)}>
      {/* Static banner / filter bar */}
      <ShopFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        subCategories={subCategories}
        metals={metals}
        shapes={shapes}
        stockTypes={stockTypes}
      />

      {/* Product grid */}
      <section className="section-ivory py-8 md:py-12">
        <div className="henig-container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {paged.map((product) => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
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

      {/* You May Also Like */}
      <YouMayAlsoLike items={youMayAlsoLike} />

      {/* Features bar */}
      <ShopFeaturesBar />

      {/* Go to top */}
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
