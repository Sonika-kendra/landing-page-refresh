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
const certificationImages = Object.values(certificationModules).map(
  (mod: any) => mod.default || mod
);

// Partner images
const partnerImages = import.meta.glob(
  '@/assets/landing/partner/*.{jpg,png,webp}',
  { eager: true }
);
const partnerImageList = Object.values(partnerImages).map(
  (img: any) => img.default || img
);

const logoTileClass =
  'w-full max-w-[190px] h-20 md:h-24 p-2 flex items-center justify-center overflow-hidden';
const logoWrapperClass =
  'w-full h-full flex items-center justify-center border px-2';
const logoImageClass = 'block w-full h-full object-contain object-center';

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
