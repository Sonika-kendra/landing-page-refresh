import { useCallback, useMemo, useState } from 'react';
import { ChevronUp, Search, SlidersHorizontal, X } from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import type { FilterValues } from '@/components/shared/filters/AdvancedFilterSort';
import ShopProductCard from '@/components/shared/product/ShopProductCard';
import YouMayAlsoLike from './components/YouMayAlsoLike';
import CommitmentSection from '@/features/jewellery/sections/CommitmentSection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  categories,
  metals,
  shapes,
  shopProducts,
  stockTypes,
  subCategories,
  youMayAlsoLike,
} from '@/data/shop/products';
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
    ...shapes.map((shape) => ({ label: shape, value: shape, display: shape })),
    { label: 'All Shapes', value: '', display: 'All' },
  ],
  stockType: [
    { label: 'All Stock Types', value: '', image: diamondsImage },
    { label: stockTypes[0], value: stockTypes[0], image: naturalDiamondImage },
    { label: stockTypes[1], value: stockTypes[1], image: labDiamondImage },
  ],
  price: [
    { label: 'Under £750', value: [0, 750], display: '<750' },
    { label: '£750 - £1,000', value: [750, 1000], display: '750-1k' },
    { label: '£1,000 - £1,500', value: [1000, 1500], display: '1k-1.5k' },
    { label: '£1,500+', value: [1500, 5000], display: '1.5k+' },
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

const isSameRange = (left: [number, number], right: [number, number]) =>
  left[0] === right[0] && left[1] === right[1];

const isFilterItemActive = (currentValue: FilterValues[string], itemValue: VisualFilterValue) => {
  if (Array.isArray(itemValue)) {
    return Array.isArray(currentValue) && isSameRange(currentValue as [number, number], itemValue);
  }
  return currentValue === itemValue || (!currentValue && itemValue === '');
};

const ShopPage = () => {
  const [filterValues, setFilterValues] = useState<FilterValues>(defaultValues);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>(['category']);
  const [sortBy, setSortBy] = useState(shopSort.defaultValue);
  const [page, setPage] = useState(1);

  const handleFilterChange = useCallback(
    (key: string, value: string | string[] | [number, number]) => {
      setFilterValues((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
    []
  );

  const handleReset = useCallback(() => {
    setFilterValues(defaultValues);
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    let result = [...shopProducts];
    const { search, category, subCategory, metal, shape, stockType, price } = filterValues;

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }
    if (category) result = result.filter((p) => p.category === category);
    if (subCategory) result = result.filter((p) => p.subCategory === subCategory);
    if (metal) result = result.filter((p) => p.metal === metal);
    if (typeof shape === 'string' && shape) result = result.filter((p) => p.shape === shape);
    else if (Array.isArray(shape) && shape.length > 0)
      result = result.filter((p) => (shape as string[]).includes(p.shape));
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <PageLayout>
      <div className="sticky top-16 z-40 border-b border-border/60 bg-background/95 backdrop-blur-sm md:top-20">
        <div className="henig-container">
          <div className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between md:gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Sheet open={isFilterSidebarOpen} onOpenChange={setIsFilterSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="justify-start gap-2 sm:w-auto">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-xl">
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                    <SheetDescription>Choose a category and refine the product listing.</SheetDescription>
                  </SheetHeader>

                  <div className="mt-8">
                    <Accordion
                      type="multiple"
                      value={openAccordionItems}
                      onValueChange={setOpenAccordionItems}
                      className="space-y-4"
                    >
                      {filterTabs.map((tab) => (
                        <AccordionItem
                          key={tab.key}
                          value={tab.key}
                          className="rounded-2xl border border-border/70 bg-background px-4"
                        >
                          <AccordionTrigger className="py-5 text-left font-normal no-underline hover:no-underline">
                            <div className="flex w-full items-center justify-between gap-3 pr-3">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/80">
                                  {tab.label}
                                </span>
                                {Boolean(filterValues[tab.key]) &&
                                  !(tab.key === 'price' && Array.isArray(filterValues.price) && isSameRange(filterValues.price as [number, number], DEFAULT_PRICE_RANGE)) && (
                                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                                      Active
                                    </span>
                                  )}
                              </div>
                              <span className="flex items-center gap-3">
                                <span className="grid h-7 w-7 place-items-center rounded-full border border-border/70 text-base font-light text-foreground/70">
                                  {openAccordionItems.includes(tab.key) ? '-' : '+'}
                                </span>
                              </span>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className="pb-5 pt-1">
                            {Boolean(filterValues[tab.key]) &&
                              !(tab.key === 'price' && Array.isArray(filterValues.price) && isSameRange(filterValues.price as [number, number], DEFAULT_PRICE_RANGE)) && (
                                <div className="mb-4 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleFilterChange(
                                        tab.key,
                                        tab.key === 'price' ? DEFAULT_PRICE_RANGE : ''
                                      )
                                    }
                                    className="text-xs text-foreground/55 underline underline-offset-4 transition-colors hover:text-foreground"
                                  >
                                    Clear
                                  </button>
                                </div>
                              )}
                            <div className="grid grid-cols-2 gap-3">
                              {visualFilters[tab.key].map((item) => {
                                const value = filterValues[tab.key];
                                const isItemActive = isFilterItemActive(value, item.value);
                                const itemKey = Array.isArray(item.value) ? item.value.join('-') : item.value || 'all';

                                return (
                                  <button
                                    key={`${tab.key}-${itemKey}`}
                                    type="button"
                                    onClick={() => handleFilterChange(tab.key, item.value)}
                                    className={`group flex flex-col items-center gap-3 rounded-2xl border p-3 text-center transition-all duration-300 ${
                                      isItemActive
                                        ? 'border-accent bg-accent/10 shadow-[0_0_0_1px_hsl(var(--accent)/0.4)]'
                                        : 'border-border/70 hover:border-accent/60 hover:bg-secondary/30'
                                    }`}
                                    aria-pressed={isItemActive}
                                  >
                                    <span className="flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-secondary/40">
                                      {item.image ? (
                                        <img
                                          src={item.image}
                                          alt={item.label}
                                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                      ) : (
                                        <span className="px-3 text-sm font-medium text-foreground/80">
                                          {item.display}
                                        </span>
                                      )}
                                    </span>
                                    <span className="text-sm text-foreground/80">{item.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    {hasActiveFilters && (
                      <Button variant="ghost" onClick={handleReset} className="mt-6 w-full justify-center">
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <label className="relative block w-full sm:w-[320px]">
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
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-max text-sm text-foreground/55 underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  Clear filters
                </button>
              )}
              <label className="flex w-full items-center gap-3 text-sm text-foreground/55 sm:w-auto">
                <span className="whitespace-nowrap">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-10 w-full rounded border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary sm:w-[220px]"
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
                      page === pageNum ? 'bg-accent text-accent-foreground' : 'text-foreground/60 hover:bg-border/40'
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

    </PageLayout>
  );
};

export default ShopPage;
