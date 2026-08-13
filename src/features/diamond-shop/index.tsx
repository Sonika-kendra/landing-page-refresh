import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { ChevronUp, Search, SlidersHorizontal, X } from 'lucide-react';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { productsApi } from '@/api/products';
import PageLayout from '@/components/shared/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import CommitmentSection from '@/features/jewellery/sections/CommitmentSection';
import DiamondCard, { type DiamondItem } from './DiamondCard';
import DiamondDetailModal from './DiamondDetailModal';
import { CompareProvider } from './CompareContext';
import CompareTray from './CompareTray';
import ShapeIcon from '@/components/shared/ShapeIcon';

const PAGE_SIZE = 12;
const DEFAULT_CARAT_RANGE: [number, number] = [0, 99];
const DEFAULT_DEPTH_RANGE: [number, number] = [50, 80];
const DEFAULT_TABLE_RANGE: [number, number] = [50, 80];
const DEFAULT_TOTAL_VALUE_RANGE: [number, number] = [0, 100000];
const DEFAULT_STOCK_TYPE = 'Natural';

const SHAPES       = ['Round', 'Princess', 'Emerald', 'Oval', 'Pear', 'Cushion', 'Marquise', 'Radiant', 'Asscher', 'Heart'];
const COLOURS      = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const CLARITIES    = ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1'];
const CUTS         = ['EX', 'VG', 'G', 'F'];
const POLISHES     = ['EX', 'VG', 'GD'];
const SYMMETRIES   = ['EX', 'VG', 'GD'];
const FLUORESCENCES = ['None', 'Faint', 'Medium', 'Strong', 'Very Strong'];
const CERTIFICATES = ['GIA', 'IGI', 'HRD'];
const STOCK_TYPES  = ['Natural', 'Lab'];

const isSameRange = (a: [number, number], b: [number, number]) => a[0] === b[0] && a[1] === b[1];

type FilterValues = {
  shape: string[];
  colour: string[];
  clarity: string[];
  cut: string[];
  polish: string[];
  symmetry: string[];
  fluorescence: string[];
  caratWeight: [number, number];
  depth: [number, number];
  table: [number, number];
  totalValue: [number, number];
  certificate: string[];
  type: string;
};

const defaultValues: FilterValues = {
  shape: [], colour: [], clarity: [], cut: [], polish: [], symmetry: [], fluorescence: [],
  caratWeight: DEFAULT_CARAT_RANGE,
  depth: DEFAULT_DEPTH_RANGE, table: DEFAULT_TABLE_RANGE, totalValue: DEFAULT_TOTAL_VALUE_RANGE,
  certificate: [], type: DEFAULT_STOCK_TYPE,
};

type TabKey = keyof FilterValues;

// Tabs whose value is a multi-select array of pill options rather than a single string
const MULTI_SELECT_KEYS: TabKey[] = ['shape', 'colour', 'clarity', 'cut', 'polish', 'symmetry', 'fluorescence', 'certificate'];

// Range-typed tabs need their default and isSameRange comparison instead of plain truthiness.
// caratWeight and totalValue are handled separately by rangeDefaultFor since their bounds are
// fetched dynamically from live stock instead of being fixed constants.
const RANGE_DEFAULTS: Partial<Record<TabKey, [number, number]>> = {
  depth: DEFAULT_DEPTH_RANGE, table: DEFAULT_TABLE_RANGE,
};
// Non-range, non-multi-select tabs whose "no filter applied" state isn't an empty string
const NON_EMPTY_DEFAULTS: Partial<Record<TabKey, string>> = { type: DEFAULT_STOCK_TYPE };

type DynamicRanges = { caratWeight: [number, number]; totalValue: [number, number] };
const DEFAULT_RANGES: DynamicRanges = { caratWeight: DEFAULT_CARAT_RANGE, totalValue: DEFAULT_TOTAL_VALUE_RANGE };

// caratWeight's and totalValue's real bounds are fetched from live stock (see caratRange/maxPrice
// state), so callers pass the current ranges in explicitly instead of relying on RANGE_DEFAULTS.
const rangeDefaultFor = (key: TabKey, ranges: DynamicRanges): [number, number] | undefined =>
  key === 'totalValue' ? ranges.totalValue : key === 'caratWeight' ? ranges.caratWeight : RANGE_DEFAULTS[key];

const defaultFor = (key: TabKey, ranges: DynamicRanges = DEFAULT_RANGES): unknown =>
  rangeDefaultFor(key, ranges) ?? (MULTI_SELECT_KEYS.includes(key) ? [] : NON_EMPTY_DEFAULTS[key] ?? '');

const isDefaultValue = (key: TabKey, value: unknown, ranges: DynamicRanges = DEFAULT_RANGES): boolean => {
  const def = rangeDefaultFor(key, ranges);
  if (def) return isSameRange(value as [number, number], def);
  if (Array.isArray(value)) return value.length === 0;
  return value === defaultFor(key, ranges);
};

