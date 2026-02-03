import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { newArrivalsJewelleryProducts } from '@/config/jewellery/newArrivalsJewelleryProducts';
import SectionHeader from '@/components/shared/SectionHeader';
import ProductCard from '@/components/shared/ProductCard';

const NewArrivalsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);

  // Update visible items based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleItems(1); // mobile
      else if (window.innerWidth < 1024) setVisibleItems(2); // tablet
      else setVisibleItems(4); // desktop
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalItems = newArrivalsJewelleryProducts.length;

  const prevSlide = () => {
    setCurrentIndex(prev =>
      prev === 0 ? Math.max(totalItems - visibleItems, 0) : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex(prev =>
      prev >= totalItems - visibleItems ? 0 : prev + 1
    );
  };

  return (
    <section className="py-4 md:py-8">
      <div className="henig-container">

        <div className="flex justify-center">
          <SectionHeader
            caption=""
            title="New Arrivals"
            showSeparator
            className="!mb-2 md:!mb-4 text-center font-semibold tracking-wide"
          />
        </div>

        <div className="flex items-center justify-between mt-2 md:mt-8">
          {/* Left arrow */}
          <button
            onClick={prevSlide}
            className="p-2 rounded-full shadow bg-white/70 hover:bg-white transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* Carousel viewport */}
          <div className="relative overflow-hidden flex-1 mx-4">
            <div
              className="flex transition-transform duration-500"
              style={{
                transform: `translateX(-${(100 / visibleItems) * currentIndex}%)`,
              }}
            >
              {newArrivalsJewelleryProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / visibleItems}%` }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  {/* <div className="relative cursor-pointer group">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-cover rounded transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="mt-4">
                      <h3 className="text-gray-800 font-medium mb-1">{product.name}</h3>
                      <p className="text-gray-500 mb-2">{product.category}</p>
                      <p className="text-gray-900 font-semibold">{product.currency}{product.price.toFixed(2)}</p>
                    </div>
                  </div> */}
                    <ProductCard
                    product={{ ...product, isNew: true }}
                    index={index}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={nextSlide}
            className="p-2 rounded-full shadow bg-white/70 hover:bg-white transition"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
