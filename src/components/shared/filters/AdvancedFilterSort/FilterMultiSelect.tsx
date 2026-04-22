import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { FilterConfig } from './types';

interface FilterMultiSelectProps {
  config: FilterConfig;
  value: string[];
  onChange: (value: string[]) => void;
}

const FilterMultiSelect = ({ config, value, onChange }: FilterMultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (val: string) => {
    onChange(value.includes(val) ? value.filter((v) => v !== val) : [...value, val]);
  };

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {config.label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'flex h-9 w-full min-w-[140px] items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          )}
        >
          <span className="truncate text-foreground">
            {value.length === 0
              ? config.placeholder || `All ${config.label}`
              : `${value.length} selected`}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full min-w-[180px] rounded-md border bg-popover p-1 shadow-md">
            <div className="max-h-48 overflow-y-auto">
              {config.options?.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent/10"
                >
                  <Checkbox
                    checked={value.includes(opt.value)}
                    onCheckedChange={() => toggle(opt.value)}
                  />
                  <span>{opt.label}</span>
                  {opt.count !== undefined && (
                    <span className="ml-auto text-xs text-muted-foreground">({opt.count})</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-foreground"
            >
              {config.options?.find((o) => o.value === v)?.label || v}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => toggle(v)}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterMultiSelect;
