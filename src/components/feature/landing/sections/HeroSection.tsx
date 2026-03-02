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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col max-w-2xl"
        >
          {/* Button unchanged */}
          <Button
            asChild
            className="btn-henig-outline group w-56 md:w-64 px-6 py-4 md:py-5 text-base md:text-lg"
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
