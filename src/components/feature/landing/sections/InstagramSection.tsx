import { brandConfig } from '@/config/landing/theme';
import { useEffect, useState } from 'react';
import Carousel, { CarouselItem } from '@/components/shared/Carousel';
import { InstagramSvg, Linkedin, Whatsapp } from '@/assets/footer'; // use same SVGs as Footer
import { Instagram } from 'lucide-react';

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
      link: brandConfig.social.instagram,
    }));

    setItems(carouselItems);
  }, []);

  const socialIcons = [
    { src: Linkedin, href: brandConfig.social.linkedin, alt: "LinkedIn" },
    { src: InstagramSvg, href: brandConfig.social.instagram, alt: "Instagram" },
    { src: Whatsapp, href: brandConfig.social.whatsApp, alt: "WhatsApp" },
  ];

  return (
    <section className="py-5 md:py-9 section-ivory">
      <div className="henig-container">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="henig-heading-section text-foreground mb-2">Follow us for more</h2>
        </div>

        {/* Instagram Carousel */}
        <Carousel
          items={items}
          visibleItems={4}
          autoplayDelay={3500}
          className="mt-6"
          ifTitleVisible={false}
          ifPriceVisible={false}
          ifWhishlistVisible={false}
          ifBadgeVisible={false}
          ifPurchaseButtonVisible={false}
          ifHoverOverlayVisible
          hoverOverlayBgClass="bg-accent/30"
          hoverOverlayContent={
            <Instagram className="w-8 h-8 text-secondary" />
          }
          linkTarget="_blank"
        />

        {/* Social Icons as circular buttons */}
        <div className="flex justify-center gap-4 mt-6">
          {socialIcons.map(({ src, href, alt }) => (
            <a
              key={alt}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-accent hover:bg-primary transition-colors"
              title={alt}
            >
              <img src={src} alt={alt} className="w-8 h-8 brightness-0 invert" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
