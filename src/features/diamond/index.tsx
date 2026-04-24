import Header from '@/components/shared/layout/Header';
import Footer from '@/components/shared/layout/Footer';
import HeroSection from './sections/HeroSection';
import FilterSection from './sections/FilterSection';
import CollectionsGrid from './sections/CollectionsGrid';
import FeaturedCollections from './sections/FeaturedCollections';
import StatsSection from './sections/StatsSection';
import CTASection from './sections/CTASection';

const DiamondPage = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <HeroSection />
      <FilterSection />
      <CollectionsGrid />
      <FeaturedCollections />
      <StatsSection />
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default DiamondPage;
