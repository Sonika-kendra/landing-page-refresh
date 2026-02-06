import { useState } from 'react';
import RegistrationModal from '@/components/shared/RegistrationModal';
import { NewArrivalsSection, CommitmentSection, CategorySection, BestSellersSection, JewelleryHeroSection, CatalogueBespokeSection, NewArrivalsAndBestsellersSection } from '.';
import PageLayout from '@/components/shared/PageLayout';
import CertificationsAndPartnersSection from '@/components/shared/CertificationsAndPartnersSection';

const JewelleryPage = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <PageLayout onRegisterClick={() => setIsRegisterModalOpen(true)}>
      <JewelleryHeroSection />
      {/* <NewArrivalsSection />
      <BestSellersSection /> */}
      <NewArrivalsAndBestsellersSection />
      <CategorySection />
      <CertificationsAndPartnersSection onRegisterClick={() => setIsRegisterModalOpen(true)} />
      <CatalogueBespokeSection />
      <CommitmentSection />
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </PageLayout>
  );
};

export default JewelleryPage;
