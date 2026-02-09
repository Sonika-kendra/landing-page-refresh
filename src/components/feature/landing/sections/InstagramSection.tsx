import { brandConfig } from '@/config/landing/theme';
import { Instagram } from 'lucide-react';
import { useEffect, useState } from 'react';
import Carousel, { CarouselItem } from '@/components/shared/Carousel';

const InstagramSection = () => {
  const [items, setItems] = useState<CarouselItem[]>([]);

  useEffect(() => {
    const images = Object.values(
      import.meta.glob('@/assets/landing/socialmedia/*.{jpg,jpeg,png,webp}', {
        eager: true,
        import: 'default',
      })
    ) as string[];

    const carouselItems: CarouselItem[] = images.map((img) => ({
      image: img,
      link: brandConfig.social.instagram, // all items link to Instagram
    }));

    setItems(carouselItems);
  }, []);

  return (
    <section className="py-5 md:py-9 section-ivory">
      <div className="henig-container">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="henig-heading-section text-foreground mb-2">
            @HenigDiamonds
          </h2>
        </div>

        {/* Instagram Carousel */}
        <Carousel
          items={items}
          visibleItems={4}
          autoplayDelay={3500}
          className="mt-6"

          /* Disable product UI */
          ifTitleVisible={false}
          ifPriceVisible={false}
          ifWhishlistVisible={false}
          ifBadgeVisible={false}
          ifPurchaseButtonVisible={false}

          /* Hover overlay */
          ifHoverOverlayVisible
          hoverOverlayBgClass="bg-accent/30"
          hoverOverlayContent={
            <Instagram className="w-8 h-8 text-secondary" />
          }
          linkTarget="_blank"
        />
      </div>
    </section>
  );
};

export default InstagramSection;
