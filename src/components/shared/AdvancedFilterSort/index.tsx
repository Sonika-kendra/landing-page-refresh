import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import FilterSelect from './FilterSelect';
import FilterMultiSelect from './FilterMultiSelect';
import FilterRange from './FilterRange';
import FilterSearch from './FilterSearch';
import FilterToggleGroup from './FilterToggleGroup';
import type { AdvancedFilterSortProps, FilterConfig, FilterValues } from './types';

export type { FilterConfig, FilterValues, SortConfig, SortOption, FilterOption, FilterType } from './types';

const getActiveFilterCount = (values: FilterValues, filters: FilterConfig[]): number => {
  return filters.reduce((count, f) => {
    const val = values[f.key];
    if (!val) return count;
    if (Array.isArray(val) && f.type === 'multi-select' && val.length === 0) return count;
    if (Array.isArray(val) && f.type === 'range') {
      const [lo, hi] = val as [number, number];
      if (lo === (f.min ?? 0) && hi === (f.max ?? 10000)) return count;
    }
    if (typeof val === 'string' && val === '') return count;
    return count + 1;
  }, 0);
};

const AdvancedFilterSort = ({
  filters,
  sort,
  values,
  sortValue,
  onFilterChange,
  onSortChange,
  onReset,
  totalResults,
  className,
  variant = 'horizontal',
}: AdvancedFilterSortProps) => {
  const [expanded, setExpanded] = useState(true);
  const activeCount = getActiveFilterCount(values, filters);

  const renderFilter = (config: FilterConfig) => {
    const val = values[config.key];
    switch (config.type) {
      case 'select':
        return (
          <FilterSelect
            key={config.key}
            config={config}
            value={(val as string) || ''}
            onChange={(v) => onFilterChange(config.key, v)}
          />
        );
      case 'multi-select':
        return (
          <FilterMultiSelect
            key={config.key}
            config={config}
            value={(val as string[]) || []}
            onChange={(v) => onFilterChange(config.key, v)}
          />
        );
      case 'range':
        return (
          <FilterRange
            key={config.key}
            config={config}
            value={(val as [number, number]) || [config.min ?? 0, config.max ?? 10000]}
            onChange={(v) => onFilterChange(config.key, v)}
          />
        );
      case 'search':
        return (
          <FilterSearch
            key={config.key}
            config={config}
            value={(val as string) || ''}
            onChange={(v) => onFilterChange(config.key, v)}
          />
        );
      case 'toggle-group':
        return (
          <FilterToggleGroup
            key={config.key}
            config={config}
            value={(val as string) || ''}
            onChange={(v) => onFilterChange(config.key, v)}
          />
        );
      default:
        return null;
    }
  };

  if (variant === 'sidebar') {
    return (
      <aside className={cn('flex flex-col gap-5 p-4 bg-card rounded-lg border border-border', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-foreground" />
            <span className="text-sm font-semibold text-foreground">Filters</span>
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                {activeCount}
              </span>
            )}
          </div>
          {onReset && activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset} className="text-xs h-7 gap-1 text-muted-foreground">
              <RotateCcw className="h-3 w-3" /> Reset
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-4">
          {filters.map(renderFilter)}
        </div>
        {sort && onSortChange && (
          <div className="pt-3 border-t border-border">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sort By</label>
              <Select value={sortValue || sort.defaultValue || ''} onValueChange={onSortChange}>
                <SelectTrigger className="h-9 bg-card border-border text-sm">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  {sort.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </aside>
    );
  }

  return (
    <div className={cn('bg-card border-b border-border', className)}>
      <div className="henig-container">
        {/* Top bar: toggle, result count, sort */}
        <div className="flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="gap-2 text-sm h-9"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeCount > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                  {activeCount}
                </span>
              )}
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} />
            </Button>

            {totalResults !== undefined && (
              <span className="text-sm text-foreground/60">
                {totalResults.toLocaleString()} {totalResults === 1 ? 'result' : 'results'}
              </span>
            )}

            {onReset && activeCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onReset} className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" /> Clear all
              </Button>
            )}
          </div>

          {sort && onSortChange && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground/60 whitespace-nowrap hidden sm:inline">Sort by</span>
              <Select value={sortValue || sort.defaultValue || ''} onValueChange={onSortChange}>
                <SelectTrigger className="h-9 w-[160px] bg-card border-border text-sm">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  {sort.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Expandable filter panel */}
        <div
          className={cn(
            'grid transition-all duration-300 ease-in-out',
            expanded ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filters.map(renderFilter)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilterSort;
