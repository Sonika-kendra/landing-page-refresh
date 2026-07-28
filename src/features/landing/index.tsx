import { useEffect, lazy, Suspense } from 'react';
import AboutSection from './sections/AboutSection';
import CategorySection from './sections/CategorySection';
import HeroSection from './sections/HeroSection';
import PageLayout from '@/components/shared/layout/PageLayout';
import { useAuth } from '@/context/AuthContext';

const BlogSection = lazy(() => import('./sections/BlogSection'));
const FAQSection = lazy(() => import('./sections/FAQSection'));
const InstagramSection = lazy(() => import('./sections/InstagramSection'));
const BestSellerSection = lazy(() => import('./sections/BestSellerSection'));
const SupportSection = lazy(() => import('./sections/SupportSection'));
const CertificationsAndPartnersSection = lazy(() => import('@/components/shared/common/CertificationsAndPartnersSection'));
const FeaturesGridSection = lazy(() => import('@/components/shared/common/FeaturesGridSection'));

const LandingPage = () => {
  const { openModal, isAuthenticated } = useAuth();

  // ponytail: auto-popup on first home page load disabled per request
  // useEffect(() => {
  //   if (isAuthenticated) return;
  //   const hasSeenModal = sessionStorage.getItem('henig-modal-shown');
  //   if (!hasSeenModal) {
  //     const timer = setTimeout(() => {
  //       openModal('register');
  //       sessionStorage.setItem('henig-modal-shown', 'true');
  //     }, 2000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [isAuthenticated, openModal]);

  return (
    <PageLayout>
      <HeroSection />
      <CategorySection />
      <AboutSection />
      <Suspense fallback={<div className="min-h-32" />}>
        {/* ponytail: partner/certification section temporarily disabled per request */}
        {/* <CertificationsAndPartnersSection /> */}
        <FeaturesGridSection />
        <BestSellerSection />
        <FAQSection />
        <InstagramSection />
        <BlogSection />
        <SupportSection />
      </Suspense>
    </PageLayout>
  );
};

export default LandingPage;
