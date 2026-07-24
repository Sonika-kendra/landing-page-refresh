import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import diamondsCategory from '@/assets/diamonds/diamonds-category.jpg';
import labGrownDiamond from '@/assets/diamonds/lab-grown-diamond.jpg';
import gemstoneNecklace from '@/assets/gemstone-necklace.jpg';
import diamondPairs from '@/assets/diamond-pairs.jpg';
import { websiteUrlConfig } from '@/config/site';
import { useAuth } from '@/context/AuthContext';

const types = [
  { label: 'Naturals', image: diamondsCategory, href: `${websiteUrlConfig.Diamonds.All}?stock_type=Natural` },
  { label: 'Lab Grown', image: labGrownDiamond, href: `${websiteUrlConfig.Diamonds.All}?stock_type=Lab` },
  { label: 'Gemstones', image: gemstoneNecklace, href: websiteUrlConfig.Diamonds.All },
  { label: 'Matching Pairs', image: diamondPairs, href: websiteUrlConfig.Diamonds.All },
];

const CategoryTypesSection = () => {
  const { isAuthenticated, openModal } = useAuth();
  return (
  <section className="py-10 md:py-14 bg-white">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {types.map((type, index) => (
        <motion.div
          key={type.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link
            to={type.href}
            onClick={(e) => { if (!isAuthenticated) { e.preventDefault(); openModal('login', type.href); } }}
            className="group block relative aspect-[4/5] overflow-hidden"
          >
            <img
              src={type.image}
              alt={type.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 bg-accent text-secondary text-sm md:text-base font-medium px-4 py-2 w-40 md:w-44 whitespace-nowrap group-hover:bg-primary group-hover:text-white transition-all duration-300">
              {type.label}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
  );
};

export default CategoryTypesSection;
