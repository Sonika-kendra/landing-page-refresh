import { cn } from '@/lib/utils';
import type { FilterConfig } from './types';

interface FilterToggleGroupProps {
  config: FilterConfig;
  value: string;
  onChange: (value: string) => void;
}

const FilterToggleGroup = ({ config, value, onChange }: FilterToggleGroupProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {config.label}
    </label>
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onChange('')}
        className={cn(
          'rounded-full px-3 py-1 text-xs font-medium transition-colors border',
          !value
            ? 'bg-accent text-accent-foreground border-accent'
            : 'bg-card text-foreground/70 border-border hover:border-accent/50'
        )}
      >
        All
      </button>
      {config.options?.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value === value ? '' : opt.value)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors border',
            value === opt.value
              ? 'bg-accent text-accent-foreground border-accent'
              : 'bg-card text-foreground/70 border-border hover:border-accent/50'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

export default FilterToggleGroup;
