import { Link } from 'react-router-dom';
import { Grid, List } from 'lucide-react';

interface Props {
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
}

const NavigationTabsSection = ({ viewMode, onViewChange }: Props) => (
  <section className="border-b top-[104px] bg-background z-30">
    <div className="henig-container py-4 flex justify-between">
      {/* <div className="flex gap-6">
        <Link to="/diamonds" className="text-sm text-muted hover:text-primary">
          Diamonds
        </Link>
        <span className="text-sm font-medium text-primary border-b-2 border-primary">
          Jewellery
        </span>
      </div> */}

      <div className="flex gap-2">
        <button
          onClick={() => onViewChange('grid')}
          className={viewMode === 'grid' ? 'bg-secondary p-2 rounded' : 'p-2'}
        >
          <Grid className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={viewMode === 'list' ? 'bg-secondary p-2 rounded' : 'p-2'}
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  </section>
);

export default NavigationTabsSection;
