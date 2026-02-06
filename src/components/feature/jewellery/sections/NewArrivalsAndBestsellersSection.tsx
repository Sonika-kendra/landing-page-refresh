import { useEffect, useState } from 'react';
import SectionHeader from '@/components/shared/SectionHeader';
import Carousel from '@/components/shared/Carousel';
import { newArrivalsJewelleryProducts } from '@/config/jewellery/newArrivalsJewelleryProducts';
import { BestSellerProducts } from '@/config/jewellery/bestSellerProducts';
import { websiteUrlConfig } from '@/config/config';
import clsx from 'clsx';

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
        {/* Header */}
        <div className="flex justify-center">
          <SectionHeader
            caption=""
            title={activeTab === 'new' ? 'New Arrivals' : 'Bestsellers'}
            showSeparator
            className="text-center"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => setActiveTab('new')}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm border transition',
              activeTab === 'new'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-300 hover:border-black'
            )}
          >
            New arrivals
          </button>

          <button
            onClick={() => setActiveTab('best')}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm border transition',
              activeTab === 'best'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-300 hover:border-black'
            )}
          >
            Bestsellers
          </button>
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
