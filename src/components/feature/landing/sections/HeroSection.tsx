import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import HeroAnnouncement from './hero/HeroAnnouncement';
import HeroCarousel from './hero/HeroCarousel';
import { Link } from 'react-router-dom';

const HeroSection = ({ className = '' }) => {
  return (
    <section className="relative w-full section-white overflow-hidden">
      <HeroCarousel />

      {/* Hero content */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-8 md:pb-12 lg:pb-16 text-left z-10 space-y-4">
        <HeroAnnouncement show={true} />

        {/* Text container with overlay */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col space-y-4 max-w-2xl
                     bg-black/30
                     p-4 md:p-6 rounded-md"
        >
          <h1 className="henig-heading-display text-white font-semibold text-2xl md:text-3xl lg:text-4xl leading-tight drop-shadow-sm">
            Helping You Sell More
            <br />
            <span className="text-white">
              Bridal Jewellery
            </span>
          </h1>

          <p className="henig-body-large text-white/90 max-w-xl text-sm md:text-base">
            Using sample ring boxes enhances bridal jewellery sales by showcasing
            the elegance awaiting potential buyers on their special day.
          </p>

          {/* Button unchanged */}
          <Button
            asChild
            className="btn-henig-outline group w-48 md:w-56 px-4 py-3 md:py-4 text-sm md:text-base"
          >
            <Link to="/jewellery">
              Shop Collection
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
