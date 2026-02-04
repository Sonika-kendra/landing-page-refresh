import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const MotionLink = motion(Link);

type CarouselItem = {
  src: string;
  link: string;
};

interface CarouselProps {
  items: CarouselItem[];
  visibleItems?: number;
  autoplayDelay?: number;
  className?: string;
}

const Carousel = ({
  items,
  visibleItems = 5,
  autoplayDelay = 3000,
  className = '',
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringRef = useRef(false);

  const [index, setIndex] = useState(visibleItems);
  const [isAnimating, setIsAnimating] = useState(true);

  const loopedItems = [
    ...items.slice(-visibleItems),
    ...items,
    ...items.slice(0, visibleItems),
  ];

  const itemWidth = carouselRef.current
    ? carouselRef.current.offsetWidth / visibleItems
    : 0;

  const next = () => setIndex((prev) => prev + 1);
  const prev = () => setIndex((prev) => prev - 1);

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayRef.current = setInterval(next, autoplayDelay);
  };

  const navigate = (dir: 'next' | 'prev') => {
    stopAutoplay();
    dir === 'next' ? next() : prev();
    if (!isHoveringRef.current) startAutoplay();
  };

  // autoplay init
  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, []);

  // seamless loop reset
  useEffect(() => {
    if (index === items.length + visibleItems) {
      setTimeout(() => {
        setIsAnimating(false);
        setIndex(visibleItems);
      }, 500);
    }

    if (index === 0) {
      setTimeout(() => {
        setIsAnimating(false);
        setIndex(items.length);
      }, 500);
    }
  }, [index, items.length, visibleItems]);

  // re-enable animation
  useEffect(() => {
    if (!isAnimating) {
      requestAnimationFrame(() => setIsAnimating(true));
    }
  }, [isAnimating]);

  return (
    <div
      className={`relative flex items-center gap-2 ${className}`}
      onMouseEnter={() => {
        isHoveringRef.current = true;
        stopAutoplay();
      }}
      onMouseLeave={() => {
        isHoveringRef.current = false;
        startAutoplay();
      }}
    >
      {/* Prev */}
      <button
        onClick={() => navigate('prev')}
        className="h-8 w-8 md:h-10 md:w-10 rounded-full border flex items-center justify-center"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </button>

      {/* Track */}
      <div ref={carouselRef} className="overflow-hidden w-full">
        <motion.div
          className="flex gap-2"
          animate={{ x: -(index * itemWidth) }}
          transition={
            isAnimating
              ? { duration: 0.5, ease: 'easeInOut' }
              : { duration: 0 }
          }
        >
          {loopedItems.map((item, i) => (
            <MotionLink
              key={i}
              to={item.link}
              className="flex-shrink-0 group"
              style={{ width: `calc(100% / ${visibleItems})` }}
            >
              <div className="relative aspect-square overflow-hidden rounded-sm">
                <img
                  src={item.src}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 flex items-end">
                  <div
                    className="
                      w-full text-center py-3
                      bg-accent/80 text-white text-sm
                      translate-y-full group-hover:translate-y-0
                      transition-transform duration-300
                    "
                  >
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
        onClick={() => navigate('next')}
        className="h-8 w-8 md:h-10 md:w-10 rounded-full border flex items-center justify-center"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </button>
    </div>
  );
};

export default Carousel;
