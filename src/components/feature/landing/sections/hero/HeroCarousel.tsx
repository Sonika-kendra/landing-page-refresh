import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageWithSkeleton from '@/components/shared/ImageWithSkeleton';
// import lightweightHero from '@/assets/jewellery-hero.jpg';

const heroAssets = import.meta.glob('../../../../../assets/landing/hero/*', { eager: true });

type HeroAssetModule = { default?: string } | string;

const heavyAssets = Object.keys(heroAssets)
  .sort()
  .map((key) => heroAssets[key])
  .map((file) => {
    const module = file as HeroAssetModule;
    const src = typeof module === 'string' ? module : module.default ?? '';
    const extension = src.split('.').pop()?.toLowerCase();
    const type = ['mp4', 'webm', 'mov', 'ogg'].includes(extension!) ? 'video' : 'image';
    return { src, type };
  });

// const assets = [{ src: lightweightHero, type: 'image' as const }, ...heavyAssets];
const assets = heavyAssets;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
  }),
  center: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
  }),
};

const HeroCarousel = () => {
  const [[current, direction], setCurrent] = useState([0, 1]);

  const handlePrev = () => {
    if (assets.length <= 1) return;
    setCurrent(([prev]) => [(prev - 1 + assets.length) % assets.length, -1]);
  };

  const handleNext = () => {
    if (assets.length <= 1) return;
    setCurrent(([prev]) => [(prev + 1) % assets.length, 1]);
  };

  const currentAsset = assets[current];
  if (!currentAsset) return null;

  return (
    <div className="relative w-full overflow-hidden h-[300px] md:h-[400px] lg:h-[500px]">
      <AnimatePresence initial={false} custom={direction}>
        {currentAsset.type === 'image' ? (
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute w-full h-full object-cover"
          >
            <ImageWithSkeleton
              src={currentAsset.src}
              alt="Luxury jewelry"
              loading={current === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={current === 0 ? 'high' : 'auto'}
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <motion.video
            key={current}
            src={currentAsset.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute w-full h-full object-cover"
          />
        )}
      </AnimatePresence>

      <div className="absolute right-3 bottom-3 pointer-events-none">
        <div className="bg-secondary/90 p-4 md:p-5 rounded shadow-lg text-center backdrop-blur-sm">
          <p className="text-[10px] md:text-xs uppercase tracking-widest text-muted mb-1">Since</p>
          <p className="font-serif text-xl md:text-2xl text-foreground">1973</p>
        </div>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-secondary/80 hover:bg-secondary w-12 h-12 md:w-14 md:h-14 flex items-center justify-center shadow-md rounded-full z-20 backdrop-blur-sm transition-colors"
      >
        {'<'}
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-secondary/80 hover:bg-secondary w-12 h-12 md:w-14 md:h-14 flex items-center justify-center shadow-md rounded-full z-20 backdrop-blur-sm transition-colors"
      >
        {'>'}
      </button>
    </div>
  );
};

export default HeroCarousel;
