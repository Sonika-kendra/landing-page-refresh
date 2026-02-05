import { BestSellerProducts } from '@/config/jewellery/bestSellerProducts';
import SectionHeader from '@/components/shared/SectionHeader';
import Carousel, { CarouselItem } from '@/components/shared/Carousel';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { websiteUrlConfig } from '@/config/config';

const BestSellersSection = () => {
  const [carouselItems, setCarouselItems] = useState([]);

  useEffect(() => {
    const items = BestSellerProducts.map((p) => ({
      image: p.image,
      // link: `${websiteUrlConfig.Jewellery.All}`,
      title: p.name,
      price: `${p.currency}${p.price.toFixed(2)}`,
    }));

    setCarouselItems(items);
  }, []);
  

  return (
    <section className="py-5 bg-henig-cream">
      <div className="henig-container">
        <SectionHeader caption="" title="Bestsellers" showSeparator />

        {/* Carousel */}
        <Carousel
          items={carouselItems}
          visibleItems={4}
          autoplayDelay={4000}
          ifTitleVisible={true}
          ifPriceVisible={true}
          ifWhishlistVisible={false}
          ifBadgeVisible={true}
          badge='Best Seller'
          ifPurchaseButtonVisible={false}
          ifHoverOverlayVisible={true}
          hoverOverlayBgClass="bg-black/20"
          className="mt-6"
        />

        {/* View Our Bestsellers Button */}
        <div className="text-center mt-6">
          <a href={websiteUrlConfig.Jewellery.All}>
            <Button className="btn-henig-outline px-6 py-2">
              View Our Bestsellers
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
