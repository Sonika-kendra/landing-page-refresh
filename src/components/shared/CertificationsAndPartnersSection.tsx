import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

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
          className="pb-4"
        >
          <div className="flex flex-wrap justify-center items-center gap-4">
            {certificationImages.map((src, index) => (
              <div
                key={index}
                className="inline-flex items-center justify-center px-2 py-1"
              >
                <img
                  src={src}
                  alt={`Certification ${index + 1}`}
                  className="h-8 md:h-10 object-contain"
                />
              </div>
            ))}
          </div>
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
              className="btn-henig-outline whitespace-nowrap"
              size="sm"
              onClick={onRegisterClick}
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
          className="flex flex-wrap justify-center gap-4 items-center"
        >
          {partnerImageList.map((src, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center w-32 h-14 md:w-36 md:h-16"
            >
              <img
                src={src}
                alt={`Partner ${idx + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default CertificationsAndPartnersSection;
