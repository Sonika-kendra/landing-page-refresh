import { motion } from 'framer-motion';
import tennisBracelet from '@/assets/tennis-bracelet.jpg';
import hoops from '@/assets/hoops.jpg';
import gemstoneNecklace from '@/assets/gemstone-necklace.jpg';
import eternityRing from '@/assets/eternity-ring.jpg';

const products = [
  {
    id: 1,
    name: 'Tennis Bracelets',
    image: tennisBracelet,
    description: 'Timeless elegance for every occasion',
  },
  {
    id: 2,
    name: 'Hoops',
    image: hoops,
    description: 'Classic designs with modern brilliance',
  },
  {
    id: 3,
    name: 'Gemstone Necklaces',
    image: gemstoneNecklace,
    description: 'Vibrant colors meet exceptional craftsmanship',
  },
  {
    id: 4,
    name: 'Eternity Rings',
    image: eternityRing,
    description: 'Symbols of endless love and commitment',
  },
];

const ProductGridSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="henig-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="henig-heading-section text-foreground mb-4">
            Our Collections
          </h2>
          <div className="henig-separator mx-auto" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden rounded-sm mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/20 transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-lg md:text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-muted">
                {product.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGridSection;
