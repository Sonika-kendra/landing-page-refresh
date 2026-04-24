import PageLayout from '@/components/shared/layout/PageLayout';
import CertificationsAndPartnersSection from '@/components/shared/common/CertificationsAndPartnersSection';
import JewelleryHeroSection from './sections/JewelleryHeroSection';
import NewArrivalsAndBestsellersSection from './sections/NewArrivalsAndBestsellersSection';
import CategorySection from './sections/CategorySection';
import CatalogueBespokeSection from './sections/CatalogueBespokeSection';
import CommitmentSection from './sections/CommitmentSection';

const JewelleryPage = () => (
  <PageLayout>
    <JewelleryHeroSection />
    <NewArrivalsAndBestsellersSection />
    <CategorySection />
    <CertificationsAndPartnersSection />
    <CatalogueBespokeSection />
    <CommitmentSection />
  </PageLayout>
);

export default JewelleryPage;
