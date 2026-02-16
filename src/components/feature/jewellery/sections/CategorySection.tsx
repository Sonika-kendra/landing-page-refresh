import { Link } from 'react-router-dom';
import SectionHeader from '@/components/shared/SectionHeader';
import { motion } from 'framer-motion';
import { jewelleryCategories } from '@/config/jewellery/categoryProducts';
import { ChevronRight } from 'lucide-react';

const CategorySection = () => (
  <section className="py-5 section-white">
    <div className="flex justify-center">
      <SectionHeader
        caption=""
        title="Shop By Category"
        showSeparator
        className="!mb-2 md:!mb-4 text-center font-semibold tracking-wide"
      />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {jewelleryCategories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link to={category.link} className="group block text-left">
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-3 bg-secondary">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl text-muted">✦</span>
                </div>
              )}

              {/* Optional subtle overlay */}
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
              {/* Text on hover */}
            </div>
            <h3 className="flex items-center justify-start gap-1 font-serif text-lg text-foreground transition-colors group-hover:text-primary">
              <ChevronRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
              {category.name}
            </h3>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

export default CategorySection;
