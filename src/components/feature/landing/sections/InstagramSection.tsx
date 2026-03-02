import Carousel from "@/components/shared/Carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { socialConfig, socialIcons } from "@/config/landing/socialMedia";

const InstagramSection = () => {
  const isMobile = useIsMobile();

  const items = socialConfig.map((item) => ({
    image: item.image,
    link: item.link,
    hoverOverlayContent: item.icon ? (
      <img
        src={item.icon.src}
        alt={item.icon.alt}
        className="w-12 h-12 object-contain grayscale brightness-0 invert"
      />
    ) : null,
  }));

  return (
    <section className="py-5 md:py-9 section-ivory">
      <div className="henig-container">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="henig-heading-section text-foreground mb-2">
            Stay Connected with @Henigdiamonds
          </h2>
        </div>

        {/* Carousel */}
        <Carousel
          items={items}
          visibleItems={isMobile ? 1 : 4}
          autoplayDelay={3500}
          className="mt-6"
          ifTitleVisible={false}
          ifPriceVisible={false}
          ifWhishlistVisible={false}
          ifBadgeVisible={false}
          ifPurchaseButtonVisible={false}
          ifHoverOverlayVisible
          hoverOverlayBgClass="bg-accent/30"
          linkTarget="_blank"
        />

        {/* Social Buttons */}
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
              <img
                src={src}
                alt={alt}
                className="w-8 h-8 brightness-0 invert"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
