import { useState } from 'react';
import Footer from '@/components/shared/Footer';
import RegistrationModal from '@/components/shared/RegistrationModal';
import Header from '@/components/shared/Header';
import { NavigationTabsSection, NewArrivalsSection, CommitmentSection, CategorySection, BestsellersSection, CertificationsSection, CTASection, JewelleryAboveTheFold } from '.';
import PageLayout from '@/components/shared/PageLayout';

const JewelleryPage = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <PageLayout onRegisterClick={() => setIsRegisterModalOpen(true)}>

      <JewelleryAboveTheFold />
      <NavigationTabsSection viewMode={viewMode} onViewChange={setViewMode} />
      <NewArrivalsSection viewMode={viewMode} />
      <CommitmentSection />
      <CategorySection />
      <BestsellersSection />
      <CertificationsSection />
      <CTASection onRegisterClick={() => setIsRegisterModalOpen(true)} />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </PageLayout>
  );
};

export default JewelleryPage;
