import { useState } from 'react';
import RegistrationModal from '@/components/shared/common/RegistrationModal';
import PageLayout from '@/components/shared/layout/PageLayout';
import CertificationsAndPartnersSection from '@/components/shared/common/CertificationsAndPartnersSection';
import JewelleryHeroSection from './sections/JewelleryHeroSection';
import NewArrivalsAndBestsellersSection from './sections/NewArrivalsAndBestsellersSection';
import CategorySection from './sections/CategorySection';
import CatalogueBespokeSection from './sections/CatalogueBespokeSection';
import CommitmentSection from './sections/CommitmentSection';

const JewelleryPage = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <PageLayout onRegisterClick={() => setIsRegisterModalOpen(true)}>
      <JewelleryHeroSection />
      <NewArrivalsAndBestsellersSection />
      <CategorySection />
      <CertificationsAndPartnersSection onRegisterClick={() => setIsRegisterModalOpen(true)} />
      <CatalogueBespokeSection onRegisterClick={() => setIsRegisterModalOpen(true)} />
      <CommitmentSection />
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </PageLayout>
  );
};

export default JewelleryPage;
