import SectionHeader from '@/components/shared/SectionHeader';
import ProductCard from '@/components/shared/ProductCard';
import { sampleJewelleryProducts } from '@/config/products';
import jewelleryHero from '@/assets/jewellery-hero.jpg';
import tennisBracelet from '@/assets/tennis-bracelet.jpg';
import hoops from '@/assets/hoops.jpg';
import gemstoneNecklace from '@/assets/gemstone-necklace.jpg';
import eternityRing from '@/assets/eternity-ring.jpg';

const productImages: Record<string, string> = {
  'j1': tennisBracelet,
  'j2': hoops,
  'j3': gemstoneNecklace,
  'j4': eternityRing,
};

const NewArrivalsSection = ({ viewMode }: { viewMode: 'grid' | 'list' }) => {
  const products = sampleJewelleryProducts.map(p => ({
    ...p,
    image: productImages[p.id],
  }));

  return (
    <section className="py-16 md:py-24">
      <div className="henig-container">
        <SectionHeader caption="New Arrivals" title="New In: The Edit" showSeparator />

        <div className={`grid gap-6 ${viewMode === 'grid'
          ? 'grid-cols-2 md:grid-cols-4'
          : 'grid-cols-1 md:grid-cols-2'}`}>
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
