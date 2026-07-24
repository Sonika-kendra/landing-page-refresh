import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { ChevronUp, Search, SlidersHorizontal, X } from 'lucide-react';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { productsApi } from '@/api/products';
import PageLayout from '@/components/shared/layout/PageLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
  shape: string;
  colour: string;
  clarity: string;
  cut: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  caratWeight: [number, number];
  depth: [number, number];
  table: [number, number];
  totalValue: [number, number];
  certificate: string;
  type: string;
};

const defaultValues: FilterValues = {
  shape: '', colour: '', clarity: '', cut: '', polish: '', symmetry: '', fluorescence: '',
  caratWeight: DEFAULT_CARAT_RANGE,
  depth: DEFAULT_DEPTH_RANGE, table: DEFAULT_TABLE_RANGE, totalValue: DEFAULT_TOTAL_VALUE_RANGE,
  certificate: '', type: DEFAULT_STOCK_TYPE,
};

type TabKey = keyof FilterValues;

// Range-typed tabs need their default and isSameRange comparison instead of plain truthiness
const RANGE_DEFAULTS: Partial<Record<TabKey, [number, number]>> = {
  caratWeight: DEFAULT_CARAT_RANGE,
  depth: DEFAULT_DEPTH_RANGE, table: DEFAULT_TABLE_RANGE, totalValue: DEFAULT_TOTAL_VALUE_RANGE,
};
// Non-range tabs whose "no filter applied" state isn't an empty string
const NON_EMPTY_DEFAULTS: Partial<Record<TabKey, string>> = { type: DEFAULT_STOCK_TYPE };

const defaultFor = (key: TabKey): unknown => RANGE_DEFAULTS[key] ?? NON_EMPTY_DEFAULTS[key] ?? '';

const isDefaultValue = (key: TabKey, value: unknown): boolean => {
  const def = RANGE_DEFAULTS[key];
  if (def) return isSameRange(value as [number, number], def);
  return value === defaultFor(key);
};

const filterTabs: { key: TabKey; label: string }[] = [
  { key: 'type',        label: 'Type' },
  { key: 'shape',       label: 'Shape' },
  { key: 'colour',      label: 'Colour' },
  { key: 'clarity',     label: 'Clarity' },
  { key: 'cut',         label: 'Cut' },
  { key: 'polish',      label: 'Polish' },
  { key: 'symmetry',    label: 'Symmetry' },
  { key: 'fluorescence',label: 'Fluorescence' },
  { key: 'caratWeight', label: 'Carat Weight' },
  { key: 'depth',       label: 'Depth' },
  { key: 'table',       label: 'Table' },
  { key: 'totalValue',  label: 'Price' },
  { key: 'certificate', label: 'Certificate' },
];

const staticOptions: Record<string, string[]> = {
  shape: SHAPES, colour: COLOURS, clarity: CLARITIES,
  cut: CUTS, polish: POLISHES, symmetry: SYMMETRIES,
  fluorescence: FLUORESCENCES, certificate: CERTIFICATES, type: STOCK_TYPES,
};

