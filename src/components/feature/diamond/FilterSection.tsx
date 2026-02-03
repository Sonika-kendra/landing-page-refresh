import FilterBar from '@/components/shared/FilterBar';

const FilterSection = () => {
  return (
    <section className="py-6 border-b border-border">
      <div className="henig-container">
        <FilterBar showDiamondFilters onSortChange={() => {}} />
      </div>
    </section>
  );
};

export default FilterSection;
