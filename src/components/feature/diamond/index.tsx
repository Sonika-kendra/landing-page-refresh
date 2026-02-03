import { useState } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import RegistrationModal from '@/components/shared/RegistrationModal';

import HeroSection from '@/components/feature/diamond/HeroSection';
import FilterSection from '@/components/feature/diamond/FilterSection';
import CollectionsGrid from '@/components/feature/diamond/CollectionsGrid';
import FeaturedCollections from '@/components/feature/diamond/FeaturedCollections';
import StatsSection from '@/components/feature/diamond/StatsSection';
import CTASection from '@/components/feature/diamond/CTASection';

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
