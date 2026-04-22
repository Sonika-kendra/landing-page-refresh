import { useState } from 'react';
import Header from '@/components/shared/layout/Header';
import Footer from '@/components/shared/layout/Footer';
import RegistrationModal from '@/components/shared/common/RegistrationModal';
import HeroSection from './sections/HeroSection';
import FilterSection from './sections/FilterSection';
import CollectionsGrid from './sections/CollectionsGrid';
import FeaturedCollections from './sections/FeaturedCollections';
import StatsSection from './sections/StatsSection';
import CTASection from './sections/CTASection';

const DiamondPage = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onRegisterClick={() => setIsRegisterModalOpen(true)} />
      <main>
        <HeroSection />
        <FilterSection />
        <CollectionsGrid />
        <FeaturedCollections />
        <StatsSection />
        <CTASection onRegisterClick={() => setIsRegisterModalOpen(true)} />
      </main>
      <Footer />
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default DiamondPage;
