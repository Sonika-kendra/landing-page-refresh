import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const FilterDropdown = ({ label, value, options, onChange }: FilterDropdownProps) => (
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium text-foreground whitespace-nowrap">{label}</span>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-accent text-accent-foreground text-sm font-medium pl-3 pr-8 py-1.5 rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-accent-foreground pointer-events-none" />
    </div>
  </div>
);

interface ShopFilterBarProps {
  filters: {
    category: string;
    subCategory: string;
    metal: string;
    shape: string;
    stockType: string;
    sortBy: string;
  };
  onFilterChange: (key: string, value: string) => void;
  categories: string[];
  subCategories: string[];
  metals: string[];
  shapes: string[];
  stockTypes: string[];
}

const ShopFilterBar = ({
  filters,
  onFilterChange,
  categories,
  subCategories,
  metals,
  shapes,
  stockTypes,
}: ShopFilterBarProps) => {
  return (
    <div className="bg-accent border-b border-accent/50">
      <div className="henig-container flex flex-wrap items-center gap-4 py-3 md:gap-6">
        <FilterDropdown label="Category" value={filters.category} options={categories} onChange={(v) => onFilterChange('category', v)} />
        <FilterDropdown label="Sub Category" value={filters.subCategory} options={subCategories} onChange={(v) => onFilterChange('subCategory', v)} />
        <FilterDropdown label="Metal" value={filters.metal} options={metals} onChange={(v) => onFilterChange('metal', v)} />
        <FilterDropdown label="Shape" value={filters.shape} options={shapes} onChange={(v) => onFilterChange('shape', v)} />
        <FilterDropdown label="Stock Type" value={filters.stockType} options={stockTypes} onChange={(v) => onFilterChange('stockType', v)} />
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-foreground whitespace-nowrap">Sort by</span>
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
              className="appearance-none bg-accent text-accent-foreground text-sm font-medium pl-3 pr-8 py-1.5 rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-accent-foreground pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopFilterBar;
