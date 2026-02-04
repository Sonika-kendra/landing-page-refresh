import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';

const MotionLink = motion(Link);

export type CarouselItem = {
  image: string;
  link: string;
  title?: string;
  price?: string;
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

  const loopedItems = [
    ...items.slice(-visibleItems),
    ...items,
    ...items.slice(0, visibleItems),
  ];

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

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, []);

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
              key={`${i}-${item.link}`}
              to={item.link}
              target={linkTarget}
              className="flex-shrink-0 group"
              style={{ width: `calc(100% / ${visibleItems})` }}
            >
              <div className="space-y-2">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-sm">
                  <img
                    src={item.image}
                    alt={item.title ?? ''}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* 🔥 Hover Overlay */}
                  {ifHoverOverlayVisible && hoverOverlayContent && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      ${hoverOverlayBgClass}`}
                    >
                      {hoverOverlayContent}
                    </div>
                  )}

                  {/* Badge */}
                  {ifBadgeVisible && badge && (
                    <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs px-2 py-1 uppercase tracking-wider">
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
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </p>
                )}

                {/* Price */}
                {ifPriceVisible && item.price && (
                  <p className="text-sm text-gray-600">{item.price}</p>
                )}
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