const staticOptions: Record<string, string[]> = {
  shape: SHAPES, colour: COLOURS, clarity: CLARITIES,
  cut: CUTS, polish: POLISHES, symmetry: SYMMETRIES,
  fluorescence: FLUORESCENCES, certificate: CERTIFICATES, type: STOCK_TYPES,
};

// Carat range slider — bounds come from the live min/max carat weight in stock (see caratRange state)
const CaratRangeSlider = ({
  min, max, currentValue, onChange,
}: {
  min: number; max: number;
  currentValue: [number, number];
  onChange: (v: [number, number]) => void;
}) => {
  const [local, setLocal] = useState<[number, number]>(currentValue);
  useEffect(() => { setLocal(currentValue); }, [currentValue[0], currentValue[1]]);

  const handleCommit = (v: [number, number]) => {
    const lo = Math.max(min, Math.min(v[0], v[1]));
    const hi = Math.min(max, Math.max(v[0], v[1]));
    onChange(lo <= min && hi >= max ? [min, max] : [lo, hi]);
  };

  return (
    <div className="px-1 pb-2.5 pt-3">
      <Slider
        min={min} max={max} step={0.01}
        value={local}
        onValueChange={(v) => setLocal(v as [number, number])}
        onValueCommit={(v) => handleCommit(v as [number, number])}
      />
      <div className="mt-3 flex items-center justify-between gap-2">
        <label className="flex items-center gap-1 rounded bg-secondary/60 px-2 py-0.5">
          <input
            type="number"
            inputMode="decimal"
            step={0.01}
            min={min}
            max={max}
            value={local[0]}
            onChange={(e) => setLocal([Number(e.target.value) || 0, local[1]])}
            onBlur={() => handleCommit(local)}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="w-14 bg-transparent text-sm font-medium text-foreground/70 outline-none"
          />
          <span className="text-sm font-medium text-foreground/70">ct</span>
        </label>
        <span className="text-xs text-foreground/35">–</span>
        <label className="flex items-center gap-1 rounded bg-secondary/60 px-2 py-0.5">
          <input
            type="number"
            inputMode="decimal"
            step={0.01}
            min={min}
            max={max}
            value={local[1]}
            onChange={(e) => setLocal([local[0], Number(e.target.value) || 0])}
            onBlur={() => handleCommit(local)}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="w-14 bg-transparent text-sm font-medium text-foreground/70 outline-none"
          />
          <span className="text-sm font-medium text-foreground/70">ct</span>
        </label>
      </div>
    </div>
  );
};

// Plain percentage/number range slider (depth, table) — no outlier-cap quirk like carat weight needs
const NumberRangeSlider = ({
  min, max, step, unit, currentValue, onChange,
}: {
  min: number; max: number; step: number; unit: string;
  currentValue: [number, number];
  onChange: (v: [number, number]) => void;
}) => {
  const [local, setLocal] = useState<[number, number]>(currentValue);
  useEffect(() => { setLocal(currentValue); }, [currentValue[0], currentValue[1]]);

  return (
    <div className="px-1 pb-2.5 pt-3">
      <Slider
        min={min} max={max} step={step}
        value={local}
        onValueChange={(v) => setLocal([v[0], v[1]] as [number, number])}
        onValueCommit={(v) => onChange([v[0], v[1]] as [number, number])}
      />
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="rounded bg-secondary/60 px-2 py-0.5 text-sm font-medium text-foreground/70">
          {local[0].toFixed(1)}{unit}
        </span>
        <span className="text-xs text-foreground/35">–</span>
        <span className="rounded bg-secondary/60 px-2 py-0.5 text-sm font-medium text-foreground/70">
          {local[1].toFixed(1)}{unit}
        </span>
      </div>
    </div>
  );
};

const PriceRangeSlider = ({
  min, max, currentValue, onChange, currencySymbol,
}: {
  min: number; max: number;
  currentValue: [number, number];
  onChange: (v: [number, number]) => void;
  currencySymbol: string;
}) => {
  const [local, setLocal] = useState<[number, number]>(currentValue);
  useEffect(() => { setLocal(currentValue); }, [currentValue[0], currentValue[1]]);

  const handleCommit = (v: [number, number]) => {
    const lo = Math.max(min, Math.min(v[0], v[1]));
    const hi = Math.min(max, Math.max(v[0], v[1]));
    onChange(lo === min && hi >= max ? [min, max] : [lo, hi]);
  };

  return (
    <div className="px-1 pb-2.5 pt-3">
      <Slider
        min={min}
        max={max}
        step={10}
        value={local}
        onValueChange={(v) => setLocal(v as [number, number])}
        onValueCommit={(v) => handleCommit(v as [number, number])}
      />
      <div className="mt-3 flex items-center justify-between gap-2">
        <label className="flex items-center gap-1 rounded bg-secondary/60 px-2 py-0.5">
          <span className="text-sm font-medium text-foreground/70">{currencySymbol}</span>
          <input
            type="number"
            inputMode="decimal"
            step={10}
            min={min}
            max={max}
            value={local[0]}
            onChange={(e) => setLocal([Number(e.target.value) || 0, local[1]])}
            onBlur={() => handleCommit(local)}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="w-16 bg-transparent text-sm font-medium text-foreground/70 outline-none"
          />
        </label>
        <span className="text-xs text-foreground/35">–</span>
        <label className="flex items-center gap-1 rounded bg-secondary/60 px-2 py-0.5">
          <span className="text-sm font-medium text-foreground/70">{currencySymbol}</span>
          <input
            type="number"
            inputMode="decimal"
            step={10}
            min={min}
            max={max}
            value={local[1]}
            onChange={(e) => setLocal([local[0], Number(e.target.value) || 0])}
            onBlur={() => handleCommit(local)}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="w-16 bg-transparent text-sm font-medium text-foreground/70 outline-none"
          />
        </label>
      </div>
    </div>
  );
};

