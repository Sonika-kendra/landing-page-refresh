import { useEffect, useState } from 'react';
import Carousel, { type CarouselItem } from '@/components/shared/Carousel';
import { newArrivalsJewelleryProducts } from '@/config/jewellery/newArrivalsJewelleryProducts';
import { BestSellerProducts } from '@/config/jewellery/bestSellerProducts';
import { websiteUrlConfig } from '@/config/config';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

type TabType = 'new' | 'best';

const NewArrivalsAndBestsellersSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>('new');
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const isMobile = useIsMobile();

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
    <section className="py-6 md:py-10 section-ivory">
      <div className="henig-container flex flex-col items-center">
        {/* Tabs */}
        <div className="flex justify-center mb-6 flex-wrap gap-2 sm:gap-3">
          <Button
            variant={activeTab === 'new' ? 'default' : 'outline'}
            onClick={() => setActiveTab('new')}
            className="min-h-10 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium"
          >
            New Arrivals
          </Button>
          <Button
            variant={activeTab === 'best' ? 'default' : 'outline'}
            onClick={() => setActiveTab('best')}
            className="min-h-10 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium"
          >
            Bestsellers
          </Button>
        </div>

        {/* Carousel */}
        {carouselItems.length > 0 && (
          <Carousel
            items={carouselItems}
            visibleItems={isMobile ? 1 : 4}
            autoplayDelay={4000}
            ifTitleVisible
            ifPriceVisible={false}
            ifWhishlistVisible={false}
            ifPurchaseButtonVisible={false}
            ifHoverOverlayVisible
            ifBadgeVisible
            badge={activeTab === 'new' ? 'New' : 'Best Seller'}
            hoverOverlayBgClass="bg-black/20"
            className="w-full"
          />
        )}
      </div>
    </section>
  );
};

export default NewArrivalsAndBestsellersSection;
