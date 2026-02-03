import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import diamondsHero from '@/assets/diamonds-hero.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] pt-32 md:pt-40 pb-16 overflow-hidden bg-accent">
      <div className="absolute inset-0">
        <img
          src={diamondsHero}
          alt="Diamonds collection"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-accent/90 to-accent/40" />
      </div>

      <div className="henig-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="henig-heading-display text-secondary mb-6">Diamonds</h1>
          <p className="henig-body-large text-secondary/80 mb-8">
            Explore our collection of independently certified and conflict-free diamonds. 
            From natural to lab-grown, find the perfect stone for your creation.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="#naturals">
              <Button className="btn-henig-gold">Natural Diamonds</Button>
            </Link>
            <Link to="#lab-grown">
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-accent">
                Lab-Grown Diamonds
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
