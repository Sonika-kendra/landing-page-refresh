import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import diamondsImage from '@/assets/diamonds-category.jpg';
import jewelleryImage from '@/assets/jewellery-category.jpg';

// Motion-enhanced React Router Link
const MotionLink = motion(Link);

const categories = [
  {
    title: 'Diamonds',
    description:
      'Explore our collection of loose diamonds, certified and conflict-free.',
    image: diamondsImage,
    href: '/diamonds',
  },
  {
    title: 'Jewellery',
    description:
      'Discover handcrafted pieces from engagement rings to everyday elegance.',
    image: jewelleryImage,
    href: '/jewellery',
  },
];

const CategorySection = () => {
  return (
    <section className="bg-secondary py-4 md:py-6">
      <div className="henig-container">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {categories.map((category, index) => (
            <MotionLink
              key={category.title}
              to={category.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: 'easeOut',
              }}
              className="group henig-image-overlay relative block aspect-[3/2] overflow-hidden rounded-sm md:aspect-[16/9]"
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={category.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="overlay-text flex flex-col items-center text-center p-4 md:p-5">
                <h3 className="mb-2 font-serif text-2xl text-secondary md:text-3xl">
                  {category.title}
                </h3>

                <p className="mb-4 max-w-xs text-sm text-secondary/80">
                  {category.description}
                </p>

                <Button
                  size="sm"
                  variant="outline"
                  className="relative z-10 border-secondary text-secondary transition-colors hover:bg-secondary hover:text-accent"
                >
                  Shop Now
                </Button>
              </div>

              {/* Default Title (Hidden on Hover) */}
              <div className="absolute bottom-4 left-4 right-4 transition-opacity duration-500 group-hover:opacity-0">
                <h3 className="font-serif text-xl text-foreground md:text-2xl">
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
