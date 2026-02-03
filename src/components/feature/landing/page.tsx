import { useState, useEffect } from 'react';
import Footer from '../../shared/Footer';
import RegistrationModal from '../../shared/RegistrationModal';
import { AboutSection, BlogSection, CategorySection, FAQSection, FeaturesGridSection, FeaturesSection, HeroSection, InstagramSection, ProductGridSection } from './index';
import PageLayout from '@/components/shared/PageLayout';

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
      <FeaturesSection onRegisterClick={() => setIsRegisterModalOpen(true)} />
      <ProductGridSection />
      <FAQSection />
      <InstagramSection />
      <BlogSection />
      <FeaturesGridSection />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </PageLayout>
  );
};

export default LandingPage;
