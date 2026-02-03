import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { sortOptions, diamondCategories } from '@/config/jewellery/products';

interface FilterBarProps {
  onSortChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  showDiamondFilters?: boolean;
  currentSort?: string;
  currentCategory?: string;
}

const FilterBar = ({
  onSortChange,
  onCategoryChange,
  showDiamondFilters = false,
  currentSort = 'new-arrivals',
  currentCategory = 'all',
}: FilterBarProps) => {
  const [activeSort, setActiveSort] = useState(currentSort);
  const [activeCategory, setActiveCategory] = useState(currentCategory);

  const handleSortChange = (value: string) => {
    setActiveSort(value);
    onSortChange?.(value);
  };

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    onCategoryChange?.(value);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-border">
      {/* Category filters */}
      {showDiamondFilters && (
        <div className="flex items-center gap-2">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleCategoryChange('all')}
            className="text-sm"
          >
            All
          </Button>
          {diamondCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleCategoryChange(cat.id)}
              className="text-sm"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      )}

      {/* Sort dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            Sort by: {sortOptions.find((o) => o.value === activeSort)?.label}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={activeSort === option.value ? 'bg-secondary' : ''}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterBar;
