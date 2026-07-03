import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

const fromSlug = (slug: string) =>
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
import { productsApi } from '@/api/products';
import { ChevronUp, Search, SlidersHorizontal, X } from 'lucide-react';
import { PaginationBar } from '@/components/ui/PaginationBar';
import PageLayout from '@/components/shared/layout/PageLayout';
import type { FilterValues } from '@/components/shared/filters/AdvancedFilterSort';
import ShopProductCard from '@/components/shared/product/ShopProductCard';
import YouMayAlsoLike from './components/YouMayAlsoLike';
import CommitmentSection from '@/features/jewellery/sections/CommitmentSection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { getMetalType } from '@/data/shop/metalTypes';
import {
  categories,
  metals,
  shapes,
  stockTypes,
  subCategories,
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


const PAGE_SIZE = 12;
const DEFAULT_PRICE_RANGE: [number, number] = [0, 5000];
const DEFAULT_CARAT_RANGE: [number, number] = [0, 99];

const shopSort = {
  options: [
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Newest First', value: 'newest' },
    { label: 'Name: A-Z', value: 'name-asc' },
  ],
  defaultValue: 'price-asc',
};

type FilterTabKey = 'category' | 'subCategory' | 'cfSubCategory' | 'cfSubCategoryType' | 'metal' | 'shape' | 'stockType' | 'price' | 'inStock' | 'caratWeight' | 'ringSize' | 'certificate';
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
  { key: 'cfSubCategoryType', label: 'Collections' },
  { key: 'metal', label: 'Metals' },
  { key: 'shape', label: 'Shapes' },
  { key: 'stockType', label: 'Stock Type' },
  { key: 'caratWeight', label: 'Carat Weight' },
  { key: 'ringSize', label: 'Ring Size' },
  { key: 'certificate', label: 'Certificates' },
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
  caratWeight: [
    { label: 'Under 0.50ct', value: [0, 0.5] },
    { label: '0.50 – 1.00ct', value: [0.5, 1.0] },
    { label: '1.00 – 2.00ct', value: [1.0, 2.0] },
    { label: '2.00ct+', value: [2.0, 99] },
    { label: 'All Weights', value: DEFAULT_CARAT_RANGE },
  ],
  ringSize: [
    ...['H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'].map((s) => ({ label: s, value: s })),
  ],
  certificate: [
    { label: 'IGI', value: 'IGI' },
    { label: 'GIA', value: 'GIA' },
    { label: 'HRD', value: 'HRD' },
  ],
  cfSubCategory: [],
  cfSubCategoryType: [],
  inStock: [],
};

const defaultValues: FilterValues = {
  search: '',
  category: '',
  subCategory: '',
  cfSubCategory: '',
  cfSubCategoryType: '',
  metal: '',
  shape: '',
  stockType: '',
  price: DEFAULT_PRICE_RANGE,
  inStock: '',
  caratWeight: DEFAULT_CARAT_RANGE,
  ringSize: '',
  certificate: '',
};

const isSameRange = (left: [number, number], right: [number, number]) =>
  left[0] === right[0] && left[1] === right[1];

const isFilterItemActive = (currentValue: FilterValues[string], itemValue: VisualFilterValue) => {
  if (Array.isArray(itemValue)) {
    return Array.isArray(currentValue) && isSameRange(currentValue as [number, number], itemValue);
  }
  return currentValue === itemValue || (!currentValue && itemValue === '');
};

