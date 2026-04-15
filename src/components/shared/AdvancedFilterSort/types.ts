export type FilterType = 'select' | 'multi-select' | 'range' | 'search' | 'toggle-group';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  placeholder?: string;
  /** For range filters */
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

export interface SortConfig {
  options: SortOption[];
  defaultValue?: string;
}

export interface FilterValues {
  [key: string]: string | string[] | [number, number];
}

export interface AdvancedFilterSortProps {
  filters: FilterConfig[];
  sort?: SortConfig;
  values: FilterValues;
  sortValue?: string;
  onFilterChange: (key: string, value: string | string[] | [number, number]) => void;
  onSortChange?: (value: string) => void;
  onReset?: () => void;
  totalResults?: number;
  className?: string;
  /** Layout variant */
  variant?: 'horizontal' | 'sidebar';
}
