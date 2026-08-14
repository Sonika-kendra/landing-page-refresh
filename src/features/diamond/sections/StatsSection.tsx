import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageWithSkeleton from '@/components/shared/common/ImageWithSkeleton';
import { useAuth } from '@/context/AuthContext';

const certificationModules = import.meta.glob(
  '@/assets/landing/certification/*.{png,jpg,jpeg,svg,gif}',
  { eager: true }
);
type ImageModule = string | { default: string };
const certificationImages = Object.values(certificationModules).map((mod) => {
  const image = mod as ImageModule;
  return typeof image === 'string' ? image : image.default;
});

const StatsSection = () => {
  const { openModal } = useAuth();

  return (
    <section className="py-10 md:py-14 section-ivory">
      <div className="henig-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="henig-caption text-muted-foreground mb-4 block text-lg md:text-xl font-semibold">Ethical Sourcing</span>
          <p className="text-base md:text-lg text-muted-foreground font-light max-w-5xl mx-auto mb-4">
            At Henig Diamonds, ethical sourcing starts with knowing exactly where every stone has come from and how it was handled long before it reached us. Our responsibility lies in who we choose to work with: every natural diamond we offer comes from suppliers who meet strict ethical and compliance standards so you can trust every stone is conflict-free.
          </p>
          <p className="text-base md:text-lg text-muted-foreground font-light max-w-5xl mx-auto">
            We hold our lab-grown range to the same standard, giving retailers a responsibly produced alternative with a significantly lighter environmental footprint. Natural or lab-grown, every diamond that reaches you carries one commitment: sourced with integrity, certified for assurance, and supplied by a partner who takes sustainability as seriously as brilliance.
          </p>
        </motion.div>

        <div className="flex items-center mb-8">
          <div className="flex-1 border-t border-border" />
          <div className="px-4">
            <Button
              size="sm"
              className="p-5 whitespace-nowrap bg-accent text-accent-foreground border border-primary pointer-events-none"
            >
              Our Certifications
            </Button>
          </div>
          <div className="flex-1 border-t border-border" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mb-6"
        >
          {certificationImages.map((src, index) => (
            <div
              key={index}
              className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] lg:w-[190px] max-w-[190px] h-16 sm:h-[4.5rem] md:h-20 p-1.5 sm:p-2 flex items-center justify-center overflow-hidden rounded-sm border border-border/60 bg-card/80 dark:bg-card/60 transition-colors"
            >
              <ImageWithSkeleton
                src={src}
                alt={`Certification ${index + 1}`}
                wrapperClassName="w-full h-full flex items-center justify-center px-2"
                className="block w-full h-full object-contain object-center mx-auto"
              />
            </div>
          ))}
        </motion.div>

        <div className="flex items-center">
          <div className="flex-1 border-t border-border" />
          <div className="px-4">
            <Button
              size="sm"
              className="group p-5 whitespace-nowrap bg-accent text-accent-foreground border border-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              onClick={() => openModal('register')}
            >
              Partner With Us
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="flex-1 border-t border-border" />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
