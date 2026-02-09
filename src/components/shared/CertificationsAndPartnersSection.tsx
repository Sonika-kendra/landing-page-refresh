// CertificationsAndPartnersSection.tsx
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
    <section className="py-4 md:py-6 section-ivory">
      <div className="henig-container">
        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-b border-border pb-6"
        >
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            {certificationImages.map((src, index) => (
              <div
                key={index}
                className="inline-flex items-center justify-center bg-accent/20 rounded-lg px-3 py-2"
              >
                <img
                  src={src}
                  alt={`Certification ${index + 1}`}
                  className="h-8 md:h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Partner CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center my-6"
        >
          <Button
            className="btn-henig-outline"
            size="sm"
            onClick={onRegisterClick}
          >
            Partner With Us
          </Button>
        </motion.div>

        {/* Partner Images */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-10 items-center"
        >
          {partnerImageList.map((src, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center bg-primary p-2 rounded-md w-36 h-18 md:w-40 md:h-20"
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
