import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import everything in the hero folder (all images and videos)
const heroAssets = import.meta.glob('../../assets/hero/*', { eager: true });

const assets = Object.values(heroAssets).map((file: any) => {
  const src = file.default || file;
  // Determine type dynamically
  const extension = src.split('.').pop()?.toLowerCase();
  const type = ['mp4', 'webm', 'mov', 'ogg'].includes(extension!) ? 'video' : 'image';
  return { src, type };
});

// Placeholder image
const placeholder = '/assets/placeholder.jpg';

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % assets.length);
      setLoaded(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + assets.length) % assets.length);
    setLoaded(false);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % assets.length);
    setLoaded(false);
  };

  const currentAsset = assets[current];

  return (
    <div className="relative flex justify-center order-1 lg:order-2">
<div className="relative w-full max-w-md overflow-hidden rounded-sm shadow-elevated h-[200px] md:h-[300px] lg:h-[400px]">
  <AnimatePresence mode="wait">
    {currentAsset.type === 'image' && (
      <motion.img
        key={current}
        src={currentAsset.src}
        alt="Luxury jewelry"
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: loaded ? 1 : 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="w-full h-full object-cover bg-black mx-auto"
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
        className="w-full h-full object-cover bg-black mx-auto"
      />
    )}
  </AnimatePresence>
</div>


      {/* Static Badge */}
      <div className="absolute -bottom-4 -left-4 md:-left-8 bg-secondary p-4 md:p-6 rounded-sm shadow-subtle">
        <p className="text-xs uppercase tracking-widest text-muted mb-1">Since</p>
        <p className="font-serif text-2xl md:text-3xl text-foreground">1973</p>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/80 p-2 shadow-md"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/80 p-2 shadow-md"
      >
        ›
      </button>
    </div>
  );
};

export default HeroCarousel;
