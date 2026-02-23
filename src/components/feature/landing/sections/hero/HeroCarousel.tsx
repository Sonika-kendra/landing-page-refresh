import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const heroAssets = import.meta.glob('../../../../../assets/landing/hero/*', { eager: true });

const assets = Object.values(heroAssets).map((file: any) => {
  const src = file.default || file;
  const extension = src.split('.').pop()?.toLowerCase();
  const type = ['mp4', 'webm', 'mov', 'ogg'].includes(extension!) ? 'video' : 'image';
  return { src, type };
});

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

  // Auto-slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(([prev]) => [
        (prev + 1) % assets.length,
        1,
      ]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrent(([prev]) => [
      (prev - 1 + assets.length) % assets.length,
      -1,
    ]);
  };

  const handleNext = () => {
    setCurrent(([prev]) => [
      (prev + 1) % assets.length,
      1,
    ]);
  };

  const currentAsset = assets[current];

  return (
    <div className="relative w-full overflow-hidden h-[300px] md:h-[400px] lg:h-[500px]">
      <AnimatePresence initial={false} custom={direction}>
        {currentAsset.type === 'image' ? (
          <motion.img
            key={current}
            src={currentAsset.src}
            alt="Luxury jewelry"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute w-full h-full object-cover"
          />
        ) : (
          <motion.video
            key={current}
            src={currentAsset.src}
            autoPlay
            muted
            loop
            playsInline
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

      {/* Badge */}
      <div className="absolute right-4 bottom-4 pointer-events-none">
        <div className="bg-secondary/90 p-6 rounded shadow-lg text-center backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">Since</p>
          <p className="font-serif text-2xl md:text-3xl text-foreground">1973</p>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-secondary/80 hover:bg-secondary w-12 h-12 md:w-14 md:h-14 flex items-center justify-center shadow-md rounded-full z-20 backdrop-blur-sm transition-colors"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-secondary/80 hover:bg-secondary w-12 h-12 md:w-14 md:h-14 flex items-center justify-center shadow-md rounded-full z-20 backdrop-blur-sm transition-colors"
      >
        ›
      </button>
    </div>
  );
};

export default HeroCarousel;
