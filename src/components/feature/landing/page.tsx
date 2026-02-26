import { useState, useEffect, lazy, Suspense } from 'react';
import RegistrationModal from '../../shared/RegistrationModal';
import AboutSection from './sections/AboutSection';
import CategorySection from './sections/CategorySection';
import HeroSection from './sections/HeroSection';
import PageLayout from '@/components/shared/PageLayout';

const BlogSection = lazy(() => import('./sections/BlogSection'));
const FAQSection = lazy(() => import('./sections/FAQSection'));
const InstagramSection = lazy(() => import('./sections/InstagramSection'));
const BestSellerSection = lazy(() => import('./sections/BestSellerSection'));
const SupportSection = lazy(() => import('./sections/SupportSection'));
const CertificationsAndPartnersSection = lazy(() => import('@/components/shared/CertificationsAndPartnersSection'));
const FeaturesGridSection = lazy(() => import('@/components/shared/FeaturesGridSection'));

const LandingPage = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Show registration modal on page load (once per session)
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('henig-modal-shown');

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsRegisterModalOpen(true);
        sessionStorage.setItem('henig-modal-shown', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <PageLayout onRegisterClick={() => setIsRegisterModalOpen(true)}>
      <HeroSection />
      <CategorySection />
      <AboutSection />
      <Suspense fallback={<div className="min-h-32" />}>
        <CertificationsAndPartnersSection onRegisterClick={() => setIsRegisterModalOpen(true)} />
        <FeaturesGridSection />
        <BestSellerSection />
        <FAQSection />
        <InstagramSection />
        <BlogSection />
        <SupportSection />
      </Suspense>
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </PageLayout>
  );
};

export default LandingPage;
