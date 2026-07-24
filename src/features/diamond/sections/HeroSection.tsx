import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import diamondsShowcase from '@/assets/landing/category/Diamonds.png';
import { websiteUrlConfig } from '@/config/site';
import { useAuth } from '@/context/AuthContext';

const HeroSection = () => {
  const { isAuthenticated, openModal } = useAuth();
  return (
    <section className="relative min-h-[45vh] pt-28 md:pt-32 pb-12 overflow-hidden bg-accent">
      <div className="absolute inset-0">
        <img
          src={diamondsShowcase}
          alt="Natural and lab-grown diamonds"
          className="w-full h-full object-cover object-[50%_80%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent/70 to-accent/10" />
      </div>

      <div className="henig-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h1 className="henig-heading-display text-secondary mb-6">Diamonds</h1>
          <Link
            to={websiteUrlConfig.Diamonds.All}
            onClick={(e) => { if (!isAuthenticated) { e.preventDefault(); openModal('login', websiteUrlConfig.Diamonds.All); } }}
          >
            <Button
              variant="outline"
              className="bg-primary border-primary text-white py-4 px-6 text-md w-auto transition-colors duration-300 hover:bg-white hover:text-accent hover:border-white [&:hover_svg]:translate-x-2"
            >
              Shop All Diamonds
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
