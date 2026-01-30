import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

// Load all bestseller images
const images = Object.values(
  import.meta.glob('@/assets/landing/bestseller/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
  })
) as string[];

const ProductCarouselSection = () => {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Autoplay
  useEffect(() => {
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 border">
      <div className="henig-container">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="henig-heading-section text-foreground mb-4">
            Our Bestsellers
          </h2>
          <div className="henig-separator mx-auto" />
        </motion.div>

        {/* Carousel Frame */}
        <div className="relative mx-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border bg-background hover:bg-accent transition flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border bg-background hover:bg-accent transition flex items-center justify-center"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Image Window */}
          <div className="relative aspect-square overflow-hidden rounded-sm">
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={images[index]}
                alt={`Bestseller ${index + 1}`}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarouselSection;
