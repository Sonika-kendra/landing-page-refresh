import { useCallback, useMemo, useRef, useState } from 'react';
import { ChevronUp, Search, X } from 'lucide-react';
import PageLayout from '@/components/shared/PageLayout';
import RegistrationModal from '@/components/shared/RegistrationModal';
import type { FilterValues } from '@/components/shared/AdvancedFilterSort';
import ShopProductCard from '@/components/feature/shop/ShopProductCard';
import YouMayAlsoLike from '@/components/feature/shop/YouMayAlsoLike';
import { CommitmentSection } from '@/components/feature/jewellery';
import {
  categories,
  metals,
  shapes,
  shopProducts,
  stockTypes,
  subCategories,
  youMayAlsoLike,
} from '@/config/shop/products';
import ringImage from '@/assets/jewellery/category/ring.png';
import braceletImage from '@/assets/jewellery/category/Bracelet.png';
import earringsImage from '@/assets/jewellery/category/earrings.png';
import necklaceImage from '@/assets/jewellery/category/33cb8070-9fd3-4fbe-8cf7-838a1e473ad3.png';
import jewelleryImage from '@/assets/jewellery-category.jpg';
import haloImage from '@/assets/eternity-ring.jpg';
import solitaireImage from '@/assets/jewellery/newArrivals/product1.png';
import threeStoneImage from '@/assets/jewellery/bestseller/product2.png';
import eternityImage from '@/assets/jewellery/bestseller/product5.png';
import clusterImage from '@/assets/jewellery/newArrivals/product6.png';
import naturalDiamondImage from '@/assets/diamond-pairs.jpg';
import labDiamondImage from '@/assets/lab-grown-diamond.jpg';
import diamondsImage from '@/assets/diamonds-category.jpg';

const ITEMS_PER_PAGE = 16;
const DEFAULT_PRICE_RANGE: [number, number] = [0, 5000];

const shopSort = {
  options: [
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Newest First', value: 'newest' },
    { label: 'Name: A-Z', value: 'name-asc' },
  ],
  defaultValue: 'price-asc',
};

type FilterTabKey = 'category' | 'subCategory' | 'metal' | 'shape' | 'stockType' | 'price';
type VisualFilterValue = string | [number, number];

type VisualFilterItem = {
  label: string;
  value: VisualFilterValue;
  image?: string;
  display?: string;
};

const filterTabs: { key: FilterTabKey; label: string }[] = [
  { key: 'category', label: 'Categories' },
  { key: 'subCategory', label: 'Collections' },
  { key: 'metal', label: 'Metals' },
  { key: 'shape', label: 'Shapes' },
  { key: 'stockType', label: 'Stock Type' },
  { key: 'price', label: 'Price' },
];

const categoryImages: Record<string, string> = {
  Rings: ringImage,
  Necklaces: necklaceImage,
  Earrings: earringsImage,
  Bracelets: braceletImage,
  Bangles: braceletImage,
  Pendants: jewelleryImage,
};

const collectionImages: Record<string, string> = {
  Halo: haloImage,
  Solitaire: solitaireImage,
  'Three Stone': threeStoneImage,
  Eternity: eternityImage,
  Cluster: clusterImage,
};

const visualFilters: Record<FilterTabKey, VisualFilterItem[]> = {
  category: [
    ...categories.map((category) => ({
      label: category,
      value: category,
      image: categoryImages[category] ?? jewelleryImage,
    })),
    { label: 'All Products', value: '', image: jewelleryImage },
  ],
  subCategory: [
    ...subCategories.map((subCategory) => ({
      label: subCategory,
      value: subCategory,
      image: collectionImages[subCategory] ?? jewelleryImage,
    })),
    { label: 'All Collections', value: '', image: jewelleryImage },
  ],
  metal: [
    ...metals.map((metal) => ({
      label: metal.replace('YG', 'Yellow Gold').replace('WG', 'White Gold'),
      value: metal,
      display: metal,
    })),
    { label: 'All Metals', value: '', display: 'All' },
  ],
  shape: [
    ...shapes.map((shape) => ({
      label: shape,
      value: shape,
      display: shape,
    })),
    { label: 'All Shapes', value: '', display: 'All' },
  ],
  stockType: [
    { label: 'All Stock Types', value: '', image: diamondsImage },
    { label: stockTypes[0], value: stockTypes[0], image: naturalDiamondImage },
    { label: stockTypes[1], value: stockTypes[1], image: labDiamondImage },
  ],
  price: [
    { label: 'Under \u00a3750', value: [0, 750], display: '<750' },
    { label: '\u00a3750 - \u00a31,000', value: [750, 1000], display: '750-1k' },
    { label: '\u00a31,000 - \u00a31,500', value: [1000, 1500], display: '1k-1.5k' },
    { label: '\u00a31,500+', value: [1500, 5000], display: '1.5k+' },
    { label: 'All Prices', value: DEFAULT_PRICE_RANGE, display: 'All' },
  ],
};

const defaultValues: FilterValues = {
  search: '',
  category: '',
  subCategory: '',
  metal: '',
  shape: '',
  stockType: '',
  price: DEFAULT_PRICE_RANGE,
};

const isSameRange = (left: [number, number], right: [number, number]) => left[0] === right[0] && left[1] === right[1];

const isFilterItemActive = (currentValue: FilterValues[string], itemValue: VisualFilterValue) => {
  if (Array.isArray(itemValue)) {
    return Array.isArray(currentValue) && isSameRange(currentValue as [number, number], itemValue);
  }

  return currentValue === itemValue || (!currentValue && itemValue === '');
};

