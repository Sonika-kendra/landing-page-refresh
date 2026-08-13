import HeroAnnouncement from './hero/HeroAnnouncement';
import HeroCarousel from './hero/HeroCarousel';

const HeroSection = ({ className = '' }) => {
  return (
    <section className="relative w-full section-white overflow-hidden">
      <HeroCarousel />

      {/* Hero content */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-8 md:pb-12 lg:pb-16 text-left z-10 space-y-4">
        <HeroAnnouncement show={true} />
      </div>
    </section>
  );
};

export default HeroSection;