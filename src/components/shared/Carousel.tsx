import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ImageWithSkeleton from '@/components/shared/ImageWithSkeleton';

const MotionLink = motion(Link);

export type CarouselItem = {
  image: string;
  link: string;
  title?: string;
  price?: string;
  hoverOverlayContent?: ReactNode;
};

interface CarouselProps {
  items: CarouselItem[];
  visibleItems?: number;
  autoplayDelay?: number;
  className?: string;

  ifTitleVisible?: boolean;
  ifPriceVisible?: boolean;
  ifWhishlistVisible?: boolean;

  ifBadgeVisible?: boolean;
  badge?: string;

  ifPurchaseButtonVisible?: boolean;
  purchaseButton?: string;

  ifHoverOverlayVisible?: boolean;
  hoverOverlayContent?: ReactNode;
  hoverOverlayBgClass?: string;

  linkTarget?: '_self' | '_blank' | '_parent' | '_top';
}

const Carousel = ({
  items,
  visibleItems = 5,
  autoplayDelay = 3000,
  className = '',

  ifTitleVisible = true,
  ifPriceVisible = true,
  ifWhishlistVisible = true,

  ifBadgeVisible = true,
  badge = '',

  ifPurchaseButtonVisible = true,
  purchaseButton = 'Shop Now',

  ifHoverOverlayVisible = false,
  hoverOverlayContent = null,
  hoverOverlayBgClass = 'bg-accent/30',

  linkTarget = '_self',
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringRef = useRef(false);

  const [index, setIndex] = useState(visibleItems);
  const [isAnimating, setIsAnimating] = useState(true);
  const [itemWidth, setItemWidth] = useState(0);

  const transitionDuration = 0.5;

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setItemWidth(carouselRef.current.offsetWidth / visibleItems);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [visibleItems]);

  useEffect(() => {
    setIsAnimating(false);
    setIndex(visibleItems);
  }, [visibleItems]);

  const loopedItems = [
    ...items.slice(-visibleItems),
    ...items,
    ...items.slice(0, visibleItems),
  ];

  const next = useCallback(() => {
    setIndex((prev) => prev + 1);
  }, []);

  const prev = useCallback(() => {
    setIndex((prev) => prev - 1);
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayRef.current = setInterval(next, autoplayDelay);
  }, [autoplayDelay, next, stopAutoplay]);

  const navigate = useCallback((dir: 'next' | 'prev') => {
    stopAutoplay();
    if (dir === 'next') {
      next();
    } else {
      prev();
    }
    if (!isHoveringRef.current) startAutoplay();
  }, [next, prev, startAutoplay, stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (index === items.length + visibleItems) {
      setTimeout(() => {
        setIsAnimating(false);
        setIndex(visibleItems);
      }, transitionDuration * 1000);
    }

    if (index === 0) {
      setTimeout(() => {
        setIsAnimating(false);
        setIndex(items.length);
      }, transitionDuration * 1000);
    }
  }, [index, items.length, visibleItems]);

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
        type="button"
        aria-label="Previous slide"
        onClick={() => navigate('prev')}
        className="h-10 w-10 md:h-11 md:w-11 rounded-full border bg-background/90 hover:bg-background flex items-center justify-center shrink-0 relative z-10"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </button>

      {/* Track */}
      <div ref={carouselRef} className="overflow-hidden w-full">
        <motion.div
          className="flex"
          animate={{ x: -(index * itemWidth) }}
          transition={
            isAnimating
              ? { duration: 0.5, ease: 'easeInOut' }
              : { duration: 0 }
          }
        >
          {loopedItems.map((item, i) => {
            const overlayContent = item.hoverOverlayContent ?? hoverOverlayContent;

            return (
            <MotionLink
              key={`${i}-${item.link}`}
              to={item.link}
              target={linkTarget}
              className="flex-shrink-0 group px-1"
              style={{ width: `calc(100% / ${visibleItems})` }}
            >
              <div className="space-y-2">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-sm">
                  <ImageWithSkeleton
                    src={item.image}
                    alt={item.title ?? ''}
                    loading="lazy"
                    decoding="async"
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Hover Overlay */}
                  {ifHoverOverlayVisible && overlayContent && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      ${hoverOverlayBgClass}`}
                    >
                      {overlayContent}
                    </div>
                  )}

                  {/* Badge */}
                  {ifBadgeVisible && badge && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-accent text-accent-foreground text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 uppercase tracking-wide">
                      {badge}
                    </span>
                  )}

                  {/* Wishlist */}
                  {ifWhishlistVisible && (
                    <button className="absolute top-3 right-3 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background">
                      <Heart className="w-4 h-4 text-foreground" />
                    </button>
                  )}

                  {/* Purchase CTA */}
                  {ifPurchaseButtonVisible && purchaseButton && (
                    <div className="absolute inset-0 flex items-end pointer-events-none">
                      <div className="w-full text-center py-3 bg-accent/80 text-white text-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        {purchaseButton}
                      </div>
                    </div>
                  )}
                </div>

                {/* Title */}
                {ifTitleVisible && item.title && (
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </p>
                )}

                {/* Price */}
                {ifPriceVisible && item.price && (
                  <p className="text-xs sm:text-sm text-gray-600">{item.price}</p>
                )}
              </div>
            </MotionLink>
            );
          })}
        </motion.div>
      </div>

      {/* Next */}
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => navigate('next')}
        className="h-10 w-10 md:h-11 md:w-11 rounded-full border bg-background/90 hover:bg-background flex items-center justify-center shrink-0 relative z-10"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </button>
    </div>
  );
};

export default Carousel;
