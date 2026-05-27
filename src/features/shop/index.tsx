import { useCallback, useEffect, useMemo, useState } from 'react';
import { productsApi } from '@/api/products';
import { newApiURL } from '@/config/site';
import { ChevronUp, Search, SlidersHorizontal, X } from 'lucide-react';
import PageLayout from '@/components/shared/layout/PageLayout';
import type { FilterValues } from '@/components/shared/filters/AdvancedFilterSort';
import ShopProductCard from '@/components/shared/product/ShopProductCard';
import YouMayAlsoLike from './components/YouMayAlsoLike';
import CommitmentSection from '@/features/jewellery/sections/CommitmentSection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { getMetalType } from '@/data/shop/metalTypes';
import {
  categories,
  metals,
  shapes,
  stockTypes,
  subCategories,
  youMayAlsoLike,
} from '@/data/shop/products';
import type { ShopProduct } from '@/data/shop/products';
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

// ─── Zoho → ShopProduct mapper ────────────────────────────────────────────────

/** Try several custom-field name variants from a raw Zoho item. */
function getCf(item: Record<string, unknown>, ...names: string[]): string | undefined {
  for (const name of names) {
    if (item[`cf_${name}`] != null) return String(item[`cf_${name}`]);
    if (item[name] != null && typeof item[name] !== 'object') return String(item[name]);
    if (Array.isArray(item.custom_fields)) {
      const f = (item.custom_fields as Array<{ api_name?: string; label?: string; value?: unknown }>)
        .find((cf) => cf.api_name === `cf_${name}` || cf.label?.toLowerCase().replace(/ /g, '_') === name);
      if (f?.value != null) return String(f.value);
    }
  }
  return undefined;
}

/** Normalise free-text metal strings to the codes expected by getMetalType(). */
const METAL_ALIASES: Record<string, string> = {
  '18k yellow gold': '18K_YG', '18kyg': '18K_YG', '18k_yg': '18K_YG',
  '18k white gold': '18K_WG', '18kwg': '18K_WG', '18k_wg': '18K_WG',
  '18k rose gold': '18K_RG', '18k_rg': '18K_RG',
  '9k yellow gold': '9K_YG', '9kyg': '9K_YG', '9k_yg': '9K_YG',
  '9k white gold': '9K_WG', '9kwg': '9K_WG', '9k_wg': '9K_WG',
  'platinum': 'Pt950', 'pt': 'Pt950', 'pt950': 'Pt950',
};
function normaliseMetalCode(raw: string): string {
  return METAL_ALIASES[raw.toLowerCase().trim()] ?? raw.trim();
}

