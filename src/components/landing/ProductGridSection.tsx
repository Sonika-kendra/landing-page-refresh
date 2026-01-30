import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

// Load all bestseller images
const diamondsImages = Object.values(
  import.meta.glob('@/assets/landing/bestseller/diamonds/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
  })
).map((img) => ({ src: img as string, title: 'Diamonds', link: '/diamonds' }));

const jewelleryImages = Object.values(
  import.meta.glob('@/assets/landing/bestseller/jewellery/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
  })
).map((img) => ({ src: img as string, title: 'Jewellery', link: '/jewellery' }));

const images = [...diamondsImages, ...jewelleryImages];

const VISIBLE_ITEMS = 5;

const ProductCarouselSection = () => {
  const [index, setIndex] = useState(0);
  const maxIndex = images.length - VISIBLE_ITEMS;

  const next = () => setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const prev = () => setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));

  // Autoplay
  useEffect(() => {
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (link: string) => {
    window.location.href = link;
  };

  return (
    <section className="py-10">
      <div className="henig-container">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="henig-heading-section text-foreground mb-2 text-lg md:text-2xl">
            Our Bestsellers
          </h2>
          <div className="henig-separator mx-auto w-16 md:w-24" />
        </motion.div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center gap-2 md:gap-4">
          {/* Prev Arrow */}
          <button
            onClick={prev}
            className="h-8 w-8 md:h-10 md:w-10 rounded-full border bg-background hover:bg-secondary transition flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          {/* Carousel container */}
          <div className="overflow-hidden w-full max-w-[1200px]">
            <motion.div
              className="flex gap-2 md:gap-3"
              animate={{
                x: `-${(index * 100) / VISIBLE_ITEMS}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {images.map((img, i) => (
                <motion.div
                  key={i}
                  className={`flex-[0_0_calc(100%/${VISIBLE_ITEMS})] cursor-pointer relative group`}
                  onClick={() => handleClick(img.link)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Image container */}
                  <div className="aspect-square overflow-hidden rounded-sm flex items-center justify-center bg-secondary relative">
                    <img
                      src={img.src}
                      alt={`Bestseller ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-30 transition-opacity rounded-sm"></div>

                    {/* Text and button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      {/* Title always visible */}
                      {/* <h3 className="font-serif text-xl md:text-2xl text-white mb-2">
                        {img.title}
                      </h3> */}
                      {/* Shop Now button only on hover */}
                      <Button
                        size="sm"
                        className="border-white text-white bg-transparent relative overflow-hidden transition-all duration-300
                                  hover:bg-white hover:text-accent hover:border-white"
                      >
                        <span className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                          Shop Now
                        </span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Next Arrow */}
          <button
            onClick={next}
            className="h-8 w-8 md:h-10 md:w-10 rounded-full border bg-background hover:bg-secondary transition flex items-center justify-center"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCarouselSection;
