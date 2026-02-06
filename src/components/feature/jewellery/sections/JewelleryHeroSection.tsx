import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import jewelleryHero from '@/assets/jewellery-hero.jpg';
import { websiteUrlConfig } from '@/config/config';

const JewelleryHeroSection = () => (
  <section className="relative min-h-[45vh] pt-28 md:pt-32 pb-12 overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={jewelleryHero}
        className="w-full h-full object-cover"
        alt="Jewellery collection"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40" />
    </div>

    <div className="henig-container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <h1 className="henig-heading-display mb-4">Jewellery</h1>

        <p className="henig-body-large text-muted mb-6">
          Discover our handcrafted collection of fine jewellery, from engagement rings
          to everyday elegance.
        </p>

        <div className="flex flex-wrap gap-3">
          <a href={websiteUrlConfig.Jewellery.All}>
            <Button className="btn-henig-outline group py-4 text-md w-50 sm:w-40">
              Naturals
            </Button>
          </a>
          <a href={websiteUrlConfig.Jewellery.All}>
            <Button className="btn-henig-outline group py-4 text-md w-50 sm:w-40">
              Lab Grown
            </Button>
          </a>
          <a href={websiteUrlConfig.Jewellery.All}>
            <Button className="btn-henig-outline group py-4 text-md w-50 sm:w-40">
              Gemstones
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default JewelleryHeroSection;