// Carat range slider (same pattern as shop)
const CaratRangeSlider = ({
  currentValue, onChange,
}: {
  currentValue: [number, number];
  onChange: (v: [number, number]) => void;
}) => {
  const [local, setLocal] = useState<[number, number]>(currentValue);
  useEffect(() => { setLocal(currentValue); }, [currentValue[0], currentValue[1]]);

  const handleCommit = (v: [number, number]) => {
    const lo = Math.max(0, Math.min(v[0], v[1]));
    const hi = Math.min(10, Math.max(v[0], v[1]));
    onChange(lo === 0 && hi >= 10 ? DEFAULT_CARAT_RANGE : [lo, hi]);
  };

  return (
    <div className="px-1 pb-3 pt-4">
      <Slider
        min={0} max={10} step={0.01}
        value={[Math.min(local[0], 10), Math.min(local[1], 10)]}
        onValueChange={(v) => setLocal([v[0], v[1]] as [number, number])}
        onValueCommit={(v) => handleCommit(v as [number, number])}
      />
      <div className="mt-4 flex items-center justify-between gap-2">
        <label className="flex items-center gap-1 rounded bg-secondary/60 px-2 py-0.5">
          <input
            type="number"
            inputMode="decimal"
            step={0.01}
            min={0}
            max={10}
            value={local[0]}
            onChange={(e) => setLocal([Number(e.target.value) || 0, local[1]])}
            onBlur={() => handleCommit(local)}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="w-10 bg-transparent text-xs font-medium text-foreground/70 outline-none"
          />
          <span className="text-xs font-medium text-foreground/70">ct</span>
        </label>
        <span className="text-[10px] text-foreground/35">–</span>
        <label className="flex items-center gap-1 rounded bg-secondary/60 px-2 py-0.5">
          <input
            type="number"
            inputMode="decimal"
            step={0.01}
            min={0}
            max={10}
            value={local[1]}
            onChange={(e) => setLocal([local[0], Number(e.target.value) || 0])}
            onBlur={() => handleCommit(local)}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="w-10 bg-transparent text-xs font-medium text-foreground/70 outline-none"
          />
          <span className="text-xs font-medium text-foreground/70">ct</span>
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
    <div className="px-1 pb-3 pt-4">
      <Slider
        min={min} max={max} step={step}
        value={local}
        onValueChange={(v) => setLocal([v[0], v[1]] as [number, number])}
        onValueCommit={(v) => onChange([v[0], v[1]] as [number, number])}
      />
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="rounded bg-secondary/60 px-2 py-0.5 text-xs font-medium text-foreground/70">
          {local[0].toFixed(1)}{unit}
        </span>
        <span className="text-[10px] text-foreground/35">–</span>
        <span className="rounded bg-secondary/60 px-2 py-0.5 text-xs font-medium text-foreground/70">
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
    <div className="px-1 pb-3 pt-4">
      <Slider
        min={min}
        max={max}
        step={10}
        value={local}
        onValueChange={(v) => setLocal(v as [number, number])}
        onValueCommit={(v) => handleCommit(v as [number, number])}
      />
      <div className="mt-4 flex items-center justify-between gap-2">
        <label className="flex items-center gap-1 rounded bg-secondary/60 px-2 py-0.5">
          <span className="text-xs font-medium text-foreground/70">{currencySymbol}</span>
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
            className="w-16 bg-transparent text-xs font-medium text-foreground/70 outline-none"
          />
        </label>
        <span className="text-[10px] text-foreground/35">–</span>
        <label className="flex items-center gap-1 rounded bg-secondary/60 px-2 py-0.5">
          <span className="text-xs font-medium text-foreground/70">{currencySymbol}</span>
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
            className="w-16 bg-transparent text-xs font-medium text-foreground/70 outline-none"
          />
        </label>
      </div>
    </div>
  );
};