const Shop = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>(defaultValues);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTabKey>('category');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState(shopSort.defaultValue);
  const [page, setPage] = useState(1);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTabHover = useCallback((key: FilterTabKey) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveFilterTab(key);
    setIsDropdownOpen(true);
  }, []);

  const handleMenuLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => setIsDropdownOpen(false), 150);
  }, []);

  const handleMenuEnter = useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  }, []);

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
    if (typeof shape === 'string' && shape) result = result.filter((p) => p.shape === shape);
    else if (Array.isArray(shape) && shape.length > 0) result = result.filter((p) => (shape as string[]).includes(p.shape));
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

  const hasActiveFilters = useMemo(() => {
    const { search, category, subCategory, metal, shape, stockType, price } = filterValues;
    const [lo, hi] = Array.isArray(price) ? (price as [number, number]) : DEFAULT_PRICE_RANGE;

    return Boolean(
      (typeof search === 'string' && search.trim()) ||
        category ||
        subCategory ||
        metal ||
        (typeof shape === 'string' && shape) ||
        (Array.isArray(shape) && shape.length > 0) ||
        stockType ||
        !isSameRange([lo, hi], DEFAULT_PRICE_RANGE)
    );
  }, [filterValues]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const activeFilterItems = visualFilters[activeFilterTab];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <PageLayout onRegisterClick={() => setIsRegisterModalOpen(true)}>
      {/* Sticky category bar */}
      <div
        className="relative sticky top-16 z-40 border-b border-border/60 bg-background/95 backdrop-blur-sm md:top-20"
        onMouseLeave={handleMenuLeave}
        onMouseEnter={handleMenuEnter}
      >
        <div className="henig-container">
          <div className="overflow-x-auto">
            <div className="mx-auto flex w-max min-w-full items-center justify-center gap-8 px-1 py-4 md:gap-12 md:py-5">
              {filterTabs.map((tab) => {
                const isActive = activeFilterTab === tab.key && isDropdownOpen;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onMouseEnter={() => handleTabHover(tab.key)}
                    onClick={() => { setActiveFilterTab(tab.key); setIsDropdownOpen(true); }}
                    className={`relative whitespace-nowrap pb-2 text-sm font-medium tracking-wide transition-colors md:text-base ${
                      isActive ? 'text-foreground' : 'text-foreground/55 hover:text-foreground'
                    }`}
                    aria-pressed={isActive}
                  >
                    {tab.label}
                    {isActive && <span className="absolute inset-x-0 bottom-0 mx-auto h-px w-full bg-accent" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hover dropdown panel — absolute overlay so page content doesn't shift */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full z-50 border-b border-t border-border/40 bg-background/95 pb-6 pt-4 shadow-md backdrop-blur-sm">
            <div className="henig-container">
              <div className="overflow-x-auto py-2">
                <div className="mx-auto flex w-max min-w-full items-start justify-center gap-7 px-1 md:gap-10 lg:gap-14">
                  {activeFilterItems.map((item) => {
                    const value = filterValues[activeFilterTab];
                    const isItemActive = isFilterItemActive(value, item.value);
                    const itemKey = Array.isArray(item.value) ? item.value.join('-') : item.value || 'all';

                    return (
                      <button
                        key={`${activeFilterTab}-${itemKey}`}
                        type="button"
                        onClick={() => handleFilterChange(activeFilterTab, item.value)}
                        className="group flex min-w-[96px] flex-col items-center gap-4 text-center outline-none md:min-w-[128px]"
                        aria-pressed={isItemActive}
                      >
                        <span
                          className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border transition-all duration-300 md:h-32 md:w-32 ${
                            isItemActive
                              ? 'border-accent shadow-[0_0_0_3px_hsl(var(--accent)/0.45)]'
                              : 'border-transparent group-hover:border-accent'
                          }`}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.label}
                              className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center rounded-full bg-secondary px-4 text-base font-medium text-foreground/80 md:text-lg">
                              {item.display}
                            </span>
                          )}
                        </span>
                        <span className={`text-sm transition-colors md:text-base ${isItemActive ? 'text-foreground' : 'text-foreground/70'}`}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search + Sort row */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="relative block w-full sm:w-[280px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45" />
                    <input
                      value={(filterValues.search as string) || ''}
                      onChange={(event) => handleFilterChange('search', event.target.value)}
                      placeholder="Search products"
                      className="h-10 w-full rounded border border-border bg-background pl-10 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-primary"
                    />
                    {filterValues.search && (
                      <button
                        type="button"
                        onClick={() => handleFilterChange('search', '')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/45 transition-colors hover:text-foreground"
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </label>

                  <span className="text-sm text-foreground/55">
                    {filtered.length.toLocaleString()} {filtered.length === 1 ? 'result' : 'results'}
                  </span>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-max text-sm text-foreground/55 underline underline-offset-4 transition-colors hover:text-foreground"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                <label className="flex w-full items-center gap-3 text-sm text-foreground/55 sm:w-auto">
                  <span className="whitespace-nowrap">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-10 w-full rounded border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary sm:w-[190px]"
                  >
                    {shopSort.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

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
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {paged.map((product) => (
                <ShopProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2 py-1 text-sm text-foreground/50 hover:text-foreground disabled:opacity-30"
              >
                &lsaquo;
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
              {totalPages > 5 && <span className="text-foreground/40">...</span>}
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
                &rsaquo;
              </button>
            </div>
          )}
        </div>
      </section>

      <YouMayAlsoLike items={youMayAlsoLike} />
      <CommitmentSection />

      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-colors hover:bg-accent/90"
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      <RegistrationModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </PageLayout>
  );
};

export default Shop;
