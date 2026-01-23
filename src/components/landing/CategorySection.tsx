import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import diamondsImage from '@/assets/diamonds-category.jpg';
import jewelleryImage from '@/assets/jewellery-category.jpg';

const CategorySection = () => {
  const categories = [
    {
      title: 'Diamonds',
      description: 'Explore our collection of loose diamonds, certified and conflict-free.',
      image: diamondsImage,
      href: '#diamonds',
    },
    {
      title: 'Jewellery',
      description: 'Discover handcrafted pieces from engagement rings to everyday elegance.',
      image: jewelleryImage,
      href: '#jewellery',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="henig-container">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <motion.a
              key={category.title}
              href={category.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group henig-image-overlay block relative aspect-[4/3] rounded-sm overflow-hidden"
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay content */}
              <div className="overlay-text flex-col text-center p-8">
                <h3 className="font-serif text-3xl md:text-4xl text-secondary mb-4">
                  {category.title}
                </h3>
                <p className="text-secondary/80 mb-6 max-w-xs">
                  {category.description}
                </p>
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-accent">
                  Shop Now
                </Button>
              </div>

              {/* Default title */}
              <div className="absolute bottom-6 left-6 right-6 transition-opacity duration-500 group-hover:opacity-0">
                <h3 className="font-serif text-2xl md:text-3xl text-foreground">
                  {category.title}
                </h3>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
