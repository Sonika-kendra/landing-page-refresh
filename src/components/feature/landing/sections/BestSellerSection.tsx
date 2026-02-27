import Carousel from '@/components/shared/Carousel';
import { BestSellerProducts } from '@/config/landing/bestSellerProducts';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const BestSellersSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="py-5 md:py-5 section-ivory">
      <div className="henig-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="henig-heading-section text-foreground mb-4">
            Best Sellers
          </h2>
          <div className="henig-separator mx-auto" />
        </motion.div>

        <Carousel
          items={BestSellerProducts}
          visibleItems={isMobile ? 1 : 5}
          autoplayDelay={4000}
          className="mt-6"
          ifTitleVisible={false}
          ifPriceVisible={false}
          ifWhishlistVisible={false}
          ifBadgeVisible={false}
          badge="Best Seller"
          ifPurchaseButtonVisible
          purchaseButton="Shop Now"
        />
      </div>
    </section>
  );
};

export default BestSellersSection;
