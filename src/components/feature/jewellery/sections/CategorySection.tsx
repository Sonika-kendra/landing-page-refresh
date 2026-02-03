import { Link } from 'react-router-dom';
import SectionHeader from '@/components/shared/SectionHeader';
import { jewelleryCategories } from '@/config/products';
import { motion } from 'framer-motion';
import jewelleryHero from '@/assets/jewellery-hero.jpg';
import tennisBracelet from '@/assets/tennis-bracelet.jpg';
import hoops from '@/assets/hoops.jpg';
import gemstoneNecklace from '@/assets/gemstone-necklace.jpg';
import eternityRing from '@/assets/eternity-ring.jpg';

const categoryImages: Record<string, string> = {
  earrings: hoops,
  'engagement-rings': eternityRing,
  bracelets: tennisBracelet,
  necklaces: gemstoneNecklace,
};

const CategorySection = () => (
  <section className="py-24">

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {jewelleryCategories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link to={`/jewellery/${category.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-4 bg-secondary">
              {categoryImages[category.id] ? (
                <img
                  src={categoryImages[category.id]}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl text-muted">✦</span>
                </div>
              )}
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/30 transition-colors duration-300" />
            </div>
            <h3 className="font-serif text-lg text-center text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </h3>
          </Link>
        </motion.div>
      ))}
    </div>

  </section>
);

export default CategorySection;