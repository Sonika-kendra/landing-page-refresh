import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';

interface Props {
  onRegisterClick: () => void;
}

const LandingAboveTheFold = ({ onRegisterClick }: Props) => {
  return (
    <section className="h-screen flex flex-col bg-background">
      {/* Header */}
      <Header onRegisterClick={onRegisterClick} />

      {/* Hero fills remaining space */}
      <div className="flex-1">
        <HeroSection />
      </div>
    </section>
  );
};

export default LandingAboveTheFold;
