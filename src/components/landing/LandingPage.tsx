import { useState, useEffect } from 'react';

import CategorySection from './CategorySection';
import ProductGridSection from './ProductGridSection';
import AboutSection from './AboutSection';
import FeaturesSection from './FeaturesSection';
import InstagramSection from './InstagramSection';
import FAQSection from './FAQSection';
import Footer from './Footer';
import RegistrationModal from './RegistrationModal';
import LandingAboveTheFold from './hero/LandingAboveTheFold';

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
    <>
      {/* HERO / ABOVE THE FOLD */}
      <LandingAboveTheFold
        onRegisterClick={() => setIsRegisterModalOpen(true)}
      />

      {/* PAGE SECTIONS */}
      <CategorySection />
      <AboutSection />
      <FeaturesSection onRegisterClick={() => setIsRegisterModalOpen(true)} />
      <ProductGridSection />
      <FAQSection />
      <InstagramSection />
      <Footer />

      {/* MODAL */}
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </>
  );
};

export default LandingPage;
