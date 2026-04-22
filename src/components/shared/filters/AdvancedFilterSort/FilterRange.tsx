import { Slider } from '@/components/ui/slider';
import type { FilterConfig } from './types';

interface FilterRangeProps {
  config: FilterConfig;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const FilterRange = ({ config, value, onChange }: FilterRangeProps) => {
  const min = config.min ?? 0;
  const max = config.max ?? 10000;
  const step = config.step ?? 1;
  const prefix = config.prefix ?? '';
  const suffix = config.suffix ?? '';

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {config.label}
      </label>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        className="w-full"
      />
      <div className="flex items-center justify-between text-xs text-foreground/70">
        <span>{prefix}{value[0].toLocaleString()}{suffix}</span>
        <span>{prefix}{value[1].toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
};

export default FilterRange;
