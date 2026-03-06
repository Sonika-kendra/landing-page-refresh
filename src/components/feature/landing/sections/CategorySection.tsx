import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { categories } from '@/config/landing/category';
import { ArrowRight } from 'lucide-react';
import ImageWithSkeleton from '@/components/shared/ImageWithSkeleton';

// Motion-enhanced router link
const MotionLink = motion(Link);

const CategorySection = () => {
  return (
    <section className="py-4 md:py-6 section-ivory">
      <div className="henig-container">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <MotionLink
              key={category.title}
              to={category.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group henig-image-overlay block relative aspect-[3/2] md:aspect-[16/9] rounded-sm overflow-hidden"
            >
              {/* Image */}
              <ImageWithSkeleton
                src={category.image}
                alt={category.title}
                loading="lazy"
                decoding="async"
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Container for button + title */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                {/* Shop Now button: always visible */}
                <Button
                  size="sm"
                  variant="outline"
                  className="opacity-100 bg-primary/80 backdrop-blur-sm border-secondary text-black pointer-events-auto transition-colors duration-300 group-hover:bg-secondary group-hover:text-accent"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                {/* Title: visible only on hover */}
                <h3 className="mb-2 text-2xl md:text-4xl font-serif text-secondary bg-black/35 px-3 py-1 rounded-sm md:bg-transparent md:px-0 md:py-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 text-center">
                  {category.title}
                </h3>

              </div>
            </MotionLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
