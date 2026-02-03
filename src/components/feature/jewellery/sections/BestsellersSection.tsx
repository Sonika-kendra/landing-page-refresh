import SectionHeader from '@/components/shared/SectionHeader';
import ProductCard from '@/components/shared/ProductCard';
import { sampleJewelleryProducts } from '@/config/products';
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

  const productsWithImages = sampleJewelleryProducts.map((p) => ({
    ...p,
    image: productImages[p.id] || '',
  }));

const BestsellersSection = () => (
  <section className="py-24 bg-henig-cream">
    <div className="henig-container">
      <SectionHeader
        caption="Popular Choices"
        title="Bestsellers"
        showSeparator
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {productsWithImages.map((p, i) => (
          <ProductCard
            key={p.id}
            product={{ ...p, isBestseller: true }}
            index={i}
          />
        ))}
      </div>
    </div>
  </section>
);

export default BestsellersSection;
