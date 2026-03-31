import { Link } from 'react-router-dom';
import SectionHeader from '@/components/shared/SectionHeader';
import { motion } from 'framer-motion';
import { jewelleryCategories } from '@/config/jewellery/categoryProducts';
import { ChevronRight, ArrowRight } from 'lucide-react';
import ImageWithSkeleton from '@/components/shared/ImageWithSkeleton';
import { Button } from '@/components/ui/button';

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
                <ImageWithSkeleton
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  decoding="async"
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl text-muted">✦</span>
                </div>
              )}

              {/* Permanent Dark Overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-300 z-10" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-start pt-24 md:pt-26 z-20">
                <h3 className="mb-2 text-2xl md:text-3xl font-serif text-white text-center">
                  {category.name}
                </h3>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="bg-primary/80 backdrop-blur-sm border-secondary text-black transition-colors duration-300 group-hover:bg-secondary group-hover:text-accent"
                >
                  <span>
                    Shop Now
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>
            {/* <h3 className="flex items-center justify-start gap-1 font-serif text-lg text-foreground transition-colors group-hover:text-primary">
              <ChevronRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
              {category.name}
            </h3> */}
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

export default CategorySection;
