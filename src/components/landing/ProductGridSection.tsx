import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MotionLink = motion(Link);

const diamondsImages = Object.values(
  import.meta.glob('@/assets/landing/bestseller/diamonds/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
  })
).map((img) => ({ src: img as string, link: '/diamonds' }));

const jewelleryImages = Object.values(
  import.meta.glob('@/assets/landing/bestseller/jewellery/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
  })
).map((img) => ({ src: img as string, link: '/jewellery' }));

const images = [...diamondsImages, ...jewelleryImages];

const VISIBLE_ITEMS = 5;

const ProductCarouselSection = () => {
  const [index, setIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const next = () =>
    setIndex((prev) => (prev >= images.length - VISIBLE_ITEMS ? 0 : prev + 1));
  const prev = () =>
    setIndex((prev) => (prev <= 0 ? images.length - VISIBLE_ITEMS : prev - 1));

  useEffect(() => {
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, []);

  const itemWidth = carouselRef.current
    ? carouselRef.current.offsetWidth / VISIBLE_ITEMS
    : 0;

  return (
    <section className="py-10">
      <div className="henig-container">
        <h2 className="text-center mb-8 text-lg md:text-2xl">Our Bestsellers</h2>

        <div className="relative flex items-center gap-2">
          {/* Prev */}
          <button
            onClick={prev}
            className="h-8 w-8 md:h-10 md:w-10 rounded-full border flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          {/* Carousel */}
          <div ref={carouselRef} className="overflow-hidden w-full">
            <motion.div
              className="flex gap-2"
              animate={{ x: -(index * itemWidth) }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {images.map((img, i) => (
                <MotionLink
                  key={i}
                  to={img.link}
                  className="flex-shrink-0 group"
                  style={{ width: `calc(100% / ${VISIBLE_ITEMS})` }}
                >
                  <div className="relative aspect-square overflow-hidden rounded-sm">
                    {/* Image */}
                    <img
                      src={img.src}
                      alt={`Bestseller ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 flex items-end">
                      <div className="
                        w-full text-center py-3
                        bg-accent/80 text-white text-sm
                        translate-y-full group-hover:translate-y-0
                        transition-transform duration-300
                      ">
                        Shop Now
                      </div>
                    </div>

                  </div>
                </MotionLink>
              ))}
            </motion.div>
          </div>

          {/* Next */}
          <button
            onClick={next}
            className="h-8 w-8 md:h-10 md:w-10 rounded-full border flex items-center justify-center"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCarouselSection;
