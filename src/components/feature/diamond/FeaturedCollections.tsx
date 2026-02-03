import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import labGrownDiamond from '@/assets/lab-grown-diamond.jpg';
import diamondPairs from '@/assets/diamond-pairs.jpg';
import { diamondCollections } from '@/config/jewellery/products';

const FeaturedCollections = () => {
  const featured = [
    { image: labGrownDiamond, title: 'Lab-Grown Diamonds', description: diamondCollections[0].description },
    { image: diamondPairs, title: 'Diamond Pairs', description: diamondCollections[1].description },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="henig-container">
        <div className="grid md:grid-cols-2 gap-8">
          {featured.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-sm"
            >
              <div className="aspect-[4/3] md:aspect-square">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-accent/80 to-transparent flex flex-col justify-end p-6 md:p-8">
                <h3 className="font-serif text-2xl md:text-3xl text-secondary mb-3">{item.title}</h3>
                <p className="text-secondary/80 text-sm mb-4 max-w-sm">{item.description}</p>
                <Button variant="outline" className="w-fit border-secondary text-secondary hover:bg-secondary hover:text-accent">
                  Explore <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
