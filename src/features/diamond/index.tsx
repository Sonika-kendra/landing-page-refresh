import Header from '@/components/shared/layout/Header';
import Footer from '@/components/shared/layout/Footer';
import BlogSection from '@/features/landing/sections/BlogSection';
import HeroSection from './sections/HeroSection';
import CategoryTypesSection from './sections/CategoryTypesSection';
import ShapeSection from './sections/ShapeSection';
import StatsSection from './sections/StatsSection';

const DiamondPage = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <HeroSection />
      <CategoryTypesSection />
      <ShapeSection />
      <StatsSection />
      <BlogSection />
    </main>
    <Footer />
  </div>
);

export default DiamondPage;
