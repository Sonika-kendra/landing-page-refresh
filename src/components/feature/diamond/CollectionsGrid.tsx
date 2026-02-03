import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeader from '@/components/shared/SectionHeader';
import tennisBracelet from '@/assets/tennis-bracelet.jpg';
import hoops from '@/assets/hoops.jpg';
import gemstoneNecklace from '@/assets/gemstone-necklace.jpg';
import eternityRing from '@/assets/eternity-ring.jpg';

const collections = [
  { id: 'tennis', name: 'Tennis Bracelets', image: tennisBracelet, href: '/jewellery' },
  { id: 'hoops', name: 'Hoops', image: hoops, href: '/jewellery' },
  { id: 'gemstone', name: 'Gemstone Necklaces', image: gemstoneNecklace, href: '/jewellery' },
  { id: 'eternity', name: 'Eternity Rings', image: eternityRing, href: '/jewellery' },
];

const CollectionsGrid = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="henig-container">
        <SectionHeader title="Shop by Collection" showSeparator />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {collections.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={item.href} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-sm mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/20 transition-colors duration-300" />
                </div>
                <h3 className="font-serif text-lg text-center text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsGrid;
