import { useEffect, useState } from 'react';
import SectionHeader from '@/components/shared/SectionHeader';
import { newArrivalsJewelleryProducts } from '@/config/jewellery/newArrivalsJewelleryProducts';
import Carousel from '@/components/shared/Carousel';

const NewArrivalsSection = () => {
  const [carouselItems, setCarouselItems] = useState([]);

  useEffect(() => {
    const items = newArrivalsJewelleryProducts.map((p) => ({
      image: p.image,
      link: `/products/${p.id}`,
      title: p.name,
      price: `${p.currency}${p.price.toFixed(2)}`,
    }));

    setCarouselItems(items);
  }, []);

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

        {carouselItems.length > 0 && (
          <Carousel
            items={carouselItems}
            visibleItems={4}
            autoplayDelay={4000}
            ifBadgeVisible={true}
            badge='New'
            ifWhishlistVisible={false}
            ifPurchaseButtonVisible={false}
            purchaseButton="Shop Now"
            ifHoverOverlayVisible={true}
            hoverOverlayBgClass="bg-black/20"
            className="mt-6"
          />
        )}
      </div>
    </section>
  );
};

export default NewArrivalsSection;
