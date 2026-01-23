import { useState, useEffect } from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import CategorySection from '@/components/landing/CategorySection';
import ProductGridSection from '@/components/landing/ProductGridSection';
import AboutSection from '@/components/landing/AboutSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import InstagramSection from '@/components/landing/InstagramSection';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/landing/Footer';
import RegistrationModal from '@/components/landing/RegistrationModal';

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

  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onRegisterClick={handleOpenRegisterModal} />
      
      <main>
        <HeroSection />
        <CategorySection />
        <ProductGridSection />
        <AboutSection />
        <FeaturesSection onRegisterClick={handleOpenRegisterModal} />
        <InstagramSection />
        <FAQSection />
      </main>
      
      <Footer />
      
      <RegistrationModal 
        isOpen={isRegisterModalOpen} 
        onClose={handleCloseRegisterModal} 
      />
    </div>
  );
};

export default Index;
