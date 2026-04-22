import { motion } from 'framer-motion';
import HeroAnnouncement from './hero/HeroAnnouncement';
import HeroCarousel from './hero/HeroCarousel';

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
          className="max-w-2xl"
        >
          {/* Text overlay only */}
          <div className="inline-block max-w-[220px] md:max-w-[300px] bg-black/30 px-4 py-3 md:px-6 md:py-4 rounded-lg">
            <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight break-words">
              Trusted by the trade since 1973
            </h1>

            <p className="text-white/80 mt-2 text-sm md:text-base">
              Fine diamonds and jewellery
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;