import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import jewelleryHero from '@/assets/jewellery/hero/banner.png';
import { websiteUrlConfig } from '@/config/site';
import ImageWithSkeleton from '@/components/shared/common/ImageWithSkeleton';
import { useAuth } from '@/context/AuthContext';

const JewelleryHeroSection = () => {
  const { isAuthenticated, openModal } = useAuth();
  const navigate = useNavigate();

  const handleShopClick = () => {
    if (isAuthenticated) {
      navigate(websiteUrlConfig.Jewellery.All);
    } else {
      openModal('login', websiteUrlConfig.Jewellery.All);
    }
  };

  return (
  <section className="relative min-h-[45vh] pt-28 md:pt-32 pb-12 overflow-hidden">
    
    {/* Background Image */}
    <div className="absolute inset-0">
      <ImageWithSkeleton
        src={jewelleryHero}
        wrapperClassName="w-full h-full"
        className="w-full h-full object-cover"
        alt="Jewellery collection"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </div>

    {/* Content */}
    <div className="henig-container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl text-white"
      >
        <h1 className="henig-heading-display mb-4 text-white">
          Jewellery
        </h1>

        <p className="henig-body-large text-white/90 mb-6">
          Explore our fine jewellery collection, <br></br>
          Crafted with your clients in mind.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleShopClick}
            className="bg-primary border-primary text-white py-4 px-6 text-md w-auto transition-colors duration-300 hover:bg-white hover:text-accent hover:border-white [&:hover_svg]:translate-x-2"
          >
            Lab Diamonds
            <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300" />
          </Button>

          <Button
            variant="outline"
            onClick={handleShopClick}
            className="bg-primary border-primary text-white py-4 px-6 text-md w-auto transition-colors duration-300 hover:bg-white hover:text-accent hover:border-white [&:hover_svg]:translate-x-2"
          >
            Natural Diamonds
            <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300" />
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
  );
};

export default JewelleryHeroSection;