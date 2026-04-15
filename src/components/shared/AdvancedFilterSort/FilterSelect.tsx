import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FilterConfig } from './types';

interface FilterSelectProps {
  config: FilterConfig;
  value: string;
  onChange: (value: string) => void;
}

const FilterSelect = ({ config, value, onChange }: FilterSelectProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {config.label}
    </label>
    <Select value={value || '__all__'} onValueChange={(v) => onChange(v === '__all__' ? '' : v)}>
      <SelectTrigger className="h-9 min-w-[140px] bg-card border-border text-sm">
        <SelectValue placeholder={config.placeholder || `All ${config.label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">All {config.label}</SelectItem>
        {config.options?.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
            {opt.count !== undefined && (
              <span className="ml-1 text-muted-foreground">({opt.count})</span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default FilterSelect;
