import { useState, useEffect } from 'react';
import CategorySection from '@/components/landing/CategorySection';
import ProductGridSection from '@/components/landing/ProductGridSection';
import AboutSection from '@/components/landing/AboutSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import InstagramSection from '@/components/landing/InstagramSection';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/landing/Footer';
import RegistrationModal from '@/components/landing/RegistrationModal';
import LandingAboveTheFold from '@/components/landing/LandingAboveTheFold';

const Index = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Show registration modal on page load (with slight delay for better UX)
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
    <>
      {/* ONE FULL SCREEN */}
      <LandingAboveTheFold onRegisterClick={() => setIsRegisterModalOpen(true)} />

      {/* SCROLLING CONTENT */}
      <CategorySection />
      <ProductGridSection />
      <AboutSection />
      <FeaturesSection onRegisterClick={() => setIsRegisterModalOpen(true)} />
      <InstagramSection />
      <FAQSection />
      <Footer />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </>
  );
};

export default Index;