const renderTab = (tab: { key: TabKey; label: string }, value: FilterValues[TabKey], onChange: (k: TabKey, v: unknown) => void, currencySymbol = '£') => {
  if (tab.key === 'caratWeight') {
    return (
      <CaratRangeSlider
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
        min={DEFAULT_TOTAL_VALUE_RANGE[0]} max={DEFAULT_TOTAL_VALUE_RANGE[1]}
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
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${isActive ? 'border-accent bg-accent text-accent-foreground shadow-sm' : 'border-border/50 text-foreground/65 hover:border-accent/60 hover:text-foreground'}`}
            >
              {opt === 'Lab' ? 'Lab Grown' : opt}
            </button>
          );
        })}
      </div>
    );
  }

  // Pill buttons for shape, colour, clarity, cut, polish, symmetry, fluorescence, certificate
  const options = staticOptions[tab.key] ?? [];
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const isActive = value === opt;
        return (
          <button
            key={opt} type="button"
            onClick={() => onChange(tab.key, isActive ? '' : opt)}
            aria-pressed={isActive}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${isActive ? 'border-accent bg-accent text-accent-foreground shadow-sm' : 'border-border/50 text-foreground/65 hover:border-accent/60 hover:text-foreground'}`}
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
  const [openAccordion, setOpenAccordion] = useState<string[]>(filterTabs.map((tab) => tab.key));
  const [sortBy, setSortBy] = useState('price-asc');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<DiamondItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Browsers restore the previous scroll offset on a manual reload (F5) for the same
  // history entry, which looks like "landing on row 2" when a filter was scrolled to earlier.
  // Take manual control so a fresh mount always starts at the top.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  // stock type tab derived from URL, defaults to 'Natural'
  const stockTypeTab = (searchParams.get('stock_type') ?? 'Natural') as 'Natural' | 'Lab';

  // All other filters from URL
  const filterValues = useMemo<FilterValues>(() => {
    const caratMin = searchParams.get('carat_min');
    const caratMax = searchParams.get('carat_max');
    const depthMin = searchParams.get('depth_min');
    const depthMax = searchParams.get('depth_max');
    const tableMin = searchParams.get('table_min');
    const tableMax = searchParams.get('table_max');
    const totalMin = searchParams.get('total_min');
    const totalMax = searchParams.get('total_max');
    return {
      shape:       searchParams.get('shape')       ?? '',
      colour:      searchParams.get('colour')      ?? '',
      clarity:     searchParams.get('clarity')     ?? '',
      cut:         searchParams.get('cut')         ?? '',
      polish:      searchParams.get('polish')      ?? '',
      symmetry:    searchParams.get('symmetry')    ?? '',
      fluorescence:searchParams.get('fluorescence')?? '',
      certificate: searchParams.get('certificate') ?? '',
      type:        searchParams.get('stock_type') === 'Lab' ? 'Lab' : DEFAULT_STOCK_TYPE,
      caratWeight: (caratMin || caratMax)
        ? [Number(caratMin) || DEFAULT_CARAT_RANGE[0], Number(caratMax) || DEFAULT_CARAT_RANGE[1]] as [number, number]
        : DEFAULT_CARAT_RANGE,
      depth: (depthMin || depthMax)
        ? [Number(depthMin) || DEFAULT_DEPTH_RANGE[0], Number(depthMax) || DEFAULT_DEPTH_RANGE[1]] as [number, number]
        : DEFAULT_DEPTH_RANGE,
      table: (tableMin || tableMax)
        ? [Number(tableMin) || DEFAULT_TABLE_RANGE[0], Number(tableMax) || DEFAULT_TABLE_RANGE[1]] as [number, number]
        : DEFAULT_TABLE_RANGE,
      totalValue: (totalMin || totalMax)
        ? [Number(totalMin) || DEFAULT_TOTAL_VALUE_RANGE[0], Number(totalMax) || DEFAULT_TOTAL_VALUE_RANGE[1]] as [number, number]
        : DEFAULT_TOTAL_VALUE_RANGE,
    };
  }, [searchParams]);

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

    if (filterValues.shape)        params.shape        = filterValues.shape;
    if (filterValues.colour)       params.colour       = filterValues.colour;
    if (filterValues.clarity)      params.clarity      = filterValues.clarity;
    if (filterValues.cut)          params.cut          = filterValues.cut;
    if (filterValues.polish)       params.polish       = filterValues.polish;
    if (filterValues.symmetry)     params.symmetry     = filterValues.symmetry;
    if (filterValues.fluorescence) params.fluorescence = filterValues.fluorescence;
    if (filterValues.certificate)  params.certificate  = filterValues.certificate;
    if (debouncedSearch)           params.search       = debouncedSearch;

    if (!isSameRange(filterValues.caratWeight, DEFAULT_CARAT_RANGE)) {
      const [lo, hi] = filterValues.caratWeight;
      if (lo > DEFAULT_CARAT_RANGE[0]) params.carat_min = lo;
      if (hi < DEFAULT_CARAT_RANGE[1]) params.carat_max = hi;
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
    if (!isSameRange(filterValues.totalValue, DEFAULT_TOTAL_VALUE_RANGE)) {
      const [lo, hi] = filterValues.totalValue;
      if (lo > DEFAULT_TOTAL_VALUE_RANGE[0]) params.total_min = lo;
      if (hi < DEFAULT_TOTAL_VALUE_RANGE[1]) params.total_max = hi;
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
      filterValues.caratWeight,
      filterValues.depth, filterValues.table, filterValues.totalValue]);

  const setFilter = useCallback((key: TabKey, value: unknown) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('stock_type', stockTypeTab);

    const write = (k: string, v: unknown) => {
      if (v == null || v === '') { newParams.delete(k); return; }
      newParams.set(k, String(v));
    };

    const writeRange = (lo: number, hi: number, def: [number, number], minKey: string, maxKey: string) => {
      lo > def[0] ? newParams.set(minKey, String(lo)) : newParams.delete(minKey);
      hi < def[1] ? newParams.set(maxKey, String(hi)) : newParams.delete(maxKey);
    };

    if (key === 'caratWeight') {
      const [lo, hi] = value as [number, number];
      writeRange(lo, hi, DEFAULT_CARAT_RANGE, 'carat_min', 'carat_max');
    } else if (key === 'depth') {
      const [lo, hi] = value as [number, number];
      writeRange(lo, hi, DEFAULT_DEPTH_RANGE, 'depth_min', 'depth_max');
    } else if (key === 'table') {
      const [lo, hi] = value as [number, number];
      writeRange(lo, hi, DEFAULT_TABLE_RANGE, 'table_min', 'table_max');
    } else if (key === 'totalValue') {
      const [lo, hi] = value as [number, number];
      writeRange(lo, hi, DEFAULT_TOTAL_VALUE_RANGE, 'total_min', 'total_max');
    } else if (key === 'type') {
      newParams.set('stock_type', value as string);
    } else {
      write(key, value);
    }

    setPage(1);
    setSearchParams(newParams, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, stockTypeTab, setSearchParams]);

  const setStockType = (type: 'Natural' | 'Lab') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('stock_type', type);
    setPage(1);
    setSearchParams(newParams, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      filterValues.shape || filterValues.colour || filterValues.clarity ||
      filterValues.cut || filterValues.polish || filterValues.symmetry ||
      filterValues.fluorescence || filterValues.certificate ||
      !isSameRange(filterValues.caratWeight, DEFAULT_CARAT_RANGE) ||
      !isSameRange(filterValues.depth, DEFAULT_DEPTH_RANGE) ||
      !isSameRange(filterValues.table, DEFAULT_TABLE_RANGE) ||
      !isSameRange(filterValues.totalValue, DEFAULT_TOTAL_VALUE_RANGE)
    );
  }, [filterValues, debouncedSearch]);

  const activeChips = useMemo(() => {
    const chips: { key: TabKey; label: string }[] = [];
    if (filterValues.shape)        chips.push({ key: 'shape',        label: filterValues.shape });
    if (filterValues.colour)       chips.push({ key: 'colour',       label: `Colour: ${filterValues.colour}` });
    if (filterValues.clarity)      chips.push({ key: 'clarity',      label: `Clarity: ${filterValues.clarity}` });
    if (filterValues.cut)          chips.push({ key: 'cut',          label: `Cut: ${filterValues.cut}` });
    if (filterValues.polish)       chips.push({ key: 'polish',       label: `Polish: ${filterValues.polish}` });
    if (filterValues.symmetry)     chips.push({ key: 'symmetry',     label: `Symmetry: ${filterValues.symmetry}` });
    if (filterValues.fluorescence) chips.push({ key: 'fluorescence', label: filterValues.fluorescence });
    if (filterValues.certificate)  chips.push({ key: 'certificate',  label: filterValues.certificate });
    if (!isSameRange(filterValues.caratWeight, DEFAULT_CARAT_RANGE)) {
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
    if (!isSameRange(filterValues.totalValue, DEFAULT_TOTAL_VALUE_RANGE)) {
      const [lo, hi] = filterValues.totalValue;
      chips.push({ key: 'totalValue', label: `Price: ${currencySymbol}${lo.toLocaleString()}–${currencySymbol}${hi.toLocaleString()}` });
    }
    return chips;
  }, [filterValues, currencySymbol]);

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
              <SheetContent hideCloseButton side="left" className="flex w-[480px] max-w-none flex-col p-0 sm:w-[560px] sm:max-w-none">
                <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-6 py-5">
                  <SheetHeader className="text-left">
                    <SheetTitle className="text-base font-semibold uppercase tracking-[0.2em]">Filters</SheetTitle>
                  </SheetHeader>
                  <SheetClose className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground/20 bg-foreground/10 text-foreground transition-colors hover:bg-foreground/20">
                    <X className="h-4 w-4" />
                  </SheetClose>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  {hasActiveFilters && (
                    <div className="mb-2 flex justify-end">
                      <button type="button" onClick={handleReset} className="text-xs text-foreground/45 underline underline-offset-4 transition-colors hover:text-foreground">
                        Clear all
                      </button>
                    </div>
                  )}

                  <Accordion type="multiple" value={openAccordion} onValueChange={setOpenAccordion} className="space-y-1">
                    {filterTabs.map((tab) => {
                      const val = filterValues[tab.key];
                      const isActive = Boolean(val) && !isDefaultValue(tab.key, val);

                      return (
                        <AccordionItem key={tab.key} value={tab.key} className="rounded-2xl border border-border/60 bg-background px-3.5">
                          <AccordionTrigger className="py-2 hover:no-underline [&>svg]:hidden">
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground">{tab.label}</span>
                                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                              </div>
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10 text-[11px] font-light text-foreground">
                                {openAccordion.includes(tab.key) ? '−' : '+'}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-2 pt-0">
                            {isActive && (
                              <div className="mb-1.5 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => setFilter(tab.key, defaultFor(tab.key))}
                                  className="text-[11px] text-foreground/40 underline underline-offset-4 transition-colors hover:text-foreground"
                                >
                                  Clear
                                </button>
                              </div>
                            )}
                            {renderTab(tab, filterValues[tab.key], setFilter, currencySymbol)}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>

                <div className="shrink-0 border-t border-border/40 px-6 py-4">
                  <SheetClose asChild>
                    <button type="button" className="w-full rounded bg-accent py-3 text-sm font-semibold uppercase tracking-[0.12em] text-accent-foreground transition-colors hover:bg-accent/90">
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
                  key={chip.key} type="button"
                  onClick={() => setFilter(chip.key, defaultFor(chip.key))}
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