// A titled section of the filter sidebar, with an optional per-section "Clear" action.
const FilterSection = ({
  title, isActive, onClear, children, noBorder,
}: { title: string; isActive?: boolean; onClear?: () => void; children: React.ReactNode; noBorder?: boolean }) => (
  <div className={`py-4 first:pt-0 ${noBorder ? '' : 'border-b border-border/50'}`}>
    <div className="mb-2.5 flex items-center justify-between">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">{title}</h3>
      {isActive && onClear && (
        <button type="button" onClick={onClear} className="text-[11px] text-foreground/40 underline underline-offset-4 transition-colors hover:text-foreground">
          Clear
        </button>
      )}
    </div>
    {children}
  </div>
);

const renderTab = (
  tab: { key: TabKey; label: string }, value: FilterValues[TabKey], onChange: (k: TabKey, v: unknown) => void,
  ranges: DynamicRanges = DEFAULT_RANGES, currencySymbol = '£',
) => {
  if (tab.key === 'caratWeight') {
    return (
      <CaratRangeSlider
        min={ranges.caratWeight[0]} max={ranges.caratWeight[1]}
        currentValue={value as [number, number]}
        onChange={(v) => onChange(tab.key, v)}
      />
    );
  }

  if (tab.key === 'depth' || tab.key === 'table') {
    const range = tab.key === 'depth' ? DEFAULT_DEPTH_RANGE : DEFAULT_TABLE_RANGE;
    return (
      <NumberRangeSlider
        min={range[0]} max={range[1]} step={0.1} unit="%"
        currentValue={value as [number, number]}
        onChange={(v) => onChange(tab.key, v)}
      />
    );
  }

  if (tab.key === 'totalValue') {
    return (
      <PriceRangeSlider
        min={ranges.totalValue[0]} max={ranges.totalValue[1]}
        currentValue={value as [number, number]}
        onChange={(v) => onChange(tab.key, v)}
        currencySymbol={currencySymbol}
      />
    );
  }

  if (tab.key === 'type') {
    return (
      <div className="flex flex-wrap gap-1.5">
        {STOCK_TYPES.map((opt) => {
          const isActive = value === opt;
          return (
            <button
              key={opt} type="button"
              onClick={() => onChange(tab.key, opt)}
              aria-pressed={isActive}
              className={`rounded-md border px-3 py-1 text-sm font-medium transition-all duration-200 ${isActive ? 'border-accent bg-accent text-accent-foreground shadow-sm' : 'border-border/50 text-foreground/65 hover:border-accent/60 hover:text-foreground'}`}
            >
              {opt === 'Lab' ? 'Lab Grown' : opt}
            </button>
          );
        })}
      </div>
    );
  }

  // Shape: icon tile grid rather than text pills
  if (tab.key === 'shape') {
    const selected = value as string[];
    return (
      <div className="grid grid-cols-5 gap-1.5">
        {SHAPES.map((opt) => {
          const isActive = selected.includes(opt);
          return (
            <button
              key={opt} type="button"
              onClick={() => onChange(tab.key, isActive ? selected.filter((v) => v !== opt) : [...selected, opt])}
              aria-pressed={isActive}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border py-3 text-center transition-all duration-200 ${isActive ? 'border-accent bg-accent/10 text-accent shadow-sm' : 'border-border text-foreground/65 hover:border-accent/60 hover:text-foreground'}`}
            >
              <ShapeIcon shape={opt} className="h-9 w-9" />
              <span className="text-[11px] font-medium">{opt}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Swatch buttons for colour, clarity, cut, polish, symmetry, fluorescence, certificate — multi-select
  const options = staticOptions[tab.key] ?? [];
  const selected = value as string[];
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const isActive = selected.includes(opt);
        return (
          <button
            key={opt} type="button"
            onClick={() => onChange(tab.key, isActive ? selected.filter((v) => v !== opt) : [...selected, opt])}
            aria-pressed={isActive}
            className={`flex min-w-[2.25rem] items-center justify-center gap-1 rounded-md border px-2 py-1 text-sm font-medium transition-all duration-200 ${isActive ? 'border-accent bg-accent text-accent-foreground shadow-sm' : 'border-border/50 text-foreground/65 hover:border-accent/60 hover:text-foreground'}`}
          >
            {tab.key === 'shape' && <ShapeIcon shape={opt} />}
            {opt}
          </button>
        );
      })}
    </div>
  );
};

type CurrencyOption = { currency_code: string; currency_symbol: string; currency_name: string; is_base_currency: boolean };

const DiamondShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<DiamondItem[]>([]);
  const [total, setTotal] = useState(0);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [currencyCode, setCurrencyCode] = useState('GBP');
  const [currencySymbol, setCurrencySymbol] = useState('£');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('price-asc');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<DiamondItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_TOTAL_VALUE_RANGE[1]);
  const [caratRange, setCaratRange] = useState<[number, number]>(DEFAULT_CARAT_RANGE);

  // Browsers restore the previous scroll offset on a manual reload (F5) for the same
  // history entry, which looks like "landing on row 2" when a filter was scrolled to earlier.
  // Take manual control so a fresh mount always starts at the top.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  // stock type tab derived from URL, defaults to 'Natural'
  const stockTypeTab = (searchParams.get('stock_type') ?? 'Natural') as 'Natural' | 'Lab';

  // Price slider ceiling: the highest-priced diamond currently in stock for this type,
  // rounded up to a clean step. Falls back to DEFAULT_TOTAL_VALUE_RANGE until it loads.
  const totalValueRange = useMemo<[number, number]>(() => [0, maxPrice], [maxPrice]);

  useEffect(() => {
    productsApi.listDiamonds({
      per_page: 1, page: 1, status: 'active', category: 'Diamonds',
      cf_stock_sub_category: 'Single Item', sort: 'price-desc', stock_type: stockTypeTab,
    })
      .then((res) => {
        const top = (res.data?.items ?? [])[0] as DiamondItem | undefined;
        const topPrice = typeof top?.price === 'number' ? top.price : 0;
        if (topPrice > 0) setMaxPrice(Math.ceil(topPrice / 1000) * 1000);
      })
      .catch(() => {});
  }, [stockTypeTab]);

  // Carat slider bounds: the real min/max carat weight across current diamond stock.
  // Falls back to DEFAULT_CARAT_RANGE until it loads.
  // ponytail: cf_carat_total occasionally holds a parcel/lot total (e.g. 73.7, 94.7) rather than
  // a single stone's weight, so cap at 50ct — well above any real single diamond in this catalogue
  // (largest legitimate value seen is ~6ct) — to keep those lot totals from blowing out the slider.
  useEffect(() => {
    productsApi.getFilterOptions({ category: 'Diamonds' })
      .then((res) => {
        const values = (res.data?.caratValues ?? []).filter((v) => v > 0 && v < 50);
        if (values.length) {
          setCaratRange([
            Math.floor(Math.min(...values) * 100) / 100,
            Math.ceil(Math.max(...values) * 100) / 100,
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const dynamicRanges = useMemo<DynamicRanges>(
    () => ({ caratWeight: caratRange, totalValue: totalValueRange }),
    [caratRange, totalValueRange]
  );

  // All other filters from URL
  const filterValues = useMemo<FilterValues>(() => {
    const parseMulti = (key: string) =>
      (searchParams.get(key) ?? '').split(',').map((v) => v.trim()).filter(Boolean);
    const caratMin = searchParams.get('carat_min');
    const caratMax = searchParams.get('carat_max');
    const depthMin = searchParams.get('depth_min');
    const depthMax = searchParams.get('depth_max');
    const tableMin = searchParams.get('table_min');
    const tableMax = searchParams.get('table_max');
    const totalMin = searchParams.get('price_min');
    const totalMax = searchParams.get('price_max');
    return {
      shape:       parseMulti('shape'),
      colour:      parseMulti('colour'),
      clarity:     parseMulti('clarity'),
      cut:         parseMulti('cut'),
      polish:      parseMulti('polish'),
      symmetry:    parseMulti('symmetry'),
      fluorescence:parseMulti('fluorescence'),
      certificate: parseMulti('certificate'),
      type:        searchParams.get('stock_type') === 'Lab' ? 'Lab' : DEFAULT_STOCK_TYPE,
      caratWeight: (caratMin || caratMax)
        ? [Number(caratMin) || caratRange[0], Number(caratMax) || caratRange[1]] as [number, number]
        : caratRange,
      depth: (depthMin || depthMax)
        ? [Number(depthMin) || DEFAULT_DEPTH_RANGE[0], Number(depthMax) || DEFAULT_DEPTH_RANGE[1]] as [number, number]
        : DEFAULT_DEPTH_RANGE,
      table: (tableMin || tableMax)
        ? [Number(tableMin) || DEFAULT_TABLE_RANGE[0], Number(tableMax) || DEFAULT_TABLE_RANGE[1]] as [number, number]
        : DEFAULT_TABLE_RANGE,
      totalValue: (totalMin || totalMax)
        ? [Number(totalMin) || totalValueRange[0], Number(totalMax) || totalValueRange[1]] as [number, number]
        : totalValueRange,
    };
  }, [searchParams, totalValueRange, caratRange]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    productsApi.getCurrency()
      .then((res) => {
        if (res.data?.currency_symbol) setCurrencySymbol(res.data.currency_symbol);
        if (res.data?.currency_code) setCurrencyCode(res.data.currency_code);
      })
      .catch(() => {});
    productsApi.getCurrencies()
      .then((res) => { if (res.data?.currencies?.length) setCurrencies(res.data.currencies); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);

    const params: Record<string, unknown> = {
      per_page: PAGE_SIZE, page,
      status: 'active',
      category: 'Diamonds',
      cf_stock_sub_category: 'Single Item',
      sort: sortBy,
      currency: currencySymbol,
      stock_type: stockTypeTab,
    };

    if (filterValues.shape.length)        params.shape        = filterValues.shape.join(',');
    if (filterValues.colour.length)       params.colour       = filterValues.colour.join(',');
    if (filterValues.clarity.length)      params.clarity      = filterValues.clarity.join(',');
    if (filterValues.cut.length)          params.cut          = filterValues.cut.join(',');
    if (filterValues.polish.length)       params.polish       = filterValues.polish.join(',');
    if (filterValues.symmetry.length)     params.symmetry     = filterValues.symmetry.join(',');
    if (filterValues.fluorescence.length) params.fluorescence = filterValues.fluorescence.join(',');
    if (filterValues.certificate.length)  params.certificate  = filterValues.certificate.join(',');
    if (debouncedSearch)                  params.search       = debouncedSearch;

    if (!isSameRange(filterValues.caratWeight, caratRange)) {
      const [lo, hi] = filterValues.caratWeight;
      if (lo > caratRange[0]) params.carat_min = lo;
      if (hi < caratRange[1]) params.carat_max = hi;
    }
    if (!isSameRange(filterValues.depth, DEFAULT_DEPTH_RANGE)) {
      const [lo, hi] = filterValues.depth;
      if (lo > DEFAULT_DEPTH_RANGE[0]) params.depth_min = lo;
      if (hi < DEFAULT_DEPTH_RANGE[1]) params.depth_max = hi;
    }
    if (!isSameRange(filterValues.table, DEFAULT_TABLE_RANGE)) {
      const [lo, hi] = filterValues.table;
      if (lo > DEFAULT_TABLE_RANGE[0]) params.table_min = lo;
      if (hi < DEFAULT_TABLE_RANGE[1]) params.table_max = hi;
    }
    if (!isSameRange(filterValues.totalValue, totalValueRange)) {
      const [lo, hi] = filterValues.totalValue;
      if (lo > totalValueRange[0]) params.price_min = lo;
      if (hi < totalValueRange[1]) params.price_max = hi;
    }

    productsApi.listDiamonds(params as Parameters<typeof productsApi.listDiamonds>[0])
      .then((res) => {
        const items = (res.data?.items ?? []) as DiamondItem[];
        setTotal(res.data?.page_context?.total ?? items.length);
        setProducts(items);
        setIsLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return; // superseded by a newer request; that one owns isLoading/error state
        console.error('[DiamondShop] Failed to load:', err);
        setFetchError('Unable to load diamonds right now. Please try again later.');
        setIsLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, currencySymbol, sortBy, debouncedSearch, stockTypeTab,
      filterValues.shape, filterValues.colour, filterValues.clarity,
      filterValues.cut, filterValues.polish, filterValues.symmetry,
      filterValues.fluorescence, filterValues.certificate,
      filterValues.caratWeight, caratRange,
      filterValues.depth, filterValues.table, filterValues.totalValue]);

  const setFilter = useCallback((key: TabKey, value: unknown) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('stock_type', stockTypeTab);

    const write = (k: string, v: unknown) => {
      if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) { newParams.delete(k); return; }
      newParams.set(k, Array.isArray(v) ? v.join(',') : String(v));
    };

    const writeRange = (lo: number, hi: number, def: [number, number], minKey: string, maxKey: string) => {
      lo > def[0] ? newParams.set(minKey, String(lo)) : newParams.delete(minKey);
      hi < def[1] ? newParams.set(maxKey, String(hi)) : newParams.delete(maxKey);
    };

    if (key === 'caratWeight') {
      const [lo, hi] = value as [number, number];
      writeRange(lo, hi, caratRange, 'carat_min', 'carat_max');
    } else if (key === 'depth') {
      const [lo, hi] = value as [number, number];
      writeRange(lo, hi, DEFAULT_DEPTH_RANGE, 'depth_min', 'depth_max');
    } else if (key === 'table') {
      const [lo, hi] = value as [number, number];
      writeRange(lo, hi, DEFAULT_TABLE_RANGE, 'table_min', 'table_max');
    } else if (key === 'totalValue') {
      const [lo, hi] = value as [number, number];
      writeRange(lo, hi, totalValueRange, 'price_min', 'price_max');
    } else if (key === 'type') {
      newParams.set('stock_type', value as string);
    } else {
      write(key, value);
    }

    setPage(1);
    setSearchParams(newParams, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, stockTypeTab, setSearchParams, totalValueRange, caratRange]);

  // Removes a single value from a multi-select tab's array (e.g. unchecking one shape pill)
  // without clearing the other selected values in that same tab.
  const removeFilterValue = useCallback((key: TabKey, val: string) => {
    setFilter(key, (filterValues[key] as string[]).filter((v) => v !== val));
  }, [filterValues, setFilter]);

  const setStockType = (type: 'Natural' | 'Lab') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('stock_type', type);
    setPage(1);
    setSearchParams(newParams, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isTabActive = (key: TabKey) => {
    const val = filterValues[key];
    return Boolean(val) && !isDefaultValue(key, val, dynamicRanges);
  };
  const clearTab = (key: TabKey) => setFilter(key, defaultFor(key, dynamicRanges));

  const handleReset = useCallback(() => {
    setSearchInput('');
    setPage(1);
    setSearchParams({ stock_type: stockTypeTab }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stockTypeTab, setSearchParams]);

  // Note: 'type' (Natural/Lab) mirrors the persistent header toggle, not a clearable filter —
  // handleReset intentionally preserves stock_type, so it's excluded here too.
  const hasActiveFilters = useMemo(() => {
    return Boolean(
      debouncedSearch.trim() ||
      filterValues.shape.length || filterValues.colour.length || filterValues.clarity.length ||
      filterValues.cut.length || filterValues.polish.length || filterValues.symmetry.length ||
      filterValues.fluorescence.length || filterValues.certificate.length ||
      !isSameRange(filterValues.caratWeight, caratRange) ||
      !isSameRange(filterValues.depth, DEFAULT_DEPTH_RANGE) ||
      !isSameRange(filterValues.table, DEFAULT_TABLE_RANGE) ||
      !isSameRange(filterValues.totalValue, totalValueRange)
    );
  }, [filterValues, debouncedSearch, totalValueRange, caratRange]);

  const activeChips = useMemo(() => {
    // removeValue is set for multi-select tabs so a chip removes just that one value;
    // omitted for range/type chips, which clear the whole tab instead.
    const chips: { key: TabKey; label: string; removeValue?: string }[] = [];
    const pushMulti = (key: TabKey, prefix: string) => {
      (filterValues[key] as string[]).forEach((v) => chips.push({ key, label: prefix ? `${prefix}: ${v}` : v, removeValue: v }));
    };
    pushMulti('shape', '');
    pushMulti('colour', 'Colour');
    pushMulti('clarity', 'Clarity');
    pushMulti('cut', 'Cut');
    pushMulti('polish', 'Polish');
    pushMulti('symmetry', 'Symmetry');
    pushMulti('fluorescence', '');
    pushMulti('certificate', '');
    if (!isSameRange(filterValues.caratWeight, caratRange)) {
      const [lo, hi] = filterValues.caratWeight;
      chips.push({ key: 'caratWeight', label: `${lo.toFixed(2)}–${hi.toFixed(2)}ct` });
    }
    if (!isSameRange(filterValues.depth, DEFAULT_DEPTH_RANGE)) {
      const [lo, hi] = filterValues.depth;
      chips.push({ key: 'depth', label: `Depth: ${lo.toFixed(1)}–${hi.toFixed(1)}%` });
    }
    if (!isSameRange(filterValues.table, DEFAULT_TABLE_RANGE)) {
      const [lo, hi] = filterValues.table;
      chips.push({ key: 'table', label: `Table: ${lo.toFixed(1)}–${hi.toFixed(1)}%` });
    }
    if (!isSameRange(filterValues.totalValue, totalValueRange)) {
      const [lo, hi] = filterValues.totalValue;
      chips.push({ key: 'totalValue', label: `Price: ${currencySymbol}${lo.toLocaleString()}–${currencySymbol}${hi.toLocaleString()}` });
    }
    return chips;
  }, [filterValues, currencySymbol, totalValueRange, caratRange]);

  const openModal = (item: DiamondItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CompareProvider>
    <PageLayout>
      {/* Sticky toolbar */}
      <div className="sticky top-16 z-40 border-b border-border/60 bg-background/95 backdrop-blur-sm md:top-20">
        <div className="henig-container">
          <div className="flex flex-wrap items-center gap-3 py-4">
            {/* Filter button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button className="justify-start gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  {activeChips.length > 0 && (
                    <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-background/20 text-[10px] font-bold">
                      {activeChips.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent hideCloseButton side="left" className="flex w-[90vw] max-w-none flex-col p-0 sm:w-[640px] sm:max-w-none md:w-[720px]">
                <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-5 py-4">
                  <SheetHeader className="text-left">
                    <SheetTitle className="text-sm font-semibold uppercase tracking-[0.2em]">Filters</SheetTitle>
                  </SheetHeader>
                  <SheetClose className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-foreground/20 bg-foreground/10 text-foreground transition-colors hover:bg-foreground/20">
                    <X className="h-3.5 w-3.5" />
                  </SheetClose>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-5">

                  <FilterSection title="Type" isActive={isTabActive('type')} onClear={() => clearTab('type')}>
                    {renderTab({ key: 'type', label: 'Type' }, filterValues.type, setFilter)}
                  </FilterSection>

                  <FilterSection title="Shape" isActive={isTabActive('shape')} onClear={() => clearTab('shape')}>
                    {renderTab({ key: 'shape', label: 'Shape' }, filterValues.shape, setFilter)}
                  </FilterSection>

                  <FilterSection title="Carat" isActive={isTabActive('caratWeight')} onClear={() => clearTab('caratWeight')}>
                    {renderTab({ key: 'caratWeight', label: 'Carat' }, filterValues.caratWeight, setFilter, dynamicRanges)}
                  </FilterSection>

                  <div className="grid grid-cols-2 gap-x-5 border-b border-border/50 py-4">
                    <div>
                      <div className="mb-2.5 flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Colour</h3>
                        {isTabActive('colour') && (
                          <button type="button" onClick={() => clearTab('colour')} className="text-[11px] text-foreground/40 underline underline-offset-4 transition-colors hover:text-foreground">Clear</button>
                        )}
                      </div>
                      {renderTab({ key: 'colour', label: 'Colour' }, filterValues.colour, setFilter)}
                    </div>
                    <div>
                      <div className="mb-2.5 flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Clarity</h3>
                        {isTabActive('clarity') && (
                          <button type="button" onClick={() => clearTab('clarity')} className="text-[11px] text-foreground/40 underline underline-offset-4 transition-colors hover:text-foreground">Clear</button>
                        )}
                      </div>
                      {renderTab({ key: 'clarity', label: 'Clarity' }, filterValues.clarity, setFilter)}
                    </div>
                  </div>

                  <div className="border-b border-border/50 py-4">
                    <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Cut, Polish &amp; Symmetry</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {(['cut', 'polish', 'symmetry'] as const).map((key) => (
                        <div key={key}>
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[11px] font-medium capitalize text-foreground/60">{key}</span>
                            {isTabActive(key) && (
                              <button type="button" onClick={() => clearTab(key)} className="text-[10px] text-foreground/40 underline underline-offset-4 transition-colors hover:text-foreground">Clear</button>
                            )}
                          </div>
                          {renderTab({ key, label: key }, filterValues[key], setFilter)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <FilterSection title="Fluorescence" isActive={isTabActive('fluorescence')} onClear={() => clearTab('fluorescence')}>
                    {renderTab({ key: 'fluorescence', label: 'Fluorescence' }, filterValues.fluorescence, setFilter)}
                  </FilterSection>

                  <FilterSection title="Certificate" isActive={isTabActive('certificate')} onClear={() => clearTab('certificate')}>
                    {renderTab({ key: 'certificate', label: 'Certificate' }, filterValues.certificate, setFilter)}
                  </FilterSection>

                  <div className="grid grid-cols-2 gap-x-5 border-b border-border/50 py-4">
                    <div>
                      <div className="mb-2.5 flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Depth</h3>
                        {isTabActive('depth') && (
                          <button type="button" onClick={() => clearTab('depth')} className="text-[11px] text-foreground/40 underline underline-offset-4 transition-colors hover:text-foreground">Clear</button>
                        )}
                      </div>
                      {renderTab({ key: 'depth', label: 'Depth' }, filterValues.depth, setFilter)}
                    </div>
                    <div>
                      <div className="mb-2.5 flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Table</h3>
                        {isTabActive('table') && (
                          <button type="button" onClick={() => clearTab('table')} className="text-[11px] text-foreground/40 underline underline-offset-4 transition-colors hover:text-foreground">Clear</button>
                        )}
                      </div>
                      {renderTab({ key: 'table', label: 'Table' }, filterValues.table, setFilter)}
                    </div>
                  </div>

                  <FilterSection title="Price" isActive={isTabActive('totalValue')} onClear={() => clearTab('totalValue')} noBorder>
                    {renderTab({ key: 'totalValue', label: 'Price' }, filterValues.totalValue, setFilter, dynamicRanges, currencySymbol)}
                  </FilterSection>
                </div>

                <div className="flex shrink-0 items-center gap-3 border-t border-border/40 px-5 py-3">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 rounded border border-border py-2.5 px-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-foreground/70 transition-colors hover:bg-foreground/5"
                    >
                      Clear all
                    </button>
                  )}
                  <SheetClose asChild>
                    <button type="button" className="flex-1 rounded bg-accent py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-accent-foreground transition-colors hover:bg-accent/90">
                      View {total.toLocaleString()} {total === 1 ? 'Diamond' : 'Diamonds'}
                    </button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>

            {/* Search */}
            <label className="relative block min-w-[180px] flex-1 sm:max-w-[280px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search diamonds"
                className="h-10 w-full rounded border border-border bg-background pl-10 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-primary"
              />
              {searchInput && (
                <button type="button" onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/45 transition-colors hover:text-foreground" aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>

            {/* Sort */}
            <label className="flex items-center gap-2 text-sm text-foreground/55">
              <span className="whitespace-nowrap">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 w-[180px] rounded border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="name-asc">Name: A–Z</option>
              </select>
            </label>

            {/* Naturals / Lab Grown toggle */}
            <div className="flex items-center gap-2 text-sm">
              <span className={stockTypeTab === 'Natural' ? 'font-semibold text-foreground' : 'text-foreground/45'}>Naturals</span>
              <button
                type="button"
                role="switch"
                aria-checked={stockTypeTab === 'Lab'}
                onClick={() => setStockType(stockTypeTab === 'Lab' ? 'Natural' : 'Lab')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${stockTypeTab === 'Lab' ? 'bg-accent' : 'bg-foreground/20'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${stockTypeTab === 'Lab' ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className={stockTypeTab === 'Lab' ? 'font-semibold text-foreground' : 'text-foreground/45'}>Lab Grown</span>
            </div>

            {/* Results count */}
            <span className="ml-auto text-sm text-foreground/55">
              {total.toLocaleString()} {total === 1 ? 'result' : 'results'}
            </span>

            {/* Currency */}
            {currencies.length > 0 && (
              <select
                value={currencyCode}
                onChange={(e) => {
                  const sel = currencies.find((c) => c.currency_code === e.target.value);
                  if (sel) { setCurrencyCode(sel.currency_code); setCurrencySymbol(sel.currency_symbol); }
                }}
                className="h-10 rounded border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              >
                {currencies.filter((c) => c.currency_code === 'USD' || c.currency_code === 'GBP').map((c) => (
                  <option key={c.currency_code} value={c.currency_code}>{c.currency_code} {c.currency_symbol}</option>
                ))}
              </select>
            )}

            {hasActiveFilters && (
              <button type="button" onClick={handleReset} className="text-sm text-foreground/55 underline underline-offset-4 transition-colors hover:text-foreground">
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="border-b border-border/30 bg-white/70">
          <div className="henig-container py-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-foreground/40">Active:</span>
              {activeChips.map((chip) => (
                <button
                  key={`${chip.key}-${chip.removeValue ?? ''}`} type="button"
                  onClick={() => chip.removeValue !== undefined ? removeFilterValue(chip.key, chip.removeValue) : setFilter(chip.key, defaultFor(chip.key, dynamicRanges))}
                  className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 py-1 pl-3 pr-2 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
                >
                  {chip.label}
                  <X className="h-3 w-3 opacity-70" />
                </button>
              ))}
              {activeChips.length > 1 && (
                <button type="button" onClick={handleReset} className="text-[11px] text-foreground/40 underline underline-offset-4 transition-colors hover:text-foreground">
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main grid */}
      <section className="bg-white py-8 md:py-12">
        <div className="henig-container">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="animate-pulse border border-border/40 bg-card">
                  <div className="aspect-square bg-foreground/5" />
                  <div className="px-2.5 pb-3 pt-2 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-foreground/10" />
                    <div className="h-3 w-1/2 rounded bg-foreground/10" />
                    <div className="h-3 w-2/3 rounded bg-foreground/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg text-foreground/60">{fetchError}</p>
              <button onClick={() => window.location.reload()} className="mt-3 text-sm text-primary underline hover:text-primary/80">Reload page</button>
            </div>
          ) : total === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg text-foreground/60">No diamonds match your filters.</p>
              <button onClick={handleReset} className="mt-3 text-sm text-primary underline hover:text-primary/80">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
              {products.map((item) => (
                <DiamondCard key={item.id} item={item} onClick={openModal} />
              ))}
            </div>
          )}

          {!isLoading && <PaginationBar page={page} totalPages={totalPages} onPageChange={handlePageChange} />}
        </div>
      </section>

      <CommitmentSection />

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-colors hover:bg-accent/90"
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      <DiamondDetailModal item={selectedItem} open={modalOpen} onClose={() => setModalOpen(false)} />
      <CompareTray />
    </PageLayout>
    </CompareProvider>
  );
};

export default DiamondShopPage;
