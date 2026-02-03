import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/shared/SectionHeader';
import ProductCard from '@/components/shared/ProductCard';
import { BestSellerProducts } from '@/config/jewellery/bestSellerProducts';
import { Button } from '@/components/ui/button'; // Import your Button component

const BestSellersSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);

  // Adjust visible items based on screen width
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 768) setVisibleItems(1); // mobile
      else if (window.innerWidth < 1024) setVisibleItems(3); // tablet
      else setVisibleItems(4); // desktop
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(BestSellerProducts.length - visibleItems, 0) : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev >= BestSellerProducts.length - visibleItems ? 0 : prev + 1
    );
  };

  return (
    <section className="py-5 bg-henig-cream">
      <div className="henig-container">
        <SectionHeader caption="Popular Choices" title="Bestsellers" showSeparator />

        <div className="flex items-center justify-between">
          {/* Left arrow */}
          <button
            onClick={prevSlide}
            className="bg-background/70 p-2 rounded-full hover:bg-background transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Carousel container */}
          <div className="relative overflow-hidden flex-1 mx-4">
            <motion.div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${(100 / visibleItems) * currentIndex}%)` }}
            >
              {BestSellerProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="p-2 flex-shrink-0"
                  style={{ width: `${100 / visibleItems}%` }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard
                    product={{ ...product, isBestseller: true }}
                    index={index}
                    showPrice={false}
                    showMaterial={false}
                    showWishlist={false}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right arrow */}
          <button
            onClick={nextSlide}
            className="bg-background/70 p-2 rounded-full hover:bg-background transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* View Our Bestsellers Button */}
        <div className="text-center mt-6">
          <Button className="btn-henig-outline px-6 py-2">
            View Our Bestsellers
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