function mapZohoToShopProduct(item: Record<string, unknown>): ShopProduct {
  // ── Metal ─────────────────────────────────────────────────────────────────
  const metalRaw = getCf(item, 'metal_options', 'available_metals', 'metal_type', 'metal') ?? '';
  const metalOptions = metalRaw
    ? metalRaw.split(/[,;]/).map(normaliseMetalCode).filter(Boolean)
    : [];

  // ── Stock ─────────────────────────────────────────────────────────────────
  const stock =
    typeof item.available_stock === 'number' ? item.available_stock :
      typeof item.actual_available_stock === 'number' ? item.actual_available_stock :
        undefined;

  // ── Badge — priority: low-stock > new arrival ────────────────────────────
  const isFewLeft = stock !== undefined && stock > 0 && stock <= 3;
  const isNewArrival =
    // MongoDB-cached items (bestseller/new-arrival queries) carry this flag directly
    item.isNewArrival === true ||
    // Zoho custom field, if set on the item
    getCf(item, 'is_new_arrival', 'new_arrival') === 'true' ||
    // Derive from Zoho created_time — items created within the last 45 days
    (() => {
      const t = typeof item.created_time === 'string' ? item.created_time : '';
      if (!t) return false;
      const created = new Date(t).getTime();
      return !isNaN(created) && (Date.now() - created < 45 * 24 * 60 * 60 * 1000);
    })();

  const badge: ShopProduct['badge'] =
    isFewLeft ? 'ONLY FEW LEFT' : isNewArrival ? 'NEW STOCK' : undefined;

  // ── Stock type (Natural | Lab) ────────────────────────────────────────────
  const rawStockType = getCf(item, 'diamond_type', 'stock_type', 'stone_type') ?? 'Natural';

  // ── Carat options (comma/semicolon-separated string → array) ────────────
  const caratRaw = getCf(item, 'carat_options', 'carat_weight_options', 'carat') ?? '';
  const caratOptions = caratRaw
    ? caratRaw.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    : undefined;

  // ── Size options (ring sizes, comma/semicolon-separated) ─────────────────
  const sizeRaw = getCf(item, 'size_options', 'ring_size_options', 'ring_size', 'size') ?? '';
  const sizeOptions = sizeRaw
    ? sizeRaw.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    : undefined;

  // ── Stone type — human-readable description for the spec table ───────────
  // Try a dedicated description field first; fall back to deriving from stockType.
  const stoneType =
    getCf(item, 'stone_type_description', 'stone_description') ??
    (rawStockType === 'Lab' ? 'Lab Created Diamond' :
      rawStockType === 'Natural' ? 'Natural Diamond' : undefined);

  // ── Image URL (Zoho exposes a single image per item) ─────────────────────
  const imageUrl = `${newApiURL}/products/${item.item_id}/image`;

  return {
    id: String(item.item_id ?? ''),
    sku: String(item.sku ?? ''),
    name: String(item.name ?? ''),
    category: String(getCf(item, 'stock_category') ?? item.category_name ?? ''),
    subCategory: getCf(item, 'sub_category_type', 'collection', 'subcategory') ?? '',
    metal: metalOptions[0] ?? '',
    metalOptions,
    shape: getCf(item, 'diamond_shape', 'shape', 'stone_shape') ?? '',
    stockType: (['Natural', 'Lab'].includes(rawStockType) ? rawStockType : 'Natural') as 'Natural' | 'Lab',
    price: typeof item.rate === 'number' ? item.rate : 0,
    image: imageUrl,
    badge,
    description: String(item.description ?? ''),
    certificate: getCf(item, 'certificate_lab', 'certification', 'certificate', 'cert'),
    stock,
    // ── Spec / detail-page fields ─────────────────────────────────────────
    caratOptions: caratOptions?.length ? caratOptions : undefined,
    sizeOptions:  sizeOptions?.length  ? sizeOptions  : undefined,
    stoneType:    stoneType  || undefined,
    colour:       getCf(item, 'colour', 'color', 'diamond_colour', 'stone_colour') || undefined,
    clarity:      getCf(item, 'clarity', 'diamond_clarity', 'stone_clarity')       || undefined,
    setting:      getCf(item, 'setting', 'setting_type', 'mount_type')             || undefined,
    goldWeight:   getCf(item, 'gold_weight', 'metal_weight')                       || undefined,
    totalWeight:  getCf(item, 'total_weight', 'total_carat_weight', 'carat_weight')|| undefined,
    itemRef:      getCf(item, 'item_ref', 'reference', 'stock_ref', 'ref')         || String(item.sku ?? '') || undefined,
    // Gallery: Zoho provides one image per item — wrap in array for the detail
    // page carousel. Add more URLs here if a multi-image endpoint is added later.
    images: [imageUrl],
  };
}

// ─────────────────────────────────────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [16, 32, 48, 96];
const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];
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

type FilterTabKey = 'category' | 'subCategory' | 'metal' | 'shape' | 'stockType' | 'price' | 'inStock';
type VisualFilterValue = string | [number, number];
type FilterChangeHandler = (key: string, value: string | string[] | [number, number]) => void;

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
    ...metals.map((metal) => {
      const m = getMetalType(metal);
      return { label: m.name, value: metal, display: m.label, image: m.image };
    }),
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
    { label: 'Under £750', value: [0, 750] },
    { label: '£750 – £1,000', value: [750, 1000] },
    { label: '£1,000 – £1,500', value: [1000, 1500] },
    { label: '£1,500+', value: [1500, 5000] },
    { label: 'All Prices', value: DEFAULT_PRICE_RANGE },
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
  inStock: '',
};

const isSameRange = (left: [number, number], right: [number, number]) =>
  left[0] === right[0] && left[1] === right[1];

const isFilterItemActive = (currentValue: FilterValues[string], itemValue: VisualFilterValue) => {
  if (Array.isArray(itemValue)) {
    return Array.isArray(currentValue) && isSameRange(currentValue as [number, number], itemValue);
  }
  return currentValue === itemValue || (!currentValue && itemValue === '');
};

