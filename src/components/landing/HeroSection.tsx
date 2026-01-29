import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import HeroAnnouncement from './HeroAnnouncement';
import HeroCarousel from './HeroImage';
import { useEffect, useState } from 'react';

const HeroSection = ({ className = '' }) => {
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHeroLoaded(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className={`relative w-full h-full flex items-center ${className}`}>

      {/* Announcement inside hero */}
      <HeroAnnouncement show={heroLoaded} />

      <div className="henig-container flex items-center py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center w-full">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="order-2 lg:order-1 flex flex-col justify-center"
          >
            <h1 className="henig-heading-display text-foreground mb-6">
              Helping You Sell More
              <br />
              <span className="text-primary">Bridal Jewellery</span>
            </h1>
            <p className="henig-body-large text-muted mb-8 max-w-lg">
              Using sample ring boxes enhances bridal jewellery sales by showcasing 
              the elegance awaiting potential buyers on their special day.
            </p>
            <Button 
              className="btn-henig-outline group w-64 px-6 py-4 text-lg"
            >
              Shop Collection
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Hero Image Component */}
          <HeroCarousel />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-border rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 bg-primary rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