const CaratRangeSlider = ({
  currentValue,
  onChange,
  caratItems,
}: {
  currentValue: [number, number];
  onChange: (val: [number, number]) => void;
  caratItems: VisualFilterItem[];
}) => {
  const { sliderMin, sliderMax } = useMemo(() => {
    const vals = caratItems
      .map((item) => (Array.isArray(item.value) ? item.value[0] : null))
      .filter((v): v is number => v !== null && v < 90);
    if (!vals.length) return { sliderMin: 0, sliderMax: 5 };
    return {
      sliderMin: Math.floor(Math.min(...vals) * 100) / 100,
      sliderMax: Math.ceil(Math.max(...vals) * 100) / 100,
    };
  }, [caratItems]);

  const normalize = (val: [number, number]): [number, number] => {
    if (isSameRange(val, DEFAULT_CARAT_RANGE)) return [sliderMin, sliderMax];
    return [
      Math.max(sliderMin, Math.min(val[0], sliderMax)),
      Math.max(sliderMin, Math.min(val[1], sliderMax)),
    ];
  };

  const [localValue, setLocalValue] = useState<[number, number]>(() => normalize(currentValue));

  useEffect(() => {
    setLocalValue(normalize(currentValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue[0], currentValue[1], sliderMin, sliderMax]);

  const handleCommit = (v: number[]) => {
    const [lo, hi] = v as [number, number];
    onChange(lo <= sliderMin && hi >= sliderMax ? DEFAULT_CARAT_RANGE : [lo, hi]);
  };

  return (
    <div className="px-1 pb-3 pt-4">
      <Slider
        min={sliderMin}
        max={sliderMax}
        step={0.01}
        value={localValue}
        onValueChange={(v) => setLocalValue(v as [number, number])}
        onValueCommit={handleCommit}
      />
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="rounded bg-secondary/60 px-2 py-0.5 text-xs font-medium text-foreground/70">
          {localValue[0].toFixed(2)}ct
        </span>
        <span className="text-[10px] text-foreground/35">–</span>
        <span className="rounded bg-secondary/60 px-2 py-0.5 text-xs font-medium text-foreground/70">
          {localValue[1].toFixed(2)}ct
        </span>
      </div>
    </div>
  );
};

const renderFilterItems = (
  tab: { key: FilterTabKey; label: string },
  currentValue: FilterValues[string],
  onChange: FilterChangeHandler,
  dynamicCategoryItems?: VisualFilterItem[],
  dynamicCollectionItems?: VisualFilterItem[],
  dynamicMetalItems?: VisualFilterItem[],
  dynamicShapeItems?: VisualFilterItem[],
  dynamicStockTypeItems?: VisualFilterItem[],
  dynamicCaratItems?: VisualFilterItem[],
  dynamicRingSizeItems?: VisualFilterItem[],
  dynamicCertificateItems?: VisualFilterItem[]
) => {
  const items =
    (tab.key === 'category'          && dynamicCategoryItems)    ? dynamicCategoryItems    :
    (tab.key === 'cfSubCategoryType' && dynamicCollectionItems)  ? dynamicCollectionItems  :
    (tab.key === 'metal'             && dynamicMetalItems)       ? dynamicMetalItems       :
    (tab.key === 'shape'             && dynamicShapeItems)       ? dynamicShapeItems       :
    (tab.key === 'stockType'         && dynamicStockTypeItems)   ? dynamicStockTypeItems   :
    (tab.key === 'caratWeight'       && dynamicCaratItems)       ? dynamicCaratItems       :
    (tab.key === 'ringSize'          && dynamicRingSizeItems)    ? dynamicRingSizeItems    :
    (tab.key === 'certificate'       && dynamicCertificateItems) ? dynamicCertificateItems :
    visualFilters[tab.key];

  if (tab.key === 'metal') {
    return (
      <div className="flex flex-wrap gap-2 p-1">
        {items
          .filter((item) => item.value !== '')
          .map((item) => {
            const isActive = isFilterItemActive(currentValue, item.value);
            const itemKey = item.value as string;
            const metalConfig = getMetalType(itemKey);
            return (
              <button
                key={`metal-${itemKey}`}
                onClick={() => onChange(tab.key, isActive ? '' : item.value)}
                title={metalConfig.name}
                className={`rounded border-2 px-2.5 py-1.5 text-[11px] font-bold uppercase leading-none tracking-wide transition-all ${
                  isActive ? 'border-accent' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundImage: metalConfig.image ? `url(${metalConfig.image})` : undefined,
                  backgroundColor: metalConfig.image ? undefined : metalConfig.bg,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: metalConfig.color,
                }}
              >
                {metalConfig.label}
              </button>
            );
          })}
      </div>
    );
  }

  if (tab.key === 'shape' || tab.key === 'cfSubCategoryType' || tab.key === 'stockType' || tab.key === 'certificate') {
    return (
      <div className="flex flex-wrap gap-2">
        {items
          .filter((item) => item.value !== '')
          .map((item) => {
            const isActive = isFilterItemActive(currentValue, item.value);
            return (
              <button
                key={`${tab.key}-${item.value}`}
                type="button"
                onClick={() => onChange(tab.key, isActive ? '' : item.value as string)}
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

  if (tab.key === 'caratWeight') {
    return (
      <CaratRangeSlider
        currentValue={currentValue as [number, number]}
        onChange={(val) => onChange(tab.key, val)}
        caratItems={items}
      />
    );
  }

  if (tab.key === 'category') {
    return (
      <div className="flex flex-wrap gap-2">
        {items
          .filter((item) => item.value !== '')
          .map((item) => {
            const isActive = isFilterItemActive(currentValue, item.value);
            return (
              <button
                key={`category-${item.value}`}
                type="button"
                onClick={() => onChange(tab.key, isActive ? '' : item.value as string)}
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

  if (tab.key === 'ringSize') {
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = isFilterItemActive(currentValue, item.value);
          return (
            <button
              key={`ringSize-${item.value}`}
              type="button"
              onClick={() => onChange(tab.key, isActive ? '' : item.value as string)}
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

  // Default: checkbox list (category, subCategory, stockType, certificate)
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
  dynamicCategoryItems?: VisualFilterItem[];
  dynamicCollectionItems?: VisualFilterItem[];
  dynamicMetalItems?: VisualFilterItem[];
  dynamicShapeItems?: VisualFilterItem[];
  dynamicStockTypeItems?: VisualFilterItem[];
  dynamicCaratItems?: VisualFilterItem[];
  dynamicRingSizeItems?: VisualFilterItem[];
  dynamicCertificateItems?: VisualFilterItem[];
};

const FilterSidebarContent = ({
  filterValues,
  openAccordionItems,
  setOpenAccordionItems,
  handleFilterChange,
  handleReset,
  hasActiveFilters,
  dynamicCategoryItems,
  dynamicCollectionItems,
  dynamicMetalItems,
  dynamicShapeItems,
  dynamicStockTypeItems,
  dynamicCaratItems,
  dynamicRingSizeItems,
  dynamicCertificateItems,
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

    <div className="mb-4 rounded-2xl border border-border/60 bg-background px-3.5 py-3.5">
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
          className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${filterValues.inStock === 'true' ? 'bg-accent' : 'bg-foreground/20'}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${filterValues.inStock === 'true' ? 'translate-x-5' : 'translate-x-0'}`}
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
          ) &&
          !(
            tab.key === 'caratWeight' &&
            Array.isArray(filterValues.caratWeight) &&
            isSameRange(filterValues.caratWeight as [number, number], DEFAULT_CARAT_RANGE)
          );

        return (
          <AccordionItem
            key={tab.key}
            value={tab.key}
            className="rounded-2xl border border-border/60 bg-background px-3.5"
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
                      handleFilterChange(tab.key, tab.key === 'price' ? DEFAULT_PRICE_RANGE : tab.key === 'caratWeight' ? DEFAULT_CARAT_RANGE : '')
                    }
                    className="text-[11px] text-foreground/40 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
              )}
              {renderFilterItems(tab, filterValues[tab.key], handleFilterChange, dynamicCategoryItems, dynamicCollectionItems, dynamicMetalItems, dynamicShapeItems, dynamicStockTypeItems, dynamicCaratItems, dynamicRingSizeItems, dynamicCertificateItems)}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  </div>
);

type CurrencyOption = { currency_code: string; currency_symbol: string; currency_name: string; is_base_currency: boolean };

const ShopPage = () => {
  const { category: categorySlug } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [currencyCode, setCurrencyCode] = useState('GBP');
  const [currencySymbol, setCurrencySymbol] = useState('£');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(shopSort.defaultValue);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dynamicCategoryItems, setDynamicCategoryItems] = useState<VisualFilterItem[]>([]);
  const [dynamicCollectionItems, setDynamicCollectionItems] = useState<VisualFilterItem[]>([]);
  const [dynamicMetalItems, setDynamicMetalItems] = useState<VisualFilterItem[]>([]);
  const [dynamicShapeItems, setDynamicShapeItems] = useState<VisualFilterItem[]>([]);
  const [dynamicStockTypeItems, setDynamicStockTypeItems] = useState<VisualFilterItem[]>([]);
  const [dynamicCaratItems, setDynamicCaratItems] = useState<VisualFilterItem[]>([]);
  const [dynamicRingSizeItems, setDynamicRingSizeItems] = useState<VisualFilterItem[]>([]);
  const [dynamicCertificateItems, setDynamicCertificateItems] = useState<VisualFilterItem[]>([]);
  const [youMayAlsoLikeItems, setYouMayAlsoLikeItems] = useState<{ name: string; image: string; id: string }[]>([]);
  const navigate = useNavigate();

  // Filter values are derived from the URL — single source of truth
  const filterValues = useMemo<FilterValues>(() => {
    if (categorySlug) {
      return {
        ...defaultValues,
        cfSubCategory: fromSlug(categorySlug),
        cfSubCategoryType: searchParams.get('type') ?? '',
      };
    }
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');
    const caratMin = searchParams.get('carat_min');
    const caratMax = searchParams.get('carat_max');
    return {
      search: '',
      category: searchParams.get('category') ?? '',
      subCategory: searchParams.get('sub_category') ?? '',
      cfSubCategory: searchParams.get('cf_sub_category') ?? '',
      cfSubCategoryType: searchParams.get('cf_sub_category_type') ?? '',
      metal: searchParams.get('metal') ?? '',
      shape: searchParams.get('shape') ?? '',
      stockType: searchParams.get('stock_type') ?? '',
      inStock: searchParams.get('in_stock') ?? '',
      price: (priceMin !== null || priceMax !== null)
        ? [Number(priceMin) || DEFAULT_PRICE_RANGE[0], Number(priceMax) || DEFAULT_PRICE_RANGE[1]] as [number, number]
        : DEFAULT_PRICE_RANGE,
      caratWeight: (caratMin !== null || caratMax !== null)
        ? [Number(caratMin) || DEFAULT_CARAT_RANGE[0], Number(caratMax) || DEFAULT_CARAT_RANGE[1]] as [number, number]
        : DEFAULT_CARAT_RANGE,
      ringSize: searchParams.get('ring_size') ?? '',
      certificate: searchParams.get('certificate') ?? '',
    };
  }, [categorySlug, searchParams]);

  // Reset page and search when navigating via header (category slug changes)
  useEffect(() => {
    setPage(1);
    setSearchInput('');
  }, [categorySlug]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const selectedCategory = typeof filterValues.category === 'string' ? filterValues.category : '';

  useEffect(() => {
    productsApi.getCurrency()
      .then((res) => {
        if (res.data?.currency_symbol) setCurrencySymbol(res.data.currency_symbol);
        if (res.data?.currency_code) setCurrencyCode(res.data.currency_code);
      })
      .catch(() => { /* keep default £ / GBP */ });

    productsApi.getCurrencies()
      .then((res) => { if (res.data?.currencies?.length) setCurrencies(res.data.currencies) })
      .catch(() => { /* keep empty, dropdown won't show */ });

    productsApi.getAllFilterData({ category: 'Jewellery' })
      .then((res) => {
        const d = res.data;
        if (!d) return;

        if (d.subcategories) {
          const catItems = Object.keys(d.subcategories).map((name) => ({
            label: name,
            value: name,
            image: categoryImages[name] ?? jewelleryImage,
          }));
          if (catItems.length) setDynamicCategoryItems(catItems);

          const uniqueTypes = [...new Set(Object.values(d.subcategories).flat())];
          const colItems = uniqueTypes.map((type) => ({
            label: type,
            value: type,
            image: collectionImages[type] ?? jewelleryImage,
          }));
          if (colItems.length) setDynamicCollectionItems(colItems);
        }

        if (d.metals?.length) {
          setDynamicMetalItems(d.metals.map((id) => {
            const m = getMetalType(id);
            return { label: m.name, value: id, display: m.label, image: m.image };
          }));
        }

        if (d.shapes?.length)
          setDynamicShapeItems(d.shapes.map((s) => ({ label: s, value: s })));

        if (d.stockTypes?.length) {
          setDynamicStockTypeItems(d.stockTypes.map((t) => ({
            label: t,
            value: t,
            image: t === 'Lab' ? labDiamondImage : naturalDiamondImage,
          })));
        }

        if (d.caratValues?.length) {
          setDynamicCaratItems(
            d.caratValues.map((v) => ({ label: `${v}ct`, value: [v, v] as [number, number] }))
          );
        }

        if (d.ringSizes?.length)
          setDynamicRingSizeItems(d.ringSizes.map((s) => ({ label: s, value: s })));

        if (d.certificates?.length)
          setDynamicCertificateItems(d.certificates.map((c) => ({ label: c, value: c })));
      })
      .catch(() => { /* fall back to static filter options */ });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);

    const params: Record<string, unknown> = {
      per_page: PAGE_SIZE,
      page,
      status: 'active',
      category: 'Jewellery',
      sort: sortBy,
      currency: currencySymbol,
    };

    if (selectedCategory)
      params.cf_sub_category = selectedCategory;
    if (typeof filterValues.subCategory === 'string' && filterValues.subCategory)
      params.sub_category = filterValues.subCategory;
    if (typeof filterValues.cfSubCategory === 'string' && filterValues.cfSubCategory)
      params.cf_sub_category = filterValues.cfSubCategory;
    if (typeof filterValues.cfSubCategoryType === 'string' && filterValues.cfSubCategoryType)
      params.cf_sub_category_type = filterValues.cfSubCategoryType;
    if (typeof filterValues.metal === 'string' && filterValues.metal)
      params.metal = filterValues.metal;
    if (typeof filterValues.shape === 'string' && filterValues.shape)
      params.shape = filterValues.shape;
    if (typeof filterValues.stockType === 'string' && filterValues.stockType)
      params.stock_type = filterValues.stockType;
    if (filterValues.inStock === 'true')
      params.in_stock = 'true';
    if (debouncedSearch)
      params.search = debouncedSearch;
    if (Array.isArray(filterValues.price)) {
      const [lo, hi] = filterValues.price as [number, number];
      if (lo > DEFAULT_PRICE_RANGE[0]) params.price_min = lo;
      if (hi < DEFAULT_PRICE_RANGE[1]) params.price_max = hi;
    }
    if (Array.isArray(filterValues.caratWeight)) {
      const [lo, hi] = filterValues.caratWeight as [number, number];
      if (lo > DEFAULT_CARAT_RANGE[0]) params.carat_min = lo;
      if (hi < DEFAULT_CARAT_RANGE[1]) params.carat_max = hi;
    }
    if (typeof filterValues.ringSize === 'string' && filterValues.ringSize)
      params.ring_size = filterValues.ringSize;
    if (typeof filterValues.certificate === 'string' && filterValues.certificate)
      params.certificate = filterValues.certificate;

    productsApi.list(params as Parameters<typeof productsApi.list>[0])
      .then((res) => {
        const items = (res.data?.items ?? []) as ShopProduct[];
        setTotal(res.data?.page_context?.total ?? items.length);
        setProducts(items);
      })
      .catch((err) => {
        console.error('[Shop] Failed to load products:', err);
        setFetchError('Unable to load products right now. Please try again later.');
      })
      .finally(() => { setIsLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategory, page, currencySymbol, sortBy, debouncedSearch,
    filterValues.subCategory, filterValues.cfSubCategory, filterValues.cfSubCategoryType,
    filterValues.metal, filterValues.shape,
    filterValues.stockType, filterValues.inStock, filterValues.price,
    filterValues.caratWeight, filterValues.ringSize, filterValues.certificate,
  ]);

  useEffect(() => {
    const cfSubCategoryType = typeof filterValues.cfSubCategoryType === 'string' ? filterValues.cfSubCategoryType : '';
    const cfSubCategory = typeof filterValues.cfSubCategory === 'string' ? filterValues.cfSubCategory : '';

    const params: Record<string, unknown> = {
      per_page: 8,
      page: 1,
      status: 'active',
      category: 'Jewellery',
    };
    if (cfSubCategoryType) params.cf_sub_category_type = cfSubCategoryType;
    else if (cfSubCategory) params.cf_sub_category = cfSubCategory;

    productsApi.list(params as Parameters<typeof productsApi.list>[0])
      .then((res) => {
        const items = (res.data?.items ?? []) as ShopProduct[];
        setYouMayAlsoLikeItems(
          items.slice(0, 8).map((p) => ({ name: p.name, image: p.image, id: p.id }))
        );
      })
      .catch(() => {});
  }, [filterValues.cfSubCategoryType, filterValues.cfSubCategory]);

  const handleFilterChange = useCallback(
    (key: string, value: string | string[] | [number, number]) => {
      const newFilters = { ...filterValues, [key]: value };
      const newParams = new URLSearchParams();
      if (newFilters.category && typeof newFilters.category === 'string') newParams.set('category', newFilters.category);
      if (newFilters.subCategory && typeof newFilters.subCategory === 'string') newParams.set('sub_category', newFilters.subCategory);
      if (newFilters.cfSubCategory && typeof newFilters.cfSubCategory === 'string') newParams.set('cf_sub_category', newFilters.cfSubCategory);
      if (newFilters.cfSubCategoryType && typeof newFilters.cfSubCategoryType === 'string') newParams.set('cf_sub_category_type', newFilters.cfSubCategoryType);
      if (newFilters.metal && typeof newFilters.metal === 'string') newParams.set('metal', newFilters.metal);
      if (newFilters.shape && typeof newFilters.shape === 'string') newParams.set('shape', newFilters.shape);
      if (newFilters.stockType && typeof newFilters.stockType === 'string') newParams.set('stock_type', newFilters.stockType);
      if (newFilters.inStock === 'true') newParams.set('in_stock', 'true');
      if (Array.isArray(newFilters.price)) {
        const [lo, hi] = newFilters.price as [number, number];
        if (lo > DEFAULT_PRICE_RANGE[0]) newParams.set('price_min', String(lo));
        if (hi < DEFAULT_PRICE_RANGE[1]) newParams.set('price_max', String(hi));
      }
      if (Array.isArray(newFilters.caratWeight)) {
        const [lo, hi] = newFilters.caratWeight as [number, number];
        if (lo > DEFAULT_CARAT_RANGE[0]) newParams.set('carat_min', String(lo));
        if (hi < DEFAULT_CARAT_RANGE[1]) newParams.set('carat_max', String(hi));
      }
      if (newFilters.ringSize && typeof newFilters.ringSize === 'string') newParams.set('ring_size', newFilters.ringSize);
      if (newFilters.certificate && typeof newFilters.certificate === 'string') newParams.set('certificate', newFilters.certificate);
      setPage(1);
      if (categorySlug) {
        navigate(`/jewellery/all?${newParams.toString()}`);
      } else {
        setSearchParams(newParams, { replace: true });
      }
    },
    [filterValues, categorySlug, navigate, setSearchParams]
  );

  const handleReset = useCallback(() => {
    setSearchInput('');
    setPage(1);
    navigate('/jewellery/all');
  }, [navigate]);


  const hasActiveFilters = useMemo(() => {
    const { category, subCategory, cfSubCategory, cfSubCategoryType, metal, shape, stockType, price, inStock, caratWeight, ringSize, certificate } = filterValues;
    const [lo, hi] = Array.isArray(price) ? (price as [number, number]) : DEFAULT_PRICE_RANGE;
    const [clo, chi] = Array.isArray(caratWeight) ? (caratWeight as [number, number]) : DEFAULT_CARAT_RANGE;
    return Boolean(
      debouncedSearch.trim() ||
      category ||
      subCategory ||
      cfSubCategory ||
      cfSubCategoryType ||
      metal ||
      (typeof shape === 'string' && shape) ||
      (Array.isArray(shape) && shape.length > 0) ||
      stockType ||
      inStock === 'true' ||
      !isSameRange([lo, hi], DEFAULT_PRICE_RANGE) ||
      !isSameRange([clo, chi], DEFAULT_CARAT_RANGE) ||
      (typeof ringSize === 'string' && ringSize) ||
      (typeof certificate === 'string' && certificate)
    );
  }, [filterValues, debouncedSearch]);

  const activeFilterChips = useMemo(() => {
    const chips: { key: FilterTabKey; label: string }[] = [];
    if (typeof filterValues.category === 'string' && filterValues.category)
      chips.push({ key: 'category', label: filterValues.category });
    if (typeof filterValues.subCategory === 'string' && filterValues.subCategory)
      chips.push({ key: 'subCategory', label: filterValues.subCategory });
    if (typeof filterValues.cfSubCategory === 'string' && filterValues.cfSubCategory)
      chips.push({ key: 'cfSubCategory', label: filterValues.cfSubCategory as string });
    if (typeof filterValues.cfSubCategoryType === 'string' && filterValues.cfSubCategoryType)
      chips.push({ key: 'cfSubCategoryType', label: filterValues.cfSubCategoryType as string });
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
    if (
      Array.isArray(filterValues.caratWeight) &&
      !isSameRange(filterValues.caratWeight as [number, number], DEFAULT_CARAT_RANGE)
    ) {
      const [lo, hi] = filterValues.caratWeight as [number, number];
      const caratItem = visualFilters.caratWeight.find(
        (p) => Array.isArray(p.value) && isSameRange(p.value as [number, number], [lo, hi])
      );
      chips.push({ key: 'caratWeight', label: caratItem?.label ?? `${lo.toFixed(2)}–${hi.toFixed(2)}ct` });
    }
    if (typeof filterValues.ringSize === 'string' && filterValues.ringSize)
      chips.push({ key: 'ringSize', label: `Size ${filterValues.ringSize}` });
    if (typeof filterValues.certificate === 'string' && filterValues.certificate)
      chips.push({ key: 'certificate', label: filterValues.certificate });
    return chips;
  }, [filterValues]);

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
                    dynamicCategoryItems={dynamicCategoryItems.length ? dynamicCategoryItems : undefined}
                    dynamicCollectionItems={dynamicCollectionItems.length ? dynamicCollectionItems : undefined}
                    dynamicMetalItems={dynamicMetalItems.length ? dynamicMetalItems : undefined}
                    dynamicShapeItems={dynamicShapeItems.length ? dynamicShapeItems : undefined}
                    dynamicStockTypeItems={dynamicStockTypeItems.length ? dynamicStockTypeItems : undefined}
                    dynamicCaratItems={dynamicCaratItems.length ? dynamicCaratItems : undefined}
                    dynamicRingSizeItems={dynamicRingSizeItems.length ? dynamicRingSizeItems : undefined}
                    dynamicCertificateItems={dynamicCertificateItems.length ? dynamicCertificateItems : undefined}
                  />
                </div>
                <div className="shrink-0 border-t border-border/40 px-6 py-4">
                  <SheetClose asChild>
                    <button
                      type="button"
                      className="w-full rounded bg-accent py-3 text-sm font-semibold uppercase tracking-[0.12em] text-accent-foreground transition-colors hover:bg-accent/90"
                    >
                      View {total.toLocaleString()}{total === 1 ? 'Product' : 'Products'}
                    </button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>

            <label className="relative block min-w-[200px] flex-1 sm:max-w-[320px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search products"
                className="h-10 w-full rounded border border-border bg-background pl-10 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-primary"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
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

            <span className="ml-auto text-sm text-foreground/55">
              {total.toLocaleString()}{total === 1 ? 'result' : 'results'}
            </span>
            {currencies.length > 0 && (
              <select
                value={currencyCode}
                onChange={(e) => {
                  const selected = currencies.find(c => c.currency_code === e.target.value);
                  if (selected) {
                    setCurrencyCode(selected.currency_code);
                    setCurrencySymbol(selected.currency_symbol);
                  }
                }}
                className="h-10 rounded border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              >
                {currencies.filter(c => c.currency_code === 'USD' || c.currency_code === 'GBP').map(c => (
                  <option key={c.currency_code} value={c.currency_code}>
                    {c.currency_code} {c.currency_symbol}
                  </option>
                ))}
              </select>
            )}
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
                    handleFilterChange(chip.key, chip.key === 'price' ? DEFAULT_PRICE_RANGE : chip.key === 'caratWeight' ? DEFAULT_CARAT_RANGE : '')
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
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
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
            ) : total === 0 ? (
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
                {products.map((product) => (
                  <ShopProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {!isLoading && (
              <PaginationBar
                page={page}
                totalPages={Math.ceil(total / PAGE_SIZE)}
                onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            )}
          </div>
        </div>
      </section>

      <YouMayAlsoLike items={youMayAlsoLikeItems} hasActiveFilters={hasActiveFilters} />
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
