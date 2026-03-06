import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ImageWithSkeleton from '@/components/shared/ImageWithSkeleton';

interface CertificationsAndPartnersSectionProps {
  onRegisterClick: () => void;
}

// Certifications images
const certificationModules = import.meta.glob(
  '@/assets/landing/certification/*.{png,jpg,jpeg,svg,gif}',
  { eager: true }
);
type ImageModule = string | { default: string };
const certificationImages = Object.values(certificationModules).map((mod) => {
  const image = mod as ImageModule;
  return typeof image === 'string' ? image : image.default;
});

// Partner images
const partnerImages = import.meta.glob(
  '@/assets/landing/partner/*.{jpg,png,webp,svg}',
  { eager: true }
);
const partnerImageList = Object.values(partnerImages).map((img) => {
  const image = img as ImageModule;
  return typeof image === 'string' ? image : image.default;
});

const logoTileClass =
  'w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] lg:w-[190px] max-w-[190px] h-16 sm:h-[4.5rem] md:h-20 p-1.5 sm:p-2 flex items-center justify-center overflow-hidden';
const logoWrapperClass =
  'w-full h-full flex items-center justify-center px-2';
const logoImageClass =
  'block w-full h-full object-contain object-center mx-auto';

const CertificationsAndPartnersSection = ({
  onRegisterClick,
}: CertificationsAndPartnersSectionProps) => {
  return (
    // 👇 Controlled outer spacing for section separation
    <section className="py-8 md:py-12 section-ivory">
      <div className="henig-container">

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-2 md:gap-3"
        >
          {certificationImages.map((src, index) => (
            <div key={index} className={logoTileClass}>
              <ImageWithSkeleton
                src={src}
                alt={`Certification ${index + 1}`}
                wrapperClassName={logoWrapperClass}
                className={logoImageClass}
              />
            </div>
          ))}
        </motion.div>


        {/* Divider + CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="flex items-center my-6"
        >
          <div className="flex-1 border-t border-border"></div>

          <div className="px-4">
            <Button
              size="sm"
              onClick={onRegisterClick}
              className="p-5 whitespace-nowrap bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Partner With Us
            </Button>
          </div>
          <div className="flex-1 border-t border-border"></div>
        </motion.div>

        {/* Partner Images */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-2 md:gap-3"
        >
          {partnerImageList.map((src, idx) => (
            <div key={idx} className={logoTileClass}>
              <ImageWithSkeleton
                src={src}
                alt={`Partner ${idx + 1}`}
                wrapperClassName={logoWrapperClass}
                className={logoImageClass}
              />
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default CertificationsAndPartnersSection;
