import { useEffect, useState } from 'react';
import SectionHeader from '@/components/shared/SectionHeader';
import Carousel from '@/components/shared/Carousel';
import { newArrivalsJewelleryProducts } from '@/config/jewellery/newArrivalsJewelleryProducts';
import { BestSellerProducts } from '@/config/jewellery/bestSellerProducts';
import { websiteUrlConfig } from '@/config/config';
import { Button } from '@/components/ui/button';

type TabType = 'new' | 'best';

const NewArrivalsAndBestsellersSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>('new');
  const [carouselItems, setCarouselItems] = useState<any[]>([]);

  useEffect(() => {
    const source =
      activeTab === 'new'
        ? newArrivalsJewelleryProducts
        : BestSellerProducts;

    const items = source.map((p) => ({
      image: p.image,
      link: websiteUrlConfig.Jewellery.All,
      title: p.name,
      price: `${p.currency}${p.price.toFixed(2)}`,
    }));

    setCarouselItems(items);
  }, [activeTab]);

  return (
    <section className="py-6 md:py-10 bg-henig-cream">
      <div className="henig-container">
        {/* Tabs + Title Row */}
        <div className="flex items-center justify-between md:justify-start md:gap-6 flex-wrap md:flex-nowrap">
          {/* Tabs on Left */}
          <div className="flex gap-3 mb-2 md:mb-0">
            <Button
              variant={activeTab === 'new' ? 'default' : 'outline'}
              onClick={() => setActiveTab('new')}
              className="px-4 py-2 text-sm"
            >
              New Arrivals
            </Button>
            <Button
              variant={activeTab === 'best' ? 'default' : 'outline'}
              onClick={() => setActiveTab('best')}
              className="px-4 py-2 text-sm"
            >
              Bestsellers
            </Button>
          </div>

          {/* Centered Title */}
          {/* <div className="flex-1 flex justify-center">
            <SectionHeader
              caption=""
              title={activeTab === 'new' ? 'New Arrivals' : 'Bestsellers'}
              showSeparator
              className="text-center"
            />
          </div> */}
        </div>

        {/* Carousel */}
        {carouselItems.length > 0 && (
          <Carousel
            items={carouselItems}
            visibleItems={4}
            autoplayDelay={4000}
            ifTitleVisible
            ifPriceVisible
            ifWhishlistVisible={false}
            ifPurchaseButtonVisible={false}
            ifHoverOverlayVisible
            ifBadgeVisible
            badge={activeTab === 'new' ? 'New' : 'Best Seller'}
            hoverOverlayBgClass="bg-black/20"
            className="mt-6"
          />
        )}
      </div>
    </section>
  );
};

export default NewArrivalsAndBestsellersSection;
