import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const heroAssets = import.meta.glob('../../../../../assets/landing/hero/*', { eager: true });

const assets = Object.values(heroAssets).map((file: any) => {
  const src = file.default || file;
  const extension = src.split('.').pop()?.toLowerCase();
  const type = ['mp4', 'webm', 'mov', 'ogg'].includes(extension!) ? 'video' : 'image';
  return { src, type };
});

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % assets.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + assets.length) % assets.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % assets.length);
  };

  const currentAsset = assets[current];

  return (
    <div className="relative w-full overflow-hidden h-[300px] md:h-[400px] lg:h-[500px]">
      {/* Carousel Items */}
      <AnimatePresence mode="wait">
        {currentAsset.type === 'image' && (
          <motion.img
            key={current}
            src={currentAsset.src}
            alt="Luxury jewelry"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full h-full object-cover absolute top-0 left-0"
          />
        )}
        {currentAsset.type === 'video' && (
          <motion.video
            key={current}
            src={currentAsset.src}
            autoPlay
            muted
            loop
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full h-full object-cover absolute top-0 left-0"
          />
        )}
      </AnimatePresence>

      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent pointer-events-none" />

      {/* Badge at Bottom Right */}
      <div className="absolute right-4 bottom-4 pointer-events-none">
        <div className="bg-secondary/90 p-6 rounded shadow-lg text-center backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">Since</p>
          <p className="font-serif text-2xl md:text-3xl text-foreground">1973</p>
        </div>
      </div>

      {/* Navigation Buttons */}
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
