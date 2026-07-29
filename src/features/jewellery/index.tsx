import PageLayout from '@/components/shared/layout/PageLayout';
import CertificationsAndPartnersSection from '@/components/shared/common/CertificationsAndPartnersSection';
import JewelleryHeroSection from './sections/JewelleryHeroSection';
import NewArrivalsAndBestsellersSection from './sections/NewArrivalsAndBestsellersSection';
import CategorySection from './sections/CategorySection';
import CatalogueBespokeSection from './sections/CatalogueBespokeSection';
import SupportSection from '@/features/landing/sections/SupportSection';

const JewelleryPage = () => (
  <PageLayout>
    <JewelleryHeroSection />
    <NewArrivalsAndBestsellersSection />
    <CategorySection />
    {/* ponytail: partner/certification section temporarily disabled per request */}
    {/* <CertificationsAndPartnersSection /> */}
    <CatalogueBespokeSection />
    <SupportSection />
  </PageLayout>
);

export default JewelleryPage;
