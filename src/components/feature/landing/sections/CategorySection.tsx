import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { categories } from '@/config/landing/category';

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
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay content */}
              <div className="overlay-text flex-col text-center p-4 md:p-5">
                {/* <h3 className="font-serif text-2xl md:text-3xl text-secondary mb-2">
                  {category.title}
                </h3> */}
                <p className="text-secondary/80 mb-4 max-w-xs text-sm mx-auto">
                  {category.description}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-secondary text-secondary relative z-10 hover:bg-secondary hover:text-accent group-hover:text-accent"
                >
                  Shop Now
                </Button>
              </div>

              {/* Default title */}
              <div className="absolute bottom-4 left-4 right-4 transition-opacity duration-500 group-hover:opacity-0">
                <h3 className="font-serif text-xl md:text-2xl text-foreground">
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
