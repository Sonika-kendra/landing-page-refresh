import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { FilterConfig } from './types';

interface FilterSearchProps {
  config: FilterConfig;
  value: string;
  onChange: (value: string) => void;
}

const FilterSearch = ({ config, value, onChange }: FilterSearchProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {config.label}
    </label>
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={config.placeholder || `Search ${config.label.toLowerCase()}...`}
        className="h-9 pl-8 bg-card text-sm"
      />
    </div>
  </div>
);

export default FilterSearch;
