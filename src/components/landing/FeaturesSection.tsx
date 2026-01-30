import { motion } from 'framer-motion';
import { Palette, MessageCircle, RotateCcw, Shield, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { features } from '@/config/theme';

const iconMap: Record<string, LucideIcon> = {
  Palette,
  MessageCircle,
  RotateCcw,
  Shield,
};

interface FeaturesSectionProps {
  onRegisterClick: () => void;
}

// Import all partner images dynamically
const partnerImages = import.meta.glob('@/assets/landing/partner/*.{jpg,png,webp}', { eager: true });
const partnerImageList = Object.values(partnerImages).map((img: any) => img.default || img);

const FeaturesSection = ({ onRegisterClick }: FeaturesSectionProps) => {
  return (
    <section className="py-6 md:py-10 bg-secondary">
      <div className="henig-container">

        {/* Partner CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
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
              className="w-14 h-14 rounded-full bg-accent flex items-center justify-center p-1.5"
            >
              <img
                src={src}
                alt={`Partner ${idx + 1}`}
                className="max-h-8 object-contain"
              />
            </div>
          ))}
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                {(() => {
                  const IconComponent = iconMap[feature.icon];
                  return IconComponent ? (
                    <IconComponent className="w-5 h-5 text-primary" />
                  ) : null;
                })()}
              </div>

              <h3 className="font-serif text-lg text-foreground mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-muted leading-snug">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