const renderFilterItems = (
  tab: { key: FilterTabKey; label: string },
  currentValue: FilterValues[string],
  onChange: FilterChangeHandler
) => {
  const items = visualFilters[tab.key];

  if (tab.key === 'metal') {
    return (
      <div className="space-y-0.5">
        {items
          .filter((item) => item.value !== '')
          .map((item) => {
            const isActive = isFilterItemActive(currentValue, item.value);
            const itemKey = item.value as string;
            const metalConfig = getMetalType(itemKey);
            return (
              <label
                key={`metal-${itemKey}`}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary/40"
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => onChange(tab.key, isActive ? '' : item.value)}
                  className="h-4 w-4 flex-shrink-0 cursor-pointer accent-[hsl(var(--accent))]"
                />
                <span
                  className="h-4 w-4 flex-shrink-0 overflow-hidden rounded-full border border-border/50"
                  style={{
                    backgroundImage: metalConfig.image ? `url(${metalConfig.image})` : undefined,
                    backgroundColor: metalConfig.image ? undefined : metalConfig.bg,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <span
                  className={`text-sm transition-colors ${isActive ? 'font-semibold text-foreground' : 'text-foreground'
                    }`}
                >
                  {item.label}
                </span>
              </label>
            );
          })}
      </div>
    );
  }

  if (tab.key === 'shape') {
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = isFilterItemActive(currentValue, item.value);
          const itemKey = (item.value as string) || 'all';
          return (
            <button
              key={`shape-${itemKey}`}
              type="button"
              onClick={() => onChange(tab.key, item.value as string)}
              aria-pressed={isActive}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${isActive
                  ? 'border-accent bg-accent text-accent-foreground shadow-sm'
                  : 'border-border/50 text-foreground/65 hover:border-accent/60 hover:text-foreground'
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (tab.key === 'price') {
    return (
      <div className="space-y-0.5">
        {items.map((item) => {
          const isActive = isFilterItemActive(currentValue, item.value);
          const itemKey = Array.isArray(item.value) ? item.value.join('-') : 'all';
          return (
            <button
              key={`price-${itemKey}`}
              type="button"
              onClick={() => onChange(tab.key, item.value)}
              aria-pressed={isActive}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 ${isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-foreground/60 hover:bg-secondary/40 hover:text-foreground'
                }`}
            >
              <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
              {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: checkbox list (category, subCategory, stockType)
  return (
    <div className="space-y-0.5">
      {items
        .filter((item) => item.value !== '')
        .map((item) => {
          const isActive = isFilterItemActive(currentValue, item.value);
          const itemKey = (item.value as string) || 'all';
          return (
            <label
              key={`${tab.key}-${itemKey}`}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary/40"
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => onChange(tab.key, isActive ? '' : item.value)}
                className="h-4 w-4 flex-shrink-0 cursor-pointer accent-[hsl(var(--accent))]"
              />
              <span
                className={`text-sm transition-colors ${isActive ? 'font-semibold text-foreground' : 'text-foreground'
                  }`}
              >
                {item.label}
              </span>
            </label>
          );
        })}
    </div>
  );
};

type FilterSidebarContentProps = {
  filterValues: FilterValues;
  openAccordionItems: string[];
  setOpenAccordionItems: (items: string[]) => void;
  handleFilterChange: FilterChangeHandler;
  handleReset: () => void;
  hasActiveFilters: boolean;
};

const FilterSidebarContent = ({
  filterValues,
  openAccordionItems,
  setOpenAccordionItems,
  handleFilterChange,
  handleReset,
  hasActiveFilters,
}: FilterSidebarContentProps) => (
  <div>
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/45">
        Refine By
      </h2>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-foreground/45 underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Clear all
        </button>
      )}
    </div>

    <div className="mb-2 overflow-hidden rounded-2xl border border-border/60 bg-background px-3.5 py-3.5">
      <div className="mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
          Availability
        </span>
      </div>
      <label className="flex cursor-pointer items-center justify-between gap-3 px-2 py-1">
        <span className="text-sm text-foreground">In-Stock and Ready to Ship</span>
        <button
          type="button"
          role="switch"
          aria-checked={filterValues.inStock === 'true'}
          onClick={() => handleFilterChange('inStock', filterValues.inStock === 'true' ? '' : 'true')}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${filterValues.inStock === 'true' ? 'bg-accent' : 'bg-foreground/20'
            }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${filterValues.inStock === 'true' ? 'translate-x-5' : 'translate-x-0'
              }`}
          />
        </button>
      </label>
    </div>

    <Accordion
      type="multiple"
      value={openAccordionItems}
      onValueChange={setOpenAccordionItems}
      className="space-y-2"
    >
      {filterTabs.map((tab) => {
        const isFilterActive =
          Boolean(filterValues[tab.key]) &&
          !(
            tab.key === 'price' &&
            Array.isArray(filterValues.price) &&
            isSameRange(filterValues.price as [number, number], DEFAULT_PRICE_RANGE)
          );

        return (
          <AccordionItem
            key={tab.key}
            value={tab.key}
            className="overflow-hidden rounded-2xl border border-border/60 bg-background px-3.5"
          >
            <AccordionTrigger className="py-3.5 hover:no-underline [&>svg]:hidden">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
                    {tab.label}
                  </span>
                  {isFilterActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                </div>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10 text-[11px] font-light text-foreground">
                  {openAccordionItems.includes(tab.key) ? '−' : '+'}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-4 pt-0">
              {isFilterActive && (
                <div className="mb-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleFilterChange(tab.key, tab.key === 'price' ? DEFAULT_PRICE_RANGE : '')
                    }
                    className="text-[11px] text-foreground/40 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
              )}
              {renderFilterItems(tab, filterValues[tab.key], handleFilterChange)}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  </div>
);

const ShopPage = () => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<FilterValues>(defaultValues);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>(['category']);
  const [sortBy, setSortBy] = useState(shopSort.defaultValue);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [hasMorePage, setHasMorePage] = useState(false);

  const selectedCategory = typeof filterValues.category === 'string' ? filterValues.category : '';

  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);
    productsApi.list({
      per_page: pageSize,
      page,
      status: 'active',
      // Always restrict to Jewellery — falls back to the user-selected sub-category
      // (Rings / Earrings / etc.) when one is chosen in the filter sidebar.
      category: selectedCategory || 'Jewellery',
    })
      .then((res) => {
        const raw = (res.data?.items ?? []) as Record<string, unknown>[];
        setHasMorePage(res.data?.page_context?.has_more_page ?? false);
        if (import.meta.env.DEV && raw.length > 0) {
          const cats = [...new Set(raw.map((i) => i.cf_stock_category))];
          console.log('[Shop] cf_stock_category values returned:', cats);
          console.log('[Shop] Zoho item field reference (first item):', raw[0]);
          console.log('[Shop] page_context:', res.data?.page_context);
        }
        // Category filtering is handled server-side (cf_stock_category param).
        // No client-side category exclusion needed here.
        setProducts(raw.map(mapZohoToShopProduct));
      })
      .catch((err) => {
        console.error('[Shop] Failed to load products:', err);
        setFetchError('Unable to load products right now. Please try again later.');
      })
      .finally(() => setIsLoading(false));
  // Re-fetch from Zoho when category, page, or page size changes (server-side pagination)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, page, pageSize]);

  // Scroll to top whenever the page changes so the user sees new results from the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

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
    let result = [...products];
    const { search, category, subCategory, metal, shape, stockType, price, inStock } = filterValues;

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
    if (inStock === 'true') result = result.filter((p) => (p.stock ?? 0) > 0);
    if (Array.isArray(price) && typeof price[0] === 'number') {
      const [lo, hi] = price as [number, number];
      result = result.filter((p) => p.price >= lo && p.price <= hi);
    }

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [filterValues, sortBy, products]);

  const hasActiveFilters = useMemo(() => {
    const { search, category, subCategory, metal, shape, stockType, price, inStock } = filterValues;
    const [lo, hi] = Array.isArray(price) ? (price as [number, number]) : DEFAULT_PRICE_RANGE;
    return Boolean(
      (typeof search === 'string' && search.trim()) ||
      category ||
      subCategory ||
      metal ||
      (typeof shape === 'string' && shape) ||
      (Array.isArray(shape) && shape.length > 0) ||
      stockType ||
      inStock === 'true' ||
      !isSameRange([lo, hi], DEFAULT_PRICE_RANGE)
    );
  }, [filterValues]);

  const activeFilterChips = useMemo(() => {
    const chips: { key: FilterTabKey; label: string }[] = [];
    if (typeof filterValues.category === 'string' && filterValues.category)
      chips.push({ key: 'category', label: filterValues.category });
    if (typeof filterValues.subCategory === 'string' && filterValues.subCategory)
      chips.push({ key: 'subCategory', label: filterValues.subCategory });
    if (typeof filterValues.metal === 'string' && filterValues.metal)
      chips.push({ key: 'metal', label: getMetalType(filterValues.metal).name });
    if (typeof filterValues.shape === 'string' && filterValues.shape)
      chips.push({ key: 'shape', label: filterValues.shape });
    if (typeof filterValues.stockType === 'string' && filterValues.stockType)
      chips.push({ key: 'stockType', label: filterValues.stockType });
    if (filterValues.inStock === 'true')
      chips.push({ key: 'inStock', label: 'In-Stock & Ready to Ship' });
    if (
      Array.isArray(filterValues.price) &&
      !isSameRange(filterValues.price as [number, number], DEFAULT_PRICE_RANGE)
    ) {
      const [lo, hi] = filterValues.price as [number, number];
      const priceItem = visualFilters.price.find(
        (p) => Array.isArray(p.value) && isSameRange(p.value as [number, number], [lo, hi])
      );
      chips.push({ key: 'price', label: priceItem?.label ?? `£${lo}–£${hi}` });
    }
    return chips;
  }, [filterValues]);

  // With server-side pagination the API returns exactly one page of results.
  // Use has_more_page to know whether a next page exists; extend totalPages
  // dynamically as the user navigates so the numbered buttons stay correct.
  const totalPages = hasMorePage ? page + 1 : page;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <PageLayout>
      {/* Sticky toolbar */}
      <div className="sticky top-16 z-40 border-b border-border/60 bg-background/95 backdrop-blur-sm md:top-20">
        <div className="henig-container">
          <div className="flex flex-wrap items-center gap-3 py-4">
            {/* Filter button */}
            <Sheet open={isFilterSidebarOpen} onOpenChange={setIsFilterSidebarOpen}>
              <SheetTrigger asChild>
                <Button className="justify-start gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  {activeFilterChips.length > 0 && (
                    <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-background/20 text-[10px] font-bold">
                      {activeFilterChips.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-[340px] flex-col p-0 sm:w-[400px] top-16 md:top-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
                <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-6 py-5">
                  <SheetHeader className="text-left">
                    <SheetTitle className="text-base font-semibold uppercase tracking-[0.2em]">
                      Filters
                    </SheetTitle>
                  </SheetHeader>
                  <SheetClose className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground/20 bg-foreground/10 text-foreground transition-colors hover:bg-foreground/20">
                    <X className="h-4 w-4" />
                  </SheetClose>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <FilterSidebarContent
                    filterValues={filterValues}
                    openAccordionItems={openAccordionItems}
                    setOpenAccordionItems={setOpenAccordionItems}
                    handleFilterChange={handleFilterChange}
                    handleReset={handleReset}
                    hasActiveFilters={hasActiveFilters}
                  />
                </div>
                <div className="shrink-0 border-t border-border/40 px-6 py-4">
                  <SheetClose asChild>
                    <button
                      type="button"
                      className="w-full rounded bg-accent py-3 text-sm font-semibold uppercase tracking-[0.12em] text-accent-foreground transition-colors hover:bg-accent/90"
                    >
                      View {filtered.length.toLocaleString()}{hasMorePage ? '+' : ''} {filtered.length === 1 ? 'Product' : 'Products'}
                    </button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>

            <label className="relative block min-w-[200px] flex-1 sm:max-w-[320px]">
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

            <label className="flex items-center gap-2 text-sm text-foreground/55">
              <span className="whitespace-nowrap">Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-10 w-[180px] rounded border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              >
                {shopSort.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2 text-sm text-foreground/55">
              <span className="whitespace-nowrap">Show</span>
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-10 w-[80px] rounded border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>

            <span className="ml-auto text-sm text-foreground/55">
              {filtered.length.toLocaleString()}{hasMorePage ? '+' : ''} {filtered.length === 1 ? 'result' : 'results'}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-foreground/55 underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterChips.length > 0 && (
        <div className="border-b border-border/30 bg-white/70">
          <div className="henig-container py-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-foreground/40">Active:</span>
              {activeFilterChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() =>
                    handleFilterChange(chip.key, chip.key === 'price' ? DEFAULT_PRICE_RANGE : '')
                  }
                  className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 py-1 pl-3 pr-2 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
                >
                  {chip.label}
                  <X className="h-3 w-3 opacity-70" />
                </button>
              ))}
              {activeFilterChips.length > 1 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] text-foreground/40 underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <section className="bg-white py-8 md:py-12">
        <div className="henig-container">
          <div>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: pageSize }).map((_, i) => (
                  <div key={i} className="animate-pulse border border-border/40 bg-card">
                    <div className="aspect-square bg-foreground/5" />
                    <div className="px-3 pb-3 pt-2 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-foreground/10" />
                      <div className="h-3 w-1/2 rounded bg-foreground/10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg text-foreground/60">{fetchError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 text-sm text-primary underline hover:text-primary/80"
                >
                  Reload page
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg text-foreground/60">No products match your filters.</p>
                <button
                  onClick={handleReset}
                  className="mt-3 text-sm text-primary underline hover:text-primary/80"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
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
                      className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${page === pageNum
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
                    className={`h-8 w-8 rounded-full text-sm font-medium ${page === totalPages ? 'bg-accent text-accent-foreground' : 'text-foreground/60'
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
